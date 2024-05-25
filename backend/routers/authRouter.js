const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.post("/login", authController.login_post);
router.post("/forgot", authController.forgot);

module.exports = router;
