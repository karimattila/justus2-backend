import express from "express";
const router = express();

router.get("/", (req, res, next) => {
        res.status(200).json({
            message: "Handling GET requests to /api"
        });
});

router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET requests to /api"
    });
});

module.exports = router;