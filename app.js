const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require("mongoose")

const app = express();

const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useUnifiedTopology:true, useNewUrlParser:true});

//schema
const itemsSchema = {
    name: String
};

//model
const Item = mongoose.model("Item", itemsSchema);

//documents
const item1 = new Item({
    name:"Welcome to your todoList"
});

const item2 = new Item({
    name:"Hit the + to add more items"
});


const item3 = new Item({
    name:"<----- Hit this to delete an item"
});

const defaultItems = [item1,item2,item3];




app.get("/", function (req,res) {
    
    Item.find({},function(err,foundItems){
       if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Succesfully saved all items!");
            }
        });
        res.redirect("/");
       }
       else{
          res.render('list', {listTitle: "Today", newListItems: foundItems});  
       }
      
    });
   
});


app.post("/", function (req, res) {
    //user input
    const itemName = req.body.newItem;
    //conversion to mongoose
    const item = new Item({
        name: itemName
    });
    //save
    item.save();

    res.redirect("/");
});


app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("Succesfully deleted the checked item!");
            res.redirect("/");
        }
        else{
            console.log(err);
            
        }
    })
});


app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List",newListItems: workItems});
});

app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
});


app.get("/about", function(req,res){
    res.render("about");
});

app.listen(8080, function () {
    console.log("Server started on 8080");  
});