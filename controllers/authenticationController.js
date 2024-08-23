const  {MongoClient,ServerApiVersion} = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcrypt');
const passwordEncoded = encodeURIComponent('TL@875dDMm')
const URI = `mongodb+srv://tristansup5:${passwordEncoded}@cluster0.oqqijbg.mongodb.net/UsersDB1?retryWrites=true&w=majority&appName=Cluster0`
const usersController = require('./usersController');
async function handleAuth(req,res){
        const username = req.body.username;
        const password = req.body.password;

        console.log("Recevied: " + password);
        console.log("given password: " + password);
        
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
            const foundUser = await collection.findOne({username: username})

            
            if(!foundUser) return res.sendStatus(403);
            
            const match = await bcrypt.compare(password.toString(), foundUser.password);

            if(match) return res.sendStatus(200);
            else{
                res.sendStatus(403);
            }
 
       }catch(err){
            res.sendStatus(403);
            console.log(err);
       }finally{
            await client.close()
        }
        
        //check password
       


        
}

module.exports = {handleAuth}