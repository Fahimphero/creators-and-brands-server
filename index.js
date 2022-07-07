const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express();


// middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8bypx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function VerifyJWT(req, res, next) {
    console.log('abc')
    // const authHeader = req.headers.authorization
    // if (!authHeader) {
    //     return res.status(401).send({ message: 'UnAuthorized Access' })
    // }
}


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('MongoDB connected')
//     // perform actions on the collection object
//     client.close();
// });




async function run() {
    await client.connect();


    const usersCollection = client.db('Creator-And-User').collection('Users');
    const brandsCollection = client.db('Creator-And-User').collection('Brands');

    try {
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const role = req.body.role;
            console.log(role)
            const filter = { email: email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token, role })
        })

        app.put('/brand/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const role = req.body.role;
            console.log(user)
            const filter = { email: email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: user,
            }
            const result = await brandsCollection.updateOne(filter, updatedDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token, role })
        })

        app.put('/brand/ad/:email', async (req, res) => {
            const email = req.params.email;
            const currentUser = req.body;
            console.log(email)
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    url: currentUser.url,

                }
            };
            const result = await brandsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })


        app.get('/creators', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const creators = await cursor.toArray();
            res.send(creators);
        })

        app.get('/brands', async (req, res) => {
            const query = {};
            const cursor = brandsCollection.find(query);
            const brands = await cursor.toArray();
            res.send(brands);
        })


        //   file upload



    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Creator-And-Brand Server')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})