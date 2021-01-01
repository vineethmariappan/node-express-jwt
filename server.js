require('dotenv').config()
const express = require('express')
const app = express()

const jwt = require('jsonwebtoken');

app.use(express.json())

const posts = [
    {
        username : 'vineeth',
        title : 'post 1'
    },
    {
        username : 'simba',
        title : 'post 2'
    }
]
app.get('/posts', authenticateToken, (req,res)=>{ // authenticateToken -> middleware
    
    res.json(posts.filter(post=> post.username === req.user.name));
});


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader &&  authHeader.split(' ')[1]  //Bearer[0] TOKEN[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{ //deserialize the token and get user info
        if(err) return res.sendStatus(403);
        req.user = user;
        next() // next -> move on from the middleware
    })
}

app.listen(3000)