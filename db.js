const mongoose = require('mongoose');
require('dotenv/config');

process.env.NODE_ENV = process.env.NODE_ENV || "staging"; //local
console.log(process.env.NODE_ENV)

const config = require("./config.js").get(process.env.NODE_ENV);

const { DB } = config;
const options = {
    user: DB.UserName,
    pass: DB.Password,
};

const MONGOURI = process.env.MONGOURI

const InitiateMongoServer = async () => {
    try {
        console.log(MONGOURI);
        await mongoose.connect(MONGOURI);
        console.log("Connected to DB !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = { InitiateMongoServer };