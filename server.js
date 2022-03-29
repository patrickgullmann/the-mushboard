const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            //console.log(result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`🦑 I'm listening on 8080 🔥 🍑`));
