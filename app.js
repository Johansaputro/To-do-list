const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const lodash = require("lodash");
const date = require(__dirname + "/date.js");


// var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var item = [];
var workItem = [];

mongoose.connect('mongodb+srv://johansaputro3:johanjohan634630@cluster0.vj0vy.mongodb.net/toDoDatabase?retryWrites=true&w=majority')
// mongoose.connect('mongodb://localhost:27017/toDoDatabase');

app.use(express.static('public'))
// app.use('/CSS', express.static(__dirname + 'public/CSS'))
// app.use('/img', express.static(__dirname + 'public/img'))
// app.use('/js', express.static(__dirname + 'public/js'))

app.set('views', './views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))

// database setup
const itemSchema = new mongoose.Schema({
  task: String
});

const Item = mongoose.model('item', itemSchema);

const task1 = new Item({task: "Welcome to your To Do List"});
const task2 = new Item({task: "Press + to add new task"});
const task3 = new Item({task: "Press <--- to delete your task"});

const defaultInstructions = [task1, task2, task3];

const listSchema = new mongoose.Schema({
  name: String,
  taskList: [itemSchema]
});

const List = mongoose.model('list', listSchema);

// routing
app.get("/", function(req, res){
  // var day = date.getDate();
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultInstructions, function(err) {
        if (err) throw err;
      });
      res.redirect("/");
    } else {
          res.render("list", {listTitle: "Today", newtask: foundItems});
    }
  });
});

app.get("/:parameter", function(req, res) {
  var routeName = lodash.capitalize(req.params.parameter);
  // console.log(routeName);
  List.findOne({name: routeName}, function(err, rs) {
    if (err) throw err;
    else {
      if (!rs) {
        const list = new List({
          name: routeName,
          taskList: defaultInstructions
        });

        list.save();
        res.redirect("/"  + routeName);
      }
      else {
          if (rs.taskList.length === 0) {
            rs.taskList = defaultInstructions;
            rs.save();
          }
          // else {
          //   console.log("Already have something");
          // }
          res.render("list", {listTitle: routeName, newtask: rs.taskList});
      }
    }
  });
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Time to WORK!", newtask:workItem});
// })

app.get("/about", function(req,res){
  res.render("about");
})

app.post("/", function(req,res){
  const next = new Item({task: req.body.nexttask});
  const route = req.body.button;

  // Item.insertMany([next], function(err) {
  //   if (err) throw err;
  // });
  if (route === "Today") {
    next.save();
    res.redirect("/")
  } else {
    List.findOne({name:route}, function(err, rs) {
      if (err) throw err;
      else {
        var particularList = rs.taskList;
        particularList.push(next);
        rs.save();
        res.redirect("/" + rs.name);
      }
    })
  }


  // if (req.body.button === "Time") {
  //   workItem.push(next);
  //   res.redirect("/work");
  // } else {
  //     item.push(next);
  //     res.redirect("/");
  // }

})

app.post("/delete", function(req, res) {
  var toDel = req.body.deletion;
  var listname = req.body.customDel;
  if (listname === "Today"){
    Item.findByIdAndRemove(toDel, function(err) {
      if (err) throw err;
      else {
        console.log("Deleted Entry Id" + toDel);
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({name: listname}, {$pull: {taskList: {_id: toDel}}}, function(err, rs) {
      if (err) throw err;
      else {
        console.log(rs);
        res.redirect("/" + listname);
      }
    })
  };

});

// app.post("/work", function(req,res){
//     var next=req.body.nexttask;
//     workItem.push(next);
//     res.redirect("/work");
// })

app.post("/empty", function(req,res){
  const route = req.body.emptying;
  if (route === "Today") {
    Item.remove({}, function(err){
      console.log("Database Cleared");
    });
    res.redirect("/");
  }
  else {
    List.findOne({name:route}, function(err, rs) {
      if (err) throw err;
      else {
        rs.taskList = [];
        rs.save();
        console.log(rs.taskList);
        res.redirect("/" + rs.name);
      }
    })
  }

  // if (req.body.button === "Time") {
  //   workItem = [];
  //   res.redirect("/work");
  // } else {
  //     item = [];
  //     res.redirect("/");
  // }

})


app.listen(process.env.PORT || 5000, function(){
  console.log("Server started on port 5000");
});
