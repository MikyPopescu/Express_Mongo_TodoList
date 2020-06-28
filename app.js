const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require("mongoose")

const app = express();

const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/todolistDB",{useUnifiedTopology:true, useNewUrlParser:true});
mongoose.connect("mongodb+srv://admin-miky:admin-miky@cluster0-4lcoe.mongodb.net/todolistDB?retryWrites=true&w=majority",{useUnifiedTopology:true, useNewUrlParser:true});
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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

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
          res.render('List', {listTitle: "Today", newListItems: foundItems});  
       }
      
    });
   
});

app.get("/:customListName", function(req,res){
//  const customListName = _.capitalize(req.params.customListName);
    const customListName = req.params.customListName;
    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
              //create new list
              const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customListName);
            }
            else{
            //show existing list
              res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });

  
});

app.post("/", function (req, res) {
    //user input
    const itemName = req.body.newItem;
    //button
    const listName = req.body.list;

    //conversion to mongoose
    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        //save
         item.save();

        res.redirect("/");
    }
    else{
        //new item from custom list
        List.findOne({name: listName}, function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("Succesfully deleted the checked item!");
                res.redirect("/");
            }
            else{
                console.log(err);
            }
        })
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull: {items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }
});

app.listen(8080, function () {
    console.log("Server started on 8080");  
});