const express = require("express");
const router = express.Router();

const { authController } = require("../controllers");

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
router.post("/register", authController.register);
router.post("/auth", authController.auth);

module.exports = router;

    

