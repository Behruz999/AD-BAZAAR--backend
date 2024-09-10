const router = require("express").Router();
const {
  add,
  getAll,
  getOne,
  editOne,
  deleteOne,
  getAuthorAnnouncements,
} = require("../controller/announcement");

const isUserAuthenticated = require("../utils/verifyToken");

const permission = require("../utils/permission");

const { uploadMany } = require("../utils/upload");

const { validateParams, validateBody } = require("../validations/announcement");

router.route("/").post(uploadMany, validateBody, add);

router.route("/").get(getAll);

router.route("/:id").get(validateParams, getOne);

router
  .route("/byauthorannouncement/:id")
  .get(validateParams, getAuthorAnnouncements);

router.route("/:id").put(uploadMany, (req, res, next) => {
  // console.log(req.files, 'route level')
  next()
}, validateParams, editOne);

router.route("/:id").delete(validateParams, deleteOne);

module.exports = router;
