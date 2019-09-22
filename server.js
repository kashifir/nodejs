var express = require("express")
var bodyParser =  require("body-parser")

// require router
var client = require("./router/client");
var pieces = require("./router/piece");
var voiture = require("./router/voiture");
//var produte = require("./routes/produt")

var cors = require("cors");

var port = 3000;

var app =  express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/client",client);
app.use("/pieces", pieces);
app.use("/voiture",voiture);
//app.use("/api",commande)
//app.use("/api",produte)

app.listen(port, function () {
    console.log("server start on " + port)
})
