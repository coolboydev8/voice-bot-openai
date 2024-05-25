const { Router } = require("express");
const markController = require("../controllers/markController");

const router = Router();

router.post("/scoring", markController.scoring);
router.post("/getMark", markController.getMark);

module.exports = router;
