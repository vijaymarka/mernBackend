const mongodb = require("mongodb");
const express = require("express");
const cors = require("cors");
require("./db/config");
const users = require("./db/User");
const Product = require("./db/Product");
const Question = require("./db/Question");
const Author = require("./db/Author");
const { db } = require("./db/User");

const ObjectId = mongodb.ObjectId;

const app = express();
app.use(express.json());
app.use(cors());

// Login and Register

app.post("/register", async (req, res) => {
  try {
    let user = new users(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  let user = await users.findOne(req.body).select("-password");
  console.log(req.body);
  if (req.body.password && req.body.email) {
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No users found" });
    }
  } else {
    res.send({ result: "No users found" });
  }
});

app.get("/authors", async (req, res) => {
  let userData = await Author.find();
  console.log(userData);
  res.send(userData);
});

// Products page

app.post("/add-product", async (req, res) => {
  const productt = new Product();
  productt.user_id = req.body.user_id;
  productt.name = req.body.name;
  productt.price = req.body.price;
  productt.category = req.body.category;
  productt.author = req.body.author;
  await productt.save((err, productt) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      console.log(productt);
      res.send(productt);
    }
  });
});

app.get("/products", async (req, res) => {
  try {
    let products = await Product.find();
    // res.send(products);
    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ result: "No products found" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/product/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  try {
    if (result) {
      res.send(result);
    } else {
      res.send({ result: "No result found" });
    }
  } catch (err) {
    console.warn(err);
  }
});

app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { tag: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

// Questions

app.get("/cr", async (req, res) => {
  const author = await db.collection("authors").find().toArray();
  console.log(author);
  res.send(author);
});

app.post("/add-question", async (req, res) => {
  const producttt = new Question();
  producttt.user_id = req.body.user_id;
  producttt.question = req.body.question;
  producttt.answer_options = req.body.answer_options;
  producttt.correct_answer = req.body.correct_answer;
  
  
  await producttt.save((err, producttt) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      console.log(producttt);
      res.send(producttt);
    }
  });
});


app.get("/questions", async (req, res) => {
  try {
    let questions = await Question.find();

    if (questions.length > 0) {
      res.send(questions);
    } else {
      res.send({ result: "No questions found" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/question/:id", async (req, res) => {
  const result = await Question.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/question/:id", async (req, res) => {
  let result = await Question.findOne({ _id: req.params.id });
  try {
    if (result) {
      res.send(result);
    } else {
      res.send({ result: "No result found" });
    }
  } catch (err) {
    console.warn(err);
  }
});

app.put("/question/:id", async (req, res) => {
  let result = await Question.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.listen(5000);
