const express = require('express');
const userModel = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    try {
        const { password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new userModel({ ...req.body, password: hash });

        const user = await newUser.save();
        return res.send(user);
    } catch (err) {
        return res.status(400).send({ error: err });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordValid) {
                return res.send(user);
            } else {
                return res.status(400).send({ error: "Wrong Password" });
            }
        } else {
            return res.status(400).send({ error: "User not found" });
        }
    } catch (err) {
        return res.status(400).send({ error: err });
    }
});

router.get("/getUsers", async (req, res) => {
    try {
        const users = await userModel.find();
        return res.send(users);
    } catch (err) {
        return res.status(400).send({ error: err });
    }
});

module.exports = router;