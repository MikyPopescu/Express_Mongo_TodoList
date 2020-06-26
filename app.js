const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const date = require(__dirname+'/date.js');

const app = express();

const items = ['Go shopping','Do homework','Get the trash'];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"))

app.get("/", function (req,res) {

   // let currentDay = today.getDay();

 /*   if(currentDay === 6 || currentDay === 7){
        day = "Weekend";
       // res.write("<h1> Weekend </h1>");
    }
    else{
        // res.write("<h1> Weekday </h1>")
        // res.write("<p> Can't wait for the weekend </p>")
        // res.send();
        //day = "Weekday";

       
      //  res.sendFile(__dirname + "/index.html");
    }
*/
  /*    switch (currentDay) {
            case 0:
                day = "Sunday"
                break;
            case 1:
                day = "Monday"
                break;
            case 2:
                day = "Tuesday"
                break;
            case 3:
                day = "Wednesday"
                break;
            case 4:
                day = "Thrusday"
                break;
            case 5:
                day = "Friday"
                break;
            case 6:
                day = "Saturday"
                break;
        
            default:
            console.log("Error! :( - "+ currentDay)
                break;
        }*/

        const day = date.getDate();
        
      res.render('list', {listTitle: day, newListItems: items});  //looks for the file 'list' inside the views folder
});


app.post("/", function (req, res) {
    const item = req.body.newItem;
    //console.log(req.body);
    if(req.body.list === "work"){
        workItems.push(item);
        res.redirect('/work');
    }
   else{
    //console.log(item);
     items.push(item);
     res.redirect('/');
   } 
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