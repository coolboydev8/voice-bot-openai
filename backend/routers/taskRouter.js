const { Router } = require("express");
const taskController = require("../controllers/taskController");

const router = Router();

router.post("/check", taskController.check);
router.post("/getTaskList", taskController.getTaskList);
router.post("/getProgress", taskController.getProgress);
router.post("/createHistoy", taskController.createHistoy);
module.exports = router;
