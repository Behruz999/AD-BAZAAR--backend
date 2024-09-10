const Joi = require("joi");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": '"id" length must be correct !',
    "string.hex": '"id" must be a valid format !',
    "any.required": '"id" is a required field !',
  }),
}).options({ allowUnknown: false });

const bodySchema = Joi.object({
  title: Joi.string().trim(true).required(),
  desc: Joi.string().trim(true).required(),
  address: Joi.string().trim(true).required(),
  seller: Joi.string().hex().length(24).trim(true).required(),
  section: Joi.string().hex().length(24).trim(true).required(),
  category: Joi.object({
    _id: Joi.string().hex().length(24).trim(true).required(),
    name: Joi.string().trim(true).required(),
  }),
  currancy: Joi.string().trim(true),
  price: Joi.number().required(),
  rate: Joi.number(),
}).options({ allowUnknown: false });

const updateSchema = Joi.object({
  title: Joi.string().trim(true),
  desc: Joi.string().trim(true),
  address: Joi.string().trim(true),
  seller: Joi.string().hex().length(24).trim(true),
  section: Joi.string().hex().length(24).trim(true),
  category: Joi.object({
    _id: Joi.string().hex().length(24).trim(true).required(),
    name: Joi.string().trim(true),
  }),
  currancy: Joi.string().trim(true),
  price: Joi.number(),
  rate: Joi.number(),
}).options({ allowUnknown: false });

async function validateParams(req, res, next) {
  try {
    await paramsSchema.validateAsync(req.params);
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
  validateBody,
  validateUpdate,
};
