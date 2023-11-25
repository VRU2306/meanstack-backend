const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PromiseProvider } = require("mongoose");
const Profile = require("../../model/profile.model.js");
const nodemailer = require('nodemailer');
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
module.exports.register = async (req, res) => {
    try {
        // Get any validation errors
        const result = validationResult(req);
        console.log(result)

        if (!result.isEmpty()) {
            res.status(400)
                .json(result.array()[0]);
            return;
        }

        let body = req.body;
        const profile = await Profile.findOne({ email: body.email });

        if (profile) {
            res.status(404).json("User Already Registered");
            return;

        }
        let x = Math.floor((Math.random() * 100) + 1);
        // bcrypting the user entered pasword 
        var salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(body.password, salt);
        // creating a doc for the user and adding all details 
        const newprofile = new Profile({
            user_id: x,
            email: body.email,
            name: body.name,
            password: hash,
            category: "user"
        })
        // Saving the Doc to the database 
        await newprofile.save();
        const transporter = nodemailer.createTransport({
        });

        const mailOptions = {
            from: 'your-email@example.com',
            to: req.body.email,
            subject: 'Registration Success',
            text: 'Thank you for registering!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        // Sending Response saying user is successfully registered.
        res.status(200).json("User Registered successfully");
    } catch (e) {
        // if any Server Error then send status 500
        console.log(e)
        res.sendStatus(500);
    }
}


/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
module.exports.login = async (req, res) => {
    try {
        // Get any validation errors
        const result = validationResult(req);

        // If any validation errors are present, send a 400 along
        // with the error message
        if (!result.isEmpty()) {
            res.status(400).json(result.array()[0]);
            return;
        }

        const { email, data } = req.body;

        // Checking if the user is registered or not
        const profile = await Profile.findOne({ email: req.body.email });

        if (!profile) {
            res.status(404).json("User Not Found");
            return;
        }

        // If the password of the user is empty
        if (profile.password == "") {
            res.status(403).json("Password is not set for this Account");
            return;
        }

        // Comparing the bcrypt-hashed Password and the password entered by the user
        const passCheck = await bcrypt.compare(data, profile.password);

        // If password is incorrect, send a 403 error
        if (!passCheck) {
            res.sendStatus(403);
            return;
        }

        // Collecting all the details of the current user except password
        const { password, __v, ...userData } = profile.toJSON();
        console.log(userData);

        // Send user data as a response
        res.json(userData);

    } catch (e) {
        // If any Server Error then send status 500
        console.log(e);
        res.sendStatus(500);
    }

   
};

 /**
 * Controller to get the data of the currently logged in user.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
 module.exports.currentUser = async (req, res) => {
    // This controller function will be preceded by the middleware function
    // to check if the user is logged in. req.user will be set as a result,
    // hence we just filter some props and send req.user with a 200 (OK)
    // const { __v, ...userData } = req.user;
    
    const profile = await Profile.find({});

    res.status(200).send(profile);
};
