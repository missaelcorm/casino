// src\controllers\login_connect.js
const mongoose = require('../../routes/mongoose');
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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

let expectedSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 99,
    },
    balance: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});



let User = mongoose.model('users',expectedSchema);

module.exports = User;
