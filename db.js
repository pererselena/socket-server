/**
 * Connect to the database and search using a criteria.
 */
"use strict";
const dotenv = require('dotenv');

dotenv.config();

// MongoDB
const mongo = require("mongodb").MongoClient;
if (process.env.NODE_ENV === "production") {
    var url = "mongodb://socket.elenaperers.me:27017/chat";
} else {
    var url = "mongodb://localhost:27017/chat";
}

const dsn = url;

// Express server
const port = process.env.CHATTDB_PORT || 1337;
const express = require("express");
const app = express();



// Just for testing the sever
app.get("/", (req, res) => {
    res.send("Hello World");
});



// Return a JSON object with list of all documents within the collection.
app.get("/chat", async (request, response) => {
    try {
        let res = await findInCollection(dsn, "history", {}, {}, 0);

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});



// Startup server and liten on port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    console.log(`DSN is: ${dsn}`);
});



/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client = await mongo.connect(dsn, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}


async function addToDB(message) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection("history");

    await col.insertOne(message);

    await client.close();
}

module.exports.addToDB = addToDB;