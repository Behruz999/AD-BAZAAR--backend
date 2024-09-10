const router = require("express").Router();
const {
  signUp,
  signIn,
  getAll,
  getOne,
  editOne,
  deleteOne,
} = require("../controller/seller");

const {
  validateParams,
  validateBody,
  validateUpdate,
  validateSignUp,
  validateSignIn,
} = require("../validations/seller");

const isUserAuthenticated = require("../utils/verifyToken");
const permissionCheck = require("../utils/permission");

const { uploadOne } = require("../utils/upload");

router.route("/signup").post(uploadOne, validateSignUp, signUp);

router.route("/signin").post(validateSignIn, signIn);

router.route("/").get(getAll);

router.route("/:id").get(validateParams, getOne);

router.route("/:id").put(uploadOne, validateParams, validateUpdate, editOne);

router.route("/:id").delete(validateParams, deleteOne);

module.exports = router;
