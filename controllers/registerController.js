const {MongoClient,ServerApiVersion} = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();
const passwordEncoded = encodeURIComponent('TL@875dDMm')
const URI = `mongodb+srv://tristansup5:${passwordEncoded}@cluster0.oqqijbg.mongodb.net/UsersDB1?retryWrites=true&w=majority&appName=Cluster0`

async function handleRegister(req,res){
    console.log("Inside handleRegister");
    console.log("URI: " + URI)
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(JSON.stringify(password),10);
    console.log("hashedPassword " + hashedPassword);
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })

    try{
        await client.connect();
        console.log("Connected successfully")
        
        const collection = client.db('UsersDB1').collection('Authentication');
        const usersArr = await collection.find({}).toArray();
        const newUserId = usersArr.length > 0? usersArr[usersArr.length -1]._id + 1: 1;
        const newUser = {
            _id: newUserId,
            username: username,
            password: hashedPassword
        }

        
        collection.insertOne(newUser);
        client.db('UsersDB1').createCollection(username);
        console.log("successfully inserted new user");
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(401);
    }finally{
        await client.close()
    }
}

module.exports = {handleRegister};