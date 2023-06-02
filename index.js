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
    ServerApiVersion
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
        const reviewsCollection = client.db("BistroBossDb").collection("reviews");

        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find().toArray();
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