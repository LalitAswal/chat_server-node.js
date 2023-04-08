const  express  = require("express");
const  connectDB  = require("../db/mongodbConnection");
const   chatDetails = require("../db/chatSchema");

const  router  =  express.Router();

router.route("/").get((req, res) =>  {
        res.setHeader("Content-Type", "application/json");
        res.statusCode  =  200;
        connectDB.then(db  =>  {
            chatDetails.find({}).then(chat  =>  {
            res.json(chat);
        });
    });
});

module.exports  =  router;