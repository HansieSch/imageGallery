var http = require("http"),
    fs = require("fs"),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    jade = require("jade"),
    jimp = require("jimp"),
    multer = require("multer");

var server = http.createServer(app).listen(8000, serverStart);

var upload = multer({ destination: __dirname + "/public/assets/images/" });

app.use(express.static(__dirname + "/public/assets/", { maxage: 0 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("views", "./public/views/");
app.set("view engine", "jade");

app.get("/rendered", function (req, res) {
    res.render("index", { title: "Image Gallery" });
})

app.get("/", function (req, res) {
    fs.readdir(__dirname + "/public/assets/images/thumbnails", function (err, files) {
        res.render("index.jade", { 
            title: "Image Gallery",
            sources: files
        });
    });
    
});

app.get("/view", function (req, res) {
    res.render("viewImage.jade", { image: req.query.fileName });
});

app.get("/upload", function (req, res) {
    res.render("upload.jade", {});
});

app.post("/uploadFile", upload.single("photo"), function (req, res) {
    jimp.read(req.file.buffer, function (err, image) {
        if (err) res.send(err);

        image.write(__dirname + "/public/assets/images/" + req.file.originalname); // save

        image.scaleToFit(640, jimp.AUTO)
             .write(__dirname + "/public/assets/images/thumbnails/" + req.file.originalname); // save

        image.scaleToFit(1536, jimp.AUTO)
             .write(__dirname + "/public/assets/images/view/" + req.file.originalname); // save
        
        res.redirect("/");
    });
});

function serverStart() {
    console.log("Server listening on port 8000");
}