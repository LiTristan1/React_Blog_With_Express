const {MongoClient, ServerApiVersion} = require('mongodb');
const bcrypt = require('bcrypt');
const passwordEncoded = encodeURIComponent('TL@875dDMm')
const URI = `mongodb+srv://tristansup5:${passwordEncoded}@cluster0.oqqijbg.mongodb.net/UsersDB1?retryWrites=true&w=majority&appName=Cluster0`


async function handleGet(req,res){
    console.log("Inside handle Get");
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })

    try{
        await client.connect();
        const collection = client.db('UsersDB1').collection('Authentication');
        const cursor =  await collection.find({}).toArray();
        
        console.log("Length: " + cursor.length);
        for(let i = 0; i < cursor.length; i++){
            console.log(cursor[i])
        }
        return res.status(200).json({cursor});
    }catch(error){
        console.log("Error: " + error);
    }finally{
        await client.close();
    }
}

async function handlePatch(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })

    try{
        const collection = client.db('UsersDB1').collection('Authentication');
        
        const encryptedPass = await bcrypt.hash(JSON.stringify(password),10);
        const updatedUser = {
            $set:{
                username: username,
                password: encryptedPass
            }
        }

        await collection.updateOne({username:username},updatedUser, function(err,result){
            if(result){
                console.log("Updated!")
                res.json({"Message ": "Successfully uploaded one document"})
                res.sendStatus(200);
                
            }
            else{
                res.sendStatus(401);
            }
        });
    }catch(err){
        console.log(err);
    }finally{
        await client.close()
    }

}


async function handleSpecificGet(req,res){
    const id = parseInt(req.params.id);
    console.log(id);
   
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })

    try{
        await client.connect();
        
        const collection = client.db("UsersDB1").collection('Authentication')
        
        const foundUser = await collection.findOne({_id: id})

        return res.status(200).json({foundUser})
    }catch(error){
        console.log("Error: " + error);
        res.sendStatus(404);
    }finally{
        await client.close();
    }

}


module.exports = {handleGet,handlePatch,handleSpecificGet}