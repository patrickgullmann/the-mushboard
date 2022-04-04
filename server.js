const express = require("express");
const app = express();
const db = require("./db");

const { uploader } = require("./upload");
const s3 = require("./s3");
//console.log(s3);

app.use(express.static("./public"));

app.use(express.json());

app.get("/modal/:idPassed", (req, res) => {
    //the getAllId is for the check when somebody types in another url!
    db.getAllIds()
        .then(({ rows }) => {
            let arr = [];
            for (let obj of rows) {
                arr.push(obj.id);
            }
            if (arr.includes(parseInt(req.params.idPassed))) {
                db.getSelectetImageData(req.params.idPassed)
                    .then(({ rows }) => {
                        //console.log(result.rows);
                        res.json(rows[0]);
                    })
                    .catch((err) => {
                        console.log("error getting image data from db: ", err);
                    });
            } else {
                res.json(null);
            }
        })
        .catch((err) => {
            console.log("error getting all ids from db: ", err);
        });
});

app.post("/comment", (req, res) => {
    //console.log(req.body);
    const { imageId, username, comment } = req.body;

    db.insertComment(imageId, username, comment)
        .then(({ rows }) => {
            //send it back to instantly add it!
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error insert comment in db: ", err);
        });
});

app.get("/comments/:imageId", (req, res) => {
    db.getComments(req.params.imageId)
        .then(({ rows }) => {
            //console.log(result.rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting MORE images from db: ", err);
        });
});

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
                res.json(result.rows[0]);
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

app.get("/moreimages/:lowestIdOnScreen", (req, res) => {
    db.getMoreImages(req.params.lowestIdOnScreen)
        .then(({ rows }) => {
            //console.log(result.rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting MORE images from db: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`🦑 I'm listening on 8080 🔥 🍑`));
