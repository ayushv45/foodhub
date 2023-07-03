const express = require("express");
const router = express.Router();

router.post("/foodData", async (req, res) => {
  try {
    res.send([global.foodItems, global.foodCategory]);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
