const DB = require('../database').connection;
const express = require('express');
const path = require('path');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');
const { v4: uuidv4 } = require('uuid');

router.get('/delete_user', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'front-end', 'delete_account.html'));
});

router.post('/delete_user', (req, res) => {
    const { user_id } = req.body;

    // Validate if user_id is provided
    if (!user_id) {
        return res.status(400).send("User ID is required for deletion.");
    }

    const sql = "DELETE FROM user WHERE user_id = ?";

    DB.connection.query(sql, [user_id], (error, results) => {
        if (error) {
            console.error("Error deleting user:", error);
            return res.status(500).send("Error deleting user");
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("User not found");
        }

        res.status(200).send("User deleted successfully");
    });
});

module.exports = router;
