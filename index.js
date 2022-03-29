const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbjvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("test_react_portal");
    const imagesCollection = database.collection("images");

    app.get("/images", async (req, res) => {
      const cursor = imagesCollection.find({});
      const images = await cursor.toArray();
      res.send(images);
    });

    // post images data

    app.post("/images", async (req, res) => {
      const images = req.body;
      const result = await imagesCollection.insertOne(images);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello test react");
});

app.listen(port, () => {
  console.log(` listening at ${port}`);
});
