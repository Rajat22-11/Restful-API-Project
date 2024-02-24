const {log} = require("console");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4} = require('uuid');
const methodOverrride =  require("method-override");

app.use(methodOverrride("_method"));
app.use(express.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//---------------------------CRUD Operations------------------------------

  
let initialTasks = [
    {
      id: uuidv4(),
      title: "Completes MERN Project",
      description: "Build a task manager application using the MERN stack.",
      completed: false,
      dueDate: "2024-03-01",
    },
    {
      id: uuidv4(),
      title: "Learn React Hooks",
      description: "Explore and practice using React Hooks for state management.",
      completed: false,
      dueDate: "2024-02-28",
    },
    {
      id: uuidv4(),
      title: "Node.js Crash Course",
      description: "Watch a crash course on Node.js to solidify server-side concepts.",
      completed: true,
      dueDate: "2024-02-25",
    },
  ];
  
app.get("/tasks", (req, res) => {
    res.render("index.ejs", {initialTasks})
});

app.get( "/tasks/new" , (req,res)=>{
    res.render("new.ejs");
});

app.post( '/tasks' , (req,res) =>{
    let {title, description, completed, dueDate} = req.body;
    let id = uuidv4();
    initialTasks.push({id, title, description, completed, dueDate });
    res.redirect("/tasks");
});

app.get("/tasks/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    let task = initialTasks.find((p) => id === p.id);
    res.render("show.ejs", { task });
});


app.patch("/tasks/:id", (req, res) => {
    let { id } = req.params;
    let { title, description, dueDate } = req.body;
    let task = initialTasks.find((p) => id === p.id);
    if (title) {
        task.title = title;
    }

    if (description) {
        task.description = description;
    }

    if (dueDate) {
        task.dueDate = dueDate;
    }
    res.redirect("/tasks");
});

app.get("/tasks/:id/edit", (req, res) => {
    let {id} = req.params;
    let task = initialTasks.find((p) => id === p.id);
    res.render('edit.ejs',{task})
})

app.delete("/tasks/:id", (req,res) => {
    let {id} = req.params;
    initialTasks = initialTasks.filter((p) => id != p.id);
    res.redirect("/tasks");
});


app.patch("/tasks/:id/complete", (req, res) => {
    let { id } = req.params;
    let task = initialTasks.find((p) => id === p.id);

    if (task) {
        task.completed = true;
        res.redirect("/tasks");
    } else {
        res.status(404).send("Task not found");
    }
});

app.listen(port, () => {
    console.log("Listening to port : 8080");
});