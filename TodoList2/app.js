//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose =  require("mongoose");
const date = require(__dirname + "/date.js");

const app = express(); 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to db
mongoose.connect("mongodb://0.0.0.0:27017/todolistDB",{useNewUrlParser: true});

//create a schema
const itemsSchema={
  name:String
};

//create mongoose  model
const Item= mongoose.model("Item",itemsSchema);

const wakeup=new Item({
  name:"wakeup"
});

const code=new Item({
  name:"code"
});

const sleep=new Item({
  name:"sleep"
});

const defaultItems=[wakeup,code,sleep];

// Item.insertMany(defaultItems)
// .then(() => {
//   console.log("Successfully saved all the Items to todolistDB");
// })
// .catch((err) => {
//   console.log(err);
// });

const workItems = [];



app.get("/", function(req, res) {

  Item.find({})
  .then(function(foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems)
      .then(() => {
        console.log("Successfully saved all the Items to todolistDB");
      })
      .catch((err) => {
        console.log(err);
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
  .catch(function(err){
    console.log(err);
  });
});



app.post("/", function(req, res){
  const itemName = req.body.newItem;
  
  const item=new Item({
    name:itemName
  })

  item.save();

  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
  .then(()=>{
    console.log("Succesfully deleted checked Item");
    res.redirect("/");
  })
  .catch(function(err){
    console.log(err);
  })
});



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3001, function() {
  console.log("Server started on port 3001");
});
