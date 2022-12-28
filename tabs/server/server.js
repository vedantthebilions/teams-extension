// Importing the express module
var express = require('express');
var path = require("path");
var morgan = require("morgan");
var debug = require("debug");
var compression = require("compression");
var MsTeamsApiRouter = require("express-msteams-host");
var MsTeamsPageRouter = require("express-msteams-host");
var Router = require("./api/Router");
var init = require("node-persist");
var cors = require('cors')

// Initializing the express and port number
var app = express();

// Initialize debug logging module
var log = debug("msteams");

// Initializing the router from express
var router = express.Router();
var PORT = 3007;

// Inject the raw request body onto the request object
app.use(express.json({
    verify: (req, res, buf, encoding) => {
        (req).rawBody = buf.toString();
    }
}));
app.use(express.urlencoded({ extended: true }));

// Express configuration
app.set("views", path.join(__dirname, "/"));

// Add simple logging
app.use(morgan("tiny"));

// Add compression - uncomment to remove compression
app.use(compression());

// Add /scripts and /assets as static folders
app.use("/scripts", express.static(path.join(__dirname, "web/scripts")));
app.use("/assets", express.static(path.join(__dirname, "web/assets")));

app.use("/api/demo", Router({}));

app.use(cors({ origin: '*' }))

// Set default web page
app.use("/", express.static(path.join(__dirname, "web/"), {
    index: "index.html"
}));

app.use((req, res, next)=>{
    //res.setHeader('Access-Control-Allow-Origin',"http://localhost:53000");
    //res.setHeader('Access-Control-Allow-Headers',"*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.listen(PORT, function(err){
   if (err) console.log(err);
   console.log("Server listening on PORT", PORT);
});