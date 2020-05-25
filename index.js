const express = require('express')
const app = express()
const port = 3000

const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://ehdaudrnr3:audrnr7447@ehdaudrnr3-gbibt.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify:true
})
.then(()=> console.log("MongoDB Connected.."))
.catch(err=>console.log("MongoDB connection fail"));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))