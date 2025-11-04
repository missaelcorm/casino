// routes\profile.js
const express = require('express');
const path = require('path');
const router = express.Router();
const User = require("../src/controllers/login_connect");
const Activity = require("../src/controllers/activity");
// const User = require('../routes/user_schema.js');


// ----------------- PROFILE ---------


// /profile/ => load HTML
router.get("/", (req, res) => {
    let id = req.query.id;

    if(id) {
        User.find({
            _id: id
        }).then((docs) => {
            res.send(docs[0]);
        }).catch((err) => res.send("Error"));
    } else {
        res.sendFile(path.resolve(__dirname + "/../src/views/profile.html"));
    }
});

// Update user's information
router.put("/", (req, res) => {
    let id = req.query.id;
    if(id) {
        User.find({
            _id: id
        }).then((docs) => {
            res.send(docs[0]);
        }).catch((err) => res.send("Error"));
    } 
    
    else if (req.body) {
        let id = req.body.id;
        let field = req.body.field;
        let newValue = req.body.newValue;

        // Get old values
        User.find({
            _id: id
        }).then((docs) => {
            let currentData = docs[0];

            // Update according to the field being edited
            if(field === 'username') {
                currentData.name = newValue
            } else if(field === 'password') {
                currentData.password = newValue;
            } else if(field === 'email') {
                currentData.email = newValue;
            }

            // Update values
            User.findByIdAndUpdate(id, currentData, {new: true}).then((doc) => {
                res.send(doc);
            }).catch((err) => console.log(err));


        }).catch((err) => res.send("Error"));

    } 
    
    else {
        res.sendFile(path.resolve(__dirname + "/../src/views/profile.html"));
    }
});


// ------------------ BALANCE (/profile/balance) --------------------------

router.get("/balance", (req, res) => {
    let id = req.query.id;

    // If if found in url, then send the user's data
    if (id) {
        User.find({
            _id: id
        }).then((docs) => {
            res.send(docs[0]);
        }).catch((err) => res.send("Error"));
    } else {
        // Send HTML File
        res.sendFile(path.resolve(__dirname + "/../src/views/balance.html"));
    }

});


// Update balance (add or withdraw)
router.put("/balance", (req, res) => {
    let data = req.body;
    let newAmount = data.amount;
    let id = data.id;

    // First get current value
    User.find({
        _id: id
    }).then((docs) => {

        // Update values old + new

        let oldAmount = docs[0].balance;
        newAmount = oldAmount + newAmount;

        let update = {
            balance: newAmount
        };

        User.findOneAndUpdate({_id: id}, update, {new: true}).then((doc) => {
            res.send(doc);
        }).catch((err) => console.log(err));

    }).catch((err) => res.send("Error"));

});

// ----------------- ACTIVITY -------------------
// /profile/activity
router.get("/activity", (req, res) => {
    let id = req.query.id;

    if (id) {

        Activity.find({
            userID: id,
        }).then((docs) => {
            res.send(docs);
        }).catch((err) => res.send("Error"));


    } else {
        res.sendFile(path.resolve(__dirname + "/../src/views/activity.html"));
    }
});

router.post("/activity", (req, res) => {

    let activity = Activity(req.body);
    activity.save().then((doc) => {
        res.statusCode = 200;
        res.send(req.body);
    });

});

module.exports = router;