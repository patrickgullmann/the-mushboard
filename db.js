const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

exports.getImages = () => {
    return db.query(`SELECT * FROM images;`);
};

exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    );
};

exports.getSelectetImageInformation = () => {
    return db.query(`SELECT * FROM images;`);
};

exports.getSelectetImageData = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1;`, [id]);
};
