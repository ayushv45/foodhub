const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", require("./routes/userAuth.js"));
app.use("/api/data", require("./routes/displayData.js"));

if(process.env.NODE_ENV === 'production')
{
  app.use(express.static(path.join(__dirname, './client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
}


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});