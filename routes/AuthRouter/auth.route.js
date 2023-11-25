const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const authcontroller = require("../../controller/AuthController/auth.controller");


let registervalidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .exists()
        .withMessage("Please Provide Valid Email"),
        body("mobile")
        .notEmpty()
        .exists()
        .withMessage("Please Provide Valid Mobile"),
    body("password")
        
        .notEmpty()
        .exists()
        .isLength({min:6,max:20})
        .withMessage("Please Provide Valid Password of 6-20"),
    body("name")

        .notEmpty()
        .exists()
        
        .withMessage("Please Provide Valid Name"),
    
]

let loginvalidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .exists()
        .withMessage("Please Provide a Valid Email"),
    body("password")

        .notEmpty()
        .exists()
        .isLength({ min: 6, max: 20 })
        .withMessage("Please Provide Valid Password of 6-20"),

]

router.post("/register", registervalidator,async (req, res) => {
    try {
        await authcontroller.register(req, res);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.post("/login", loginvalidator, async (req, res) => {
    try {
        
        await authcontroller.login(req, res);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.get("/users", async (req, res) => {
    try {
        
        await authcontroller.currentUser(req, res);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})
module.exports = router;