const express = require('express');
const  cors = require('cors') 
const graphqlHTTP = require('express-graphql'); // this will now work without the grpahql package 

const schema = require('./schema/schema');
``


 


// connect to moongoes db -->

// mongo db -->

const mongoose = require('mongoose');
const dbURl = "mongodb+srv://root:root@cluster0-aronb.mongodb.net/bookstore_graphql?retryWrites=true&w=majority";
mongoose.connect(dbURl);
mongoose.connection.once('open',()=>{
    console.log("connected to the db ");
})

// mongo db -->

const app = express(); 
app.use(cors()); // too allow all cross browser req
app.use('/graphql' , graphqlHTTP({
    schema,
    graphiql : true // middleware to show the graphical view of query fire
}))


app.listen(4000 ,() =>{
    console.log("now listening for req on port 4000 graphQL!");
})