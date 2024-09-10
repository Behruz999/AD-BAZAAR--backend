const Joi = require("joi");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": '"id" length must be correct !',
    "string.hex": '"id" must be a valid format !',
    "any.required": '"id" is a required field !',
  }),
}).options({ allowUnknown: false });

const querySchema = Joi.object({
  reviewed: Joi.string().hex().length(24).required().messages({
    "string.length": '"reviewed" length must be correct !',
    "string.hex": '"reviewed" must be a valid format !',
    "any.required": '"reviewed" is a required field !',
  }),
  userId: Joi.string().hex().length(24).messages({
    "string.length": '"reviewed" length must be correct !',
    "string.hex": '"reviewed" must be a valid format !',
  }),
}).options({ allowUnknown: false });

const bodySchema = Joi.object({
  telegramId: Joi.string(),
  username: Joi.string().min(3).max(20).required(),
  phone: Joi.string().min(7).max(15).required(),
  password: Joi.string().min(4).max(30).required(),
  address: Joi.string(),
  liked: Joi.string().hex().length(24),
  subscriptions: Joi.string().hex().length(24),
  lastOnline: Joi.string(),
  role: Joi.string().lowercase(),
}).options({ allowUnknown: false });

const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  phone: Joi.string().min(7).max(15).required(),
  password: Joi.string().min(4).max(30).required(),
  address: Joi.string(),
}).options({ allowUnknown: false });

const signInSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
}).options({ allowUnknown: false });

const updateSchema = Joi.object({
  telegramId: Joi.string(),
  username: Joi.string().min(3).max(20),
  phone: Joi.string().min(7).max(15),
  password: Joi.string().min(4).max(30),
  address: Joi.string(),
  likeEvent: Joi.object({
    content: Joi.string().hex().length(24).trim(true).required(),
    status: Joi.number().required(),
  }),
  subscribeEvent: Joi.object({
    content: Joi.string().hex().length(24).trim(true).required(),
    status: Joi.number().required(),
  }),
  role: Joi.string().lowercase(),
}).options({ allowUnknown: false });

async function validateParams(req, res, next) {
  try {
    await paramsSchema.validateAsync(req.params);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err?.message ? err?.message : err });
  }
}

async function validateQuery(req, res, next) {
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err?.message ? err?.message : err });
  }
}

async function validateBody(req, res, next) {
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err?.message ? err?.message : err });
  }
}

async function validateSignUp(req, res, next) {
  try {
    await signUpSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err?.message ? err?.message : err });
  }
}

async function validateSignIn(req, res, next) {
  try {
    await signInSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err?.message ? err?.message : err });
  }
}

async function validateUpdate(req, res, next) {
  try {
    await updateSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err?.message ? err?.message : err });
  }
}

module.exports = {
  validateParams,
  validateQuery,
  validateBody,
  validateUpdate,
  validateSignUp,
  validateSignIn,
};
