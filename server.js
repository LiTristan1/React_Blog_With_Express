const express = require('express');
const path = require('path');
const app = express();
const PORT = 3500;
const cors = require('cors');

const whiteList = ['https://www.google.com','http://localhost:3000','http://localhost:3500']
const corsOptions = {
    origin: function(origin,callback){
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by cors'))
        }
    }
}


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.get("/", express.static(path.join(__dirname, "./public")));
//app.use(express.urlencoded)
app.use('/register',require('./routes/api/register'));
app.use('/users',require('./routes/api/users'));
app.use('/auth',require('./routes/api/auth'));
app.use('/post',require('./routes/api/post'));




app.listen(PORT, () => {
    console.log("Server starting on port " + PORT);
})