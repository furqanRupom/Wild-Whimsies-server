const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.WILD_NAME}:${process.env.WILD_PASS}@cluster0.eujpnmx.mongodb.net/?retryWrites=true&w=majority`;

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



    const tabsToysCollection = client.db('tabToysDB').collection('tabToys');

    app.get('/tabToys',async(req,res)=>{
      const result = await tabsToysCollection.find().toArray()
      res.send(result)
    })


    const toysAnimalsCollection = client.db('toysAnimalsDB').collection('toysAnimals');

    app.post('/toys',async(req,res)=>{
      const body = req.body;
      // console.log(body)
      const result = await toysAnimalsCollection.insertOne(body)
      res.send(result);
    })


    app.get('/toys',async(req,res)=>{
      const result = await toysAnimalsCollection.find().toArray()
      res.send(result);
    })


    app.get('/toys',async(req,res)=>{
      const cursor = {email:req.query.email}
      const result = await toysAnimalsCollection.findOne(cursor);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/',(req,res)=>{
    res.send('wild whimsies app is in progress');
})


app.listen(port,()=>{
    console.log(`wild whimsies app is running on port ${port}`)
})