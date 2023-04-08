const mongoose = require('mongoose');


const url = "mongodb://localhost:27017/chat";
const connectDB = mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family:4
})
.then(()=> console.log('mongodb is connected'))
.catch((err)=> console.log("db error is ==>",err));

module.exports = connectDB;