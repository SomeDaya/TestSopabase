const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL environment variable is not set");
    }

    await mongoose.connect(mongoUrl);
    console.log(`Connected To DATABASE ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`error in connection DB ${error}`);
  }
};

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to connect to database: ${error.message}`);
    process.exit(1);vv
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});
