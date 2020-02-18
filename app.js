const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",  // ip addres of the database
  user: "root",       // user in the database
  port: 3306,         //database port
  password: "password",  //user password
  database: "blog"   //database name
});
db.connect(err => {
  if (err) {
    console.log("error: " + err);
    throw err;
  }
  console.log("connected to database");
});

const app = express();
app.use(express.json({ limit: "1mb" }));


app.post("/api/post", (req, res) => {
  let post = req.body;
  const sql_command = "INSERT INTO blog_posts SET ?";
  let query = db.query(sql_command, post, err => {
    if (err) {
      throw err;
    }
  });
});

app.get("/getposts", (req, res) => {
  const sql_command = "SELECT * FROM blog_posts";
  const query = db.query(sql_command, (err, results) => {
    if (err) {
      throw err;
    }
    let data = { posts: [] };
    for (const iterator of results) {
      data["posts"].push(iterator);
    }
    res.send(JSON.stringify(data));
  });
});

app.get("/curentpost/:postID", (req, res) => {
  const id_param = req.params.postID;
  const sql_command =
    `select * from blog_posts left join blog_post_comments on blog_posts.post_id = blog_post_comments.post_id where blog_posts.post_id=${mysql.escape(id_param)} order by blog_post_comments.comment_id  desc`;

  const query = db.query(sql_command, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results);
  });
});
app.post("/curentpost/comment", (req, res) => {
  const sql_command = "INSERT INTO blog_post_comments SET ?";
  let query = db.query(sql_command, req.body, (err, result) => {
    if (err) {
      throw err;
    }
  });
});

app.listen("3003", () => {
  console.log("the server is live on port 3003");
});
