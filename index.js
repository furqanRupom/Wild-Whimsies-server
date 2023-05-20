const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
require("dotenv").config();
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.WILD_NAME}:${process.env.WILD_PASS}@cluster0.eujpnmx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysAnimalsCollection = client
      .db("toysAnimalsDB")
      .collection("toysAnimals");

    app.post("/toys", async (req, res) => {
      const body = req.body;
      // console.log(body)
      const result = await toysAnimalsCollection.insertOne(body);
      res.send(result);
    });

    app.get("/AllToys", async (req, res) => {
      const result = await toysAnimalsCollection.find().toArray();
      res.send(result);
    });

    app.get("/toys", async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      let query = toysAnimalsCollection.find();
      if (limit !== -1) {
        query = query.limit(limit);
      }
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/SearchToys/:name", async (req, res) => {
      const SearchName = req.params.name;
      const query = { name: { $regex: SearchName, $options: "i" } };
      const result = await toysAnimalsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/MyToys", async (req, res) => {
      const { sortOrder, sellerEmail } = req?.query;

      if (sortOrder && sellerEmail) {
        let query = { sellerEmail: sellerEmail };
        let sortOptions = {};
        sortOptions["price"] = sortOrder === "desc" ? -1 : 1;

        try {
          const result = await toysAnimalsCollection
            .find(query)
            .sort(sortOptions)
            .toArray();

          res.send(result);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      } else if (sellerEmail) {
        const query = { sellerEmail: sellerEmail };
        const result = await toysAnimalsCollection.find(query).toArray();
        res.send(result);
      }
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysAnimalsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysAnimalsCollection.findOne(query);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedToys = {
        $set: {
          price: updatedInfo.price,
          description: updatedInfo.description,
          quantity_available: updatedInfo.quantity_available,
        },
      };
      const options = { upsert: true };

      const result = await toysAnimalsCollection.updateOne(
        query,
        updatedToys,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("wild whimsies app is in progress");
});

app.listen(port, () => {
  console.log(`wild whimsies app is running on port ${port}`);
});
