const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')

const app = express();

var items = [];

app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');

app.get("/", function (req,res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";

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


        var options = {
            weekday:'long',
            day:'numeric',
            month:'long'
        };

         day = today.toLocaleDateString("en-US",options);

      res.render('list', {kindOfDay: day, newListItems: items});  //looks for the file 'list' inside the views folder
});


app.post("/", function (req, res) {
    var item = req.body.newValue;
    //console.log(item);
    items.push(item);

    res.redirect('/');
});


app.listen(8080, function () {
    console.log("Server started on 8080");  
});