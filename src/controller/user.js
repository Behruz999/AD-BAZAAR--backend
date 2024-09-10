const UserModel = require("../models/user");
const { sign } = require("jsonwebtoken");

async function signUp(req, res, next) {
  const { telegramId, username, phone, password, role } = req.body;
  try {
    const existUser = await UserModel.findOne({ phone, password });

    if (existUser) {
      return res.status(400).json({ msg: `Try another credentials !` });
    }

    const newUser = new UserModel({
      telegramId,
      username,
      phone,
      password,
      role,
    });

    await newUser.save();

    const token = sign(
      {
        telegramId: newUser?.telegramId,
        phone: newUser?.phone,
        role: newUser?.role,
      },
      process.env?.JWT_SECRET,
      { expiresIn: process.env?.JWT_EXPIRE }
    );

    return res.status(200).json({
      msg: `Welcome to the announcement center ${newUser.username} !`,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function signIn(req, res, next) {
  const { phone, password } = req.body;
  try {
    const existUser = await UserModel.findOne({ phone, password });

    if (!existUser) {
      return res
        .status(401)
        .json({ msg: `Invalid credentials or not registered !` });
    }

    const token = sign(
      {
        telegramId: existUser?.telegramId,
        phone: existUser?.phone,
        role: existUser?.role,
      },
      process.env?.JWT_SECRET,
      { expiresIn: process.env?.JWT_EXPIRE }
    );

    return res.status(200).json({
      msg: `Welcome back to the announcement center ${existUser.username} !`,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const allUsers = await UserModel.find();

    return res.status(200).json(allUsers);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const specifiedUser = await UserModel.findById(req.params?.id);

    if (!specifiedUser) {
      return res.status(404).json({ msg: `User not found !` });
    }

    return res.status(200).json(specifiedUser);
  } catch (err) {
    next(err);
  }
}

async function editOne(req, res, next) {
  try {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!modifiedUser) {
      return res.status(404).json({ msg: `User not found !` });
    }

    return res.status(200).json(modifiedUser);
  } catch (err) {
    next(err);
  }
}

async function deleteOne(req, res, next) {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params?.id);

    if (!deletedUser) {
      return res.status(404).json({ msg: `User not found !` });
    }

    return res.status(200).json(deletedUser);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signUp,
  signIn,
  getAll,
  getOne,
  editOne,
  deleteOne,
};
