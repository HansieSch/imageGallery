var http = require("http"),
    fs = require("fs"),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    jade = require("jade"),
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
    fs.writeFileSync(__dirname + "/public/assets/images/" + req.file.originalname, req.file.buffer);

    res.redirect("/");
});

/*fs.readdir(__dirname + "/public/assets/images/view", function (err, files) {
    if (err) console.log(err,files);
    for (var file of files) {
        fs.rename(__dirname + "/public/assets/images/view/" + file,
            __dirname + "/public/assets/images/view/" + file.replace(" (Medium)", ""),
                function (err) {
                    if (err) console.log("Error in renaming files.", err);
                });
    }
});*/

function serverStart() {
    console.log("Server listening on port 8000");
}