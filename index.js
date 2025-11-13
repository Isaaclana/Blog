import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static("src"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

const posts = []; // It will work as a memory for each post

// =================== Home Page ===================
app.get("/", (req, res) => {

    res.render("home.ejs", { post: posts });

});

// =================== Create ===================
app.get("/create", (req, res) => {

  res.render("create.ejs");

});

app.post("/create", (req, res) => {

  const userTittle = req.body.tittle;
  const userContent = req.body.content;

  const date = new Date();
  const creation = date.toLocaleDateString("en-US");

  const newPost = {
    postId: posts.length + 1,
    tittle: userTittle,
    content: userContent,
    dateOfCreation: creation,
  };

  posts.push(newPost);

  res.redirect("/");

});

// =================== User Blogs ===================

app.get("/blogs", (req, res) => {

  res.render("blogs.ejs", { post: posts });

});

// =================== Edit and Delete Post ===================

app.get("/edit/:id", (req, res) => {
  
  const id = Number(req.params.id); // params gets the post.id value
  
  const post = posts.find(item => item.postId === id); // gets the post which is related to the id
  if (!post) return res.status(404).send("Post not found"); // checks if the post exist

  res.render("edit.ejs", { post });

});

app.put("/edit/:id", (req, res) => {

  const id = Number(req.params.id);
  const { tittle, content } = req.body;

  const post = posts.find(item => item.postId === id);
  if (!post) return res.status(404).send("Post not found");

  post.tittle = tittle;
  post.content = content;

  res.redirect("/blogs");

});

app.delete("/edit/:id", (req, res) => {

  const id = Number(req.params.id);

  const post = posts.findIndex(item => item.postId === id); // findIndex() is more appropriated to find an array value. find() only returns the value of the item selected
  if (post === -1) return res.status(404).send("Post not found");

  posts.splice(post, 1) // removes 1 element in the positioning of post

  res.redirect("/blogs");

});

// =================== Port ===================

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});