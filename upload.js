const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    //this function stores it -> you can delete it, if you dont want to store in uploads
    destination: function (req, file, callback) {
        // req.file does not work here bc it will later be created by multer!!!
        //console.log(req.file);
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

//multer is an object but when we call it in server.js as middleware
//the two functions above would run!
module.exports.uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
