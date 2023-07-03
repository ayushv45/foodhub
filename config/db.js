const mongoose = require("mongoose");
const connectDB = async() => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log("MongoDB connected");
      const fetchedData =  mongoose.connection.db.collection("foodItems");
      fetchedData.find({}).toArray()
      .then((data) => {
        const foodCategory =  mongoose.connection.db.collection("foodCategory")
        foodCategory.find({}).toArray().
        then((catData) => {
          global.foodItems = data;
          global.foodCategory = catData;
        })
        .catch((err) => {
          console.log(err);
        })
      })
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
