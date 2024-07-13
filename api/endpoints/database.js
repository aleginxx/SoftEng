const mysql = require('mysql');
const express = require('express');
const app = express();

const host_name = 'localhost';
const sqlConfig = {
    host: host_name,
    user: "root",
    password: "",
    database: "softeng"
};

const connection = mysql.createConnection(sqlConfig);

connection.connect((err) => {
    if (err) {
        if (err.code == 'ER_BAD_DB_ERROR') {
            console.error("Not Available");
        } else if (err.code == 'ER_ACCESS_DENIED_ERROR') {
            console.error("Not Authorized");
        } else {
            console.error("Internal Server Error");
        }
    } else {
        console.log("Success");
    }
});

module.exports = {
    connection: connection
};