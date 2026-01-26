import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3001;

app.use(methodOverride("_method"));
app.use(express.static("src"));
app.use(bodyParser.urlencoded({ extended: true }));

const posts = [{
  postId: 1,
  title: "Lorem Ispum",
  content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
  dateOfCreation: "03/17/2024",
},
{
  postId: 2,
  title: "Ispum Lorem",
  content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  dateOfCreation: "03/17/2024",
},
{
  postId: 3,
  title: "Ispum Lorem",
  content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
  dateOfCreation: "03/17/2024",
}]; // It will work as a memory for each post
const userPosts = [];

// =================== Home Page ===================
app.get("/", (req, res) => {

    res.render("home.ejs", { post: posts, pageName: "Home" });

});

// =================== Create ===================
app.get("/create", (req, res) => {

  res.render("create.ejs", { pageName: "Create" });

});

app.post("/create", (req, res) => {

  const userTitle = req.body.title;
  const userContent = req.body.content;

  const date = new Date();
  const creation = date.toLocaleDateString("en-US");

  const newPost = {
    postId: posts.length + 1,
    title: userTitle.trim(),
    content: userContent,
    dateOfCreation: creation,
  };

  const existentPost = posts.find(item => item.title === newPost.title);
  const existentContent = posts.find(item => item.content === newPost.content);

  if (existentPost || existentContent) { 

    const errorMessage = "Post already exist!";
    return res.render("create.ejs", { message: errorMessage, pageName: "Create" });

  }else {

    posts.push(newPost);
    userPosts.push(newPost);

    res.redirect("/");
  }

});

// =================== User Blogs ===================

app.get("/blogs", (req, res) => {

  res.render("blogs.ejs", { userPosts, pageName: "My Posts" });

});


// =================== Edit and Delete Post ===================

app.get("/edit/:id", (req, res) => {
  
  const id = Number(req.params.id); // params gets the post.id value
  
  const post = posts.find(item => item.postId === id); // gets the post which is related to the id
  if (!post) return res.status(404).send("Post not found"); // checks if the post exist

  res.render("edit.ejs", { post, pageName: "Edit" });

});

app.put("/edit/:id", (req, res) => {

  const id = Number(req.params.id);
  const { title, content } = req.body;

  const post = posts.find(item => item.postId === id);
  if (!post) return res.status(404).send("Post not found");

  post.title = title;
  post.content = content;

  res.redirect("/blogs");

});

app.delete("/delete/:id", (req, res) => {

  const id = Number(req.params.id);

  const post = posts.findIndex(item => item.postId === id); // findIndex() is more appropriated to find an array value. find() only returns the value of the item selected
  const usersPosts = userPosts.findIndex(item => item.postId === id);
  if (userPosts === -1) return res.status(404).send("Post not found");
  if (post === -1) return res.status(404).send("Post not found");

  posts.splice(post, 1) // removes 1 element in the positioning of post
  userPosts.splice(usersPosts, 1);

  res.render("blogs.ejs", { userPosts, pageName: "My Posts" });

});

// =================== Content Blog Page ===================

app.get("/content/:title", (req, res) => {

  const title = req.params.title;
  const post = posts.find(item => item.title === title);

  if (!post) return res.status(404).send("Post not found");

  res.render("content.ejs", { post, pageName: "" });

});

// =================== Port ===================

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});