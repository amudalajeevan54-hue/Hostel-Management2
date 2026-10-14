
// CRUD operations of Hostel Management using MySQL database
/*
1. Initialize PROJECT
> npm init -y

2. Install express and mysql8
> npm install express mysql8

EXECUTION:
Open http://localhost:3001/
*/

const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read HTML files from public folder
app.use(express.static("public"));

// Connection establishment with hostel database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jeevan",
    database: "hostel"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL");
});

// TO GET DETAILS OF ALL ROOMS
app.get("/rooms", (req, res) => {
    db.query(
        "SELECT * FROM management",
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(result);
        }
    );
});

// TO GET DETAILS OF ONE ROOM
app.get("/rooms/:room_id", (req, res) => {
    db.query(
        "SELECT * FROM management WHERE room_id = ?",
        [req.params.room_id],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.length === 0) {
                res.status(404).send("Room not found");
                return;
            }

            res.json(result[0]);
        }
    );
});

// TO INSERT ROOM DATA INTO management TABLE
app.post("/rooms", (req, res) => {
    const {
        room_no,
        block_name,
        room_capacity,
        noofoccupied,
        status
    } = req.body;

    if (
        room_no === undefined ||
        !block_name ||
        room_capacity === undefined ||
        noofoccupied === undefined ||
        status === undefined
    ) {
        res.status(400).send("Please provide all room details");
        return;
    }

    if (
        Number(room_capacity) < 1 ||
        Number(noofoccupied) < 0 ||
        Number(noofoccupied) > Number(room_capacity)
    ) {
        res.status(400).send("Invalid room capacity or occupied beds");
        return;
    }

    db.query(
        `INSERT INTO management
        (room_no, block_name, room_capacity, noofoccupied, status)
        VALUES (?, ?, ?, ?, ?)`,
        [room_no, block_name, room_capacity, noofoccupied, status],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.status(201).json({
                message: "Room Inserted",
                room_id: result.insertId
            });
        }
    );
});

// TO UPDATE ROOM DETAILS
app.put("/rooms/:room_id", (req, res) => {
    const {
        room_no,
        block_name,
        room_capacity,
        noofoccupied,
        status
    } = req.body;

    if (
        room_no === undefined ||
        !block_name ||
        room_capacity === undefined ||
        noofoccupied === undefined ||
        status === undefined
    ) {
        res.status(400).send("Please provide all room details");
        return;
    }

    if (
        Number(room_capacity) < 1 ||
        Number(noofoccupied) < 0 ||
        Number(noofoccupied) > Number(room_capacity)
    ) {
        res.status(400).send("Invalid room capacity or occupied beds");
        return;
    }

    db.query(
        `UPDATE management
        SET room_no = ?, block_name = ?, room_capacity = ?,
            noofoccupied = ?, status = ?
        WHERE room_id = ?`,
        [
            room_no,
            block_name,
            room_capacity,
            noofoccupied,
            status,
            req.params.room_id
        ],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).send("Room NOT found");
            } else {
                res.send("Room Updated");
            }
        }
    );
});

// TO DELETE ROOM DETAILS
app.delete("/rooms/:room_id", (req, res) => {
    db.query(
        "DELETE FROM management WHERE room_id = ?",
        [req.params.room_id],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).send("Room NOT found to delete");
            } else {
                res.send("Room Deleted");
            }
        }
    );
});

// SERVER TO LISTEN ON PORT NUMBER 3001
app.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
});

