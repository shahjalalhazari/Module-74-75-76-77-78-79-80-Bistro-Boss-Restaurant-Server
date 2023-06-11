const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Bistro Boss server is running");
});


//////////// MongoDb Connection Start //////////////
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cp5mulo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const menuCollection = client.db("BistroBossDb").collection("menu");
        const reviewCollection = client.db("BistroBossDb").collection("reviews");
        const cartCollection = client.db("BistroBossDb").collection("carts");


        // Menu Collections
        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })


        // Reviews Collections
        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })


        /////////// Cart Collections ////////////
        // get all the cart item of current user
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([])
            }
            const query = {email: email};
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        // add item to cart of current user
        app.post("/carts", async (req, res) => {
            const item = req.body;
            const result = await cartCollection.insertOne(item);
            res.send(result);
        });

        // delete item from current user cart
        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id: new ObjectId(id)};
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Bistro Boss server is running on ${port}`)
})