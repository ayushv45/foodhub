const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require('axios')

const jwtSecret = process.env.jwtSecret;

router.post("/register",
  body("email").isEmail(),
  body("password", "Incorrect Paaword").isLength({ min: 5 }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: securePassword,
      });
      res.json({ success: "true" });
    } catch (error) {
      console.log(error);
      res.json({ success: "false" });
    }
  }
);

router.post("/login",
  body("email").isEmail(),
  body("password", "Incorrect Paaword").isLength({ min: 5 }),

  async (req, res) => {
    let email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let userData = await User.findOne({email});
      if(!userData){
        return res.status(400).json({ errors: "Please try to login with correct credentials" });
        }

        const isMatch = await bcrypt.compare(req.body.password, userData.password);
        if(!isMatch){
            return res.status(400).json({ errors: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: userData.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret);
      res.json({ success: "true" , authToken : authToken});
    } catch (error) {
      console.log(error);
      res.json({ success: "false" });
    }
  }
);

router.post('/getlocation', async (req, res) => {
  try {
      let lat = req.body.latlong.lat
      let long = req.body.latlong.long
      console.log(lat, long)
      let location = await axios
          .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=" + process.env.GEO_API)
          .then(async res => {
              // console.log(`statusCode: ${res.status}`)
              console.log(res.data.results)
              // let response = stringify(res)
              // response = await JSON.parse(response)
              let response = res.data.results[0].components;
              console.log(response)
              let { county, postcode } = response
              return String(county + "," + postcode)
          })
          .catch(error => {
              console.error(error)
          })
      res.send({ location })

  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})

module.exports = router;
