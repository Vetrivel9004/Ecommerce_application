const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

// MongoDB connection
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

// Schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

const userModel = mongoose.model("user", userSchema);

// API
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Signup
app.post("/signup", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = new userModel(req.body);
      await data.save();
      return res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", alert: false });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Using async/await instead of a callback
    const result = await userModel.findOne({ email: email });
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      res.send({
        message: "Login is successful",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error during login", alert: false });
  }
});

//product section
const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product",schemaProduct)


//save product in api
app.post("/uploadProduct",async(req,res)=>{
    //console.log(req.body)
    const data = await productModel(req.body)
   const datasave = await data.save()
    console.log(datasave)
  res.send({message : "Upload successfully"})
})

//
app.get("/product",async(req,res)=>{
   const data = await productModel.find({})
   res.send(JSON.stringify(data))

})
 
  //Server running
 app.listen(PORT, () => console.log("Server is running at port: " + PORT));
