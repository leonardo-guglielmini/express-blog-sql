function notFound(req, res) {
    res.status(404);
    res.json({
        error: "Not found"
    });
}

module.exports = notFound