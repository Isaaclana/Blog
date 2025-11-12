import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const post = [];

const app = express();
const port = 3000;

app.set("view engine", "ejs")

app.use(express.static("src"));
app.use(bodyParser.urlencoded({ extended: true }));


// =================== Home Page ===================
app.get("/home", (req, res) => {
    res.render("home.ejs", { post: newPost });
});


// =================== Create ===================
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/create", (req, res, next) => {

  const userTittle = req.body.tittle;
  const userContent = req.body.content;

  const date = new Date();
  const creation = date.toLocaleDateString("en-US");

  const newPost = {
    tittle: userTittle,
    content: userContent,
    dateOfCreation: creation,
  };

  post.push(newPost);

  res.redirect("/home");

});


// =================== Edit and Delete Post ===================
app.get("/edit", (req,res) => {
  res.render("edit.ejs")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});