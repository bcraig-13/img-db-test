// Step 1 - set up express & mongoose

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var fs = require("fs");
var path = require("path");
require("dotenv/config");

//V===Change the value of MONGO_URL in .env to this? Will it upload to mongodb instead of localhost?===V
// mongodb+srv://Raven13:Teddykat#3@cluster0.v8sgr.mongodb.net/mongoDBImgTest?retryWrites=true&w=majority
//V===Original tutorial connection to localhost===V
// mongodb://localhost/imagesInMongoApp
// PORT=3000

// Step 2 - connect to the database
//V===Maybe remove .env file and set MONGO_URL var at top of app.js?===V
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  console.log("connected");
});

// Step 3 - code was added to ./models.js

// Step 4 - set up EJS

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//V===Can use react instead. Have to change all of the <% "" %> vars in imagesPage.ejs and use a component instead===V
// Set EJS as templating engine
app.set("view engine", "ejs");

// Step 5 - set up multer for storing uploaded files

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

// Step 6 - load the mongoose model for Image

var imgModel = require("./model");

// Step 7 - the GET request handler that provides the HTML UI
//V===Change the routes to respective routes in our app. It should work the same===V
app.get("/", (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("imagesPage", { items: items });
    }
  });
});

// Step 8 - the POST handler for processing the uploaded file
//V===Our schema would just need a name and img===V
app.post("/", upload.single("image"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
      contentType: "image/png",
    },
  };
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });
});

// Step 9 - configure the server's port

var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})
