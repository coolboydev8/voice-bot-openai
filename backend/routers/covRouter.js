const { Router } = require("express");
const covController = require("../controllers/covController");

const router = Router();

router.post("/createList", covController.create);

module.exports = router;
