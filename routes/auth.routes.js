const { register, login, whoami, whoamiAPI } = require("../controllers/auth.controllers");
const { restrict } = require("../middlewares/auth.middlewares");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/whoami", restrict, whoami);
router.get("/whoamiAPI", restrict, whoamiAPI);

module.exports = router;