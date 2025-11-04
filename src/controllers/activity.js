// src\controllers\activity.js
const mongoose = require('../../routes/mongoose');

/*

Esquema sin requerimientos

let expectedSchema = mongoose.Schema({
    name: String,
    age: Number,
    balance: Number,
    email: String,
    password: String
});
 */


let mySchema = mongoose.Schema({
    BetStatus: {
        type: Boolean,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    dateGame: {
        type: Date,
        required: true,
    },
    nameGame: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    }
});



let Activity = mongoose.model('activities', mySchema);

module.exports = Activity;