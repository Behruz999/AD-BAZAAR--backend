const Joi = require("joi");

const paramsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": '"id" length must be correct !',
    "string.hex": '"id" must be a valid format !',
    "any.required": '"id" is a required field !',
  }),
}).options({ allowUnknown: false });

const bodySchema = Joi.object({
  name: Joi.string().required(),
  categories: Joi.array()
    .items({
      // _id: Joi.string().hex().length(24).required().trim(true),
      name: Joi.string().required().trim(true),
    })
    .required(),
}).options({ allowUnknown: false });

const updateSchema = Joi.object({
  name: Joi.string(),
  newCategories: Joi.array().items({
    name: Joi.string().trim(true).required(),
  }),
  categories: Joi.array().items({
    _id: Joi.string().hex().length(24).trim(true).required(),
    name: Joi.string().trim(true).required(),
    status: Joi.number().required(),
  }),
  // categories: Joi.array().items({
  //   _id: Joi.string().hex().length(24).trim(true),
  //   name: Joi.string().required().trim(true),
  // }),
  categoryId: Joi.string().hex().length(24),
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
    if (!req.file) {
      throw new Error("Image's required !");
    }
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
