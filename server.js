const express = require("express");
const app = express();
const db = require("./db");

const { uploader } = require("./upload");
const s3 = require("./s3");
//console.log(s3);

app.use(express.static("./public"));

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            //send Json (with JSON stringyfied to app.js)
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error getting images from db: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.body: ", req.body); //get this in addition
    console.log("req.file: ", req.file); //this we get from multer!

    //concatenate ths full url before put in db
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    const { username, title, description } = req.body;

    if (req.file) {
        db.addImage(url, username, title, description)
            .then((result) => {
                //console.log(result.rows);
                res.json(result.rows);
            })
            .catch((err) => {
                console.log("error adding image to db: ", err);
            });
    } else {
        //dont need if/else here
        //just sends a json stringifyied object! No destructuring
        return res.sendStatus(500);
    }
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`🦑 I'm listening on 8080 🔥 🍑`));
