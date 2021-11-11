const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const date = require(__dirname + "/date.js");

// var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var item = [];
var workItem = [];

app.use(express.static('public'))
// app.use('/CSS', express.static(__dirname + 'public/CSS'))
// app.use('/img', express.static(__dirname + 'public/img'))
// app.use('/js', express.static(__dirname + 'public/js'))

app.set('views', './views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){

  var day = date.getDate();

  res.render("list", {listTitle: day, newtask:item});
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Time to WORK!", newtask:workItem});
})

app.get("/about", function(req,res){
  res.render("about");
})

app.post("/", function(req,res){
  var next = req.body.nexttask;
  if (req.body.button === "Time") {
    workItem.push(next);
    res.redirect("/work");
  } else {
      item.push(next);
      res.redirect("/");
  }

})

app.post("/work", function(req,res){
    var next=req.body.nexttask;
    workItem.push(next);
    res.redirect("/work");
})

app.post("/empty", function(req,res){
  if (req.body.button === "Time") {
    workItem = [];
    res.redirect("/work");
  } else {
      item = [];
      res.redirect("/");
  }

})


app.listen(process.env.PORT || 5000, function(){
  console.log("Server started on port 5000");
});
