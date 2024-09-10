const router = require("express").Router();
const {
  signUp,
  signIn,
  getAll,
  getOne,
  editOne,
  deleteOne,
} = require("../controller/user");

const {
  validateParams,
  validateSignUp,
  validateSignIn,
  validateUpdate,
} = require("../validations/user");

const isUserAuthenticated = require("../utils/verifyToken");

const permission = require("../utils/permission");

router.route("/signup").post(validateSignUp, signUp);

router.route("/signin").post(validateSignIn, signIn);

router.route("/").get(isUserAuthenticated, permission('user', ['read']), getAll);

router.route("/:id").get(isUserAuthenticated, permission('user', ['read']), validateParams, getOne);

router.route("/:id").put(isUserAuthenticated, permission('user', ['update']), validateParams, validateUpdate, editOne);

router.route("/:id").delete(isUserAuthenticated, permission('user', ['delete']), validateParams, deleteOne);

module.exports = router;
