const router = require("express").Router();
const {
  add,
  getAll,
  getOne,
  editOne,
  deleteOne,
  getSectionCategories,
} = require("../controller/section");

const {
  validateParams,
  validateBody,
  validateUpdate,
} = require("../validations/section");

const isUserAuthenticated = require("../utils/verifyToken");

const permission = require("../utils/permission");

const { uploadOne } = require("../utils/upload");

router.route("/").post(uploadOne, validateBody, add);

router.route("/").get(getAll);

router.route("/:id").get(validateParams, getOne);

router
  .route("/sectioncategories/:id")
  .get(validateParams, getSectionCategories);

router.route("/:id").put(uploadOne, validateParams, validateUpdate, editOne);

router.route("/:id").delete(validateParams, deleteOne);

module.exports = router;
