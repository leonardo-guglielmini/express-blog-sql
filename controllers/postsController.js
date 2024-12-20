const postList = require("../data/posts.js");
const conn = require('../data/db.js');

let lastIndex = postList.length;

function index(req, res) {
    //console.log("index");
    const sql = `SELECT *
                FROM posts
                JOIN `

    conn.query(sql, (err, queryRes) => {
        if (err) {
            res.status(500).json({
                error: 'Select id query failed'
            })
        } else {
            res.json(queryRes)
        }
    })
}

function show(req, res) {
    //console.log("show");

    const { id } = req.params;

    const sql = `SELECT posts.*, GROUP_CONCAT(tags.label SEPARATOR ',') as tags
                FROM posts
                JOIN post_tag
                ON posts.id = post_tag.post_id
                JOIN tags
                ON post_tag.tag_id = tags.id
                WHERE posts.id = 4;`

    conn.query(sql, [id], (err, queryRes) => {
        if (err) {
            res.status(500).json({
                error: 'Select id query failed'
            })
        } else {
            res.json(queryRes)
        }
    })
}

function store(req, res) {
    //console.log("store");
    validateBody(req)

    const { title, content, image, tags, published } = req.body;

    let slug = title.toLowerCase().split(" ").join("-");
    //console.log(title, content, image, tags);

    lastIndex++;

    const post = { title, slug, id: lastIndex, content, image, tags, published };
    postList.push(post);

    console.log(post);
    //console.log(postList);

    res.status(201);
    res.send("Post created successfully")
}

function update(req, res) {
    //console.log("update");
    validateBody(req)

    const { title, content, image, tags } = req.body;
    let slug = title.toLowerCase().split(" ").join("-");

    req.post.title = title;
    req.post.slug = slug;
    req.post.content = content;
    req.post.image = image;
    req.post.tags = tags;

    console.log(req.post);
    //console.log(postList);

    res.status(201);
    res.send("Post updated successfully");
}

function modify(req, res) {
    //console.log("modify");

    const { title, content, image, tags } = req.body;

    if (title) {
        req.post.title = title;
        let slug = title.toLowerCase().split(" ").join("-");
        req.post.slug = slug;
    }
    if (content) {
        req.post.content = content;
    }
    if (image) {
        req.post.image = image;
    }
    if (tags) {
        req.post.tags = tags;
    }

    console.log(req.post);
    //console.log(postList);

    res.status(201);
    res.send("Post modified successfully");
}

function destroy(req, res) {
    //console.log("destroy");

    const { id } = req.params

    const sql = `DELETE
                FROM posts
                WHERE id = ?`

    conn.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json({
                error: 'Delete query failed'
            })
        } else {
            res.sendStatus(204)
        }
    })
}

function validateBody(req) {
    let errors = [];
    let { title, content, image, tags } = req.body;
    console.log(title, content, image, tags)

    if (!title) {
        let error = "Title missing";
        errors.push(error);
    }
    if (!content) {
        console.log("no content")
        let error = "Content missing";
        errors.push(error);
    }
    // if (!image) {
    //     let error = "Image missing";
    //     errors.push(error);
    // }
    if (!tags) {
        let error = "Tags missing";
        errors.push(error);
    }

    if (errors.length) {
        res.status(406);
        return res.json({
            error: "Invalid request",
            message: errors
        })
    }
}

module.exports = { index, show, store, update, modify, destroy };