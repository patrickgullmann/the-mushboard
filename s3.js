const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    //if there is no file -> send err mssg
    if (!req.file) {
        return res.sendStatus(500);
    }
    //if there is a file, we talk to s3! bc multer before made a req.file
    //console.log(req.file);
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            //if you have not spice bucket you have to change this!!!
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("aws upload complete!");
            //OPTIONAL: this will delete the image in the uploads folder
            fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            console.log(err);
        });
};
