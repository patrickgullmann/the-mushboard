const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

//also did a new version of getImages to give the first three also the id!
exports.getImages = () => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        ORDER BY id DESC
        LIMIT 3;`
    );
};

exports.getMoreImages = (lowestIdOnScreen) => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3;`,
        [lowestIdOnScreen]
    );
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

exports.insertComment = (image_id, username, comment) => {
    return db.query(
        `INSERT INTO comments (image_id, username, comment)
        VALUES ($1, $2, $3) RETURNING *`,
        [image_id, username, comment]
    );
};

exports.getComments = (imageId) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1 ORDER BY id DESC;`,
        [imageId]
    );
};

exports.getAllIds = () => {
    return db.query(`SELECT id FROM images;`);
};
