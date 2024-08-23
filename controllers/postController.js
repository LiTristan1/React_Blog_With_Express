const {MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const mongodb = require('mongodb');
const passwordEncoded = encodeURIComponent('TL@875dDMm')
const URI = `mongodb+srv://tristansup5:${passwordEncoded}@cluster0.oqqijbg.mongodb.net/UsersDB1?retryWrites=true&w=majority&appName=Cluster0`;
const Grid = require('gridfs-stream');
const fs = require('fs');
const {Readable} = require('stream');
async function insertImage(req,res){
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })
    try{
        await client.connect();
        const db = client.db('UsersDB1');
        const bucket = new mongodb.GridFSBucket(db);
        fs.createReadStream('./images/water.jpg').
        pipe(bucket.openUploadStream('images/water.jpg', {
            chunkSizeBytes: 1048576,
            metadata: { id:3, post_id: 1 }
        }));

       
    }catch(err){
        console.log(err);
    }
    
}
async function updatePostColl(req,res){
    //Create client object for connection
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })
    //id must be in int format
    const id = parseInt(req.params.id);
    const title = req.body.title;
    const description = req.body.description;
    console.log(id);
    try{
        //connect with mongodb
        await client.connect();

        //Get user
        const collection = client.db('UsersDB1').collection('Authentication');
        const foundUser = await collection.findOne({_id:id});
        console.log("Found User: " + foundUser.username);
        console.log("After foundUser");
        
        //Get user name and retrieve array of posts
        const userPosts = client.db('UsersDB1').collection(foundUser.username)
        console.log("After user Posts")
        const userPostsArr = await userPosts.find({}).toArray();
        const newPostId = userPostsArr.length > 0? userPostsArr[userPostsArr.length - 1]._id + 1 : 1;
        console.log("New Post ID:" + newPostId)
        const newPost = {
            _id: newPostId,
            title: title,
            description: description
        }
        // add new post to document
        await userPosts.insertOne(newPost);
        await insertImage(req,res);
        res.sendStatus(200);

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }finally{
        await client.close()
    }
}

async function getUserPosts(req,res){
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
        console.log("Inside get user spec post")
        await client.connect();
        const users = client.db('UsersDB1').collection('Authentication');
        const foundUser = await users.findOne({_id: id});
        console.log("Founduser " + foundUser)
        const userCollection = client.db('UsersDB1').collection(foundUser.username);
        const allPostsArr = await userCollection.find({}).toArray();

        
        return res.status(200).json({allPostsArr});
    }catch(err){

    }
 
}
async function getImagePost(req,res){
    const id = req.params.id;
    const post_id = req.params.id2;
    console.log(id);
    console.log(post_id);
    const client = new MongoClient(URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    })

    try{
        const db = client.db('UsersDB1');
        const bucket = new mongodb.GridFSBucket(db);

        const cursor = await bucket.find({}).toArray();
        console.log(cursor[0].metadata);
        
        const dataResponse =  bucket.openDownloadStreamByName(cursor[0].filename);
       res.set('Content-Type','image/jpg');

       dataResponse.pipe(res);
    }catch(err){
        console.log(err);
    }
}

module.exports = {insertImage,updatePostColl,getUserPosts,getImagePost}