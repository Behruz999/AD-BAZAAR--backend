const SellerModel = require("../models/seller");
const { sign } = require("jsonwebtoken");
const {
  saveFile,
  unlinkImage,
  unlinkImageToDelete,
  unlinkImageErrorOccur,
} = require("../utils/upload");

async function signUp(req, res, next) {
  try {
    const existSeller = await SellerModel.findOne({ phone: req.body?.phone });

    if (existSeller) {
      return res.status(400).json({ msg: `Try another credentials !` });
    }

    await saveFile(req, res);

    const newSeller = await SellerModel.create(req.body);

    const token = sign(
      {
        telegramId: newSeller?.telegramId,
        phone: newSeller?.phone,
        role: newSeller?.role,
      },
      process.env?.JWT_SECRET,
      { expiresIn: process.env?.JWT_EXPIRE }
    );

    return res.status(200).json({
      msg: `Welcome to the announcement center ${newSeller.username} !`,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function signIn(req, res, next) {
  const { phone, password } = req.body;
  try {
    const existSeller = await SellerModel.findOne({ phone, password });

    if (!existSeller) {
      return res
        .status(401)
        .json({ msg: `Invalid credentials or not registered !` });
    }

    const token = sign(
      {
        telegramId: existSeller?.telegramId,
        phone: existSeller?.phone,
        role: existSeller?.role,
      },
      process.env?.JWT_SECRET,
      { expiresIn: process.env?.JWT_EXPIRE }
    );

    return res.status(200).json({
      msg: `Welcome back to the announcement center ${existSeller.username} !`,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const allSellers = await SellerModel.find()
      .populate("liked", "title")
      .populate("subscriptions", "username");

    return res.status(200).json(allSellers);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const specifiedSeller = await SellerModel.findById(req.params?.id)
      .populate("liked", "title")
      .populate("subscriptions", "username");

    if (!specifiedSeller) {
      return res.status(404).json({ msg: `Seller not found !` });
    }

    return res.status(200).json(specifiedSeller);
  } catch (err) {
    next(err);
  }
}

async function editOne(req, res, next) {
  const { likeEvent, subscribeEvent } = req.body;
  try {
    const existSeller = await SellerModel.findById(req.params?.id);

    if (!existSeller) {
      return res.status(404).json({ msg: `Seller not found !` });
    }

    if (likeEvent) {
      const likedIndex = existSeller.liked.indexOf(likeEvent?.content);

      if (likedIndex !== -1 && likeEvent?.status == 0) {
        existSeller.liked.splice(likedIndex, 1);
      } else if (likedIndex === -1 && likeEvent?.status == 1) {
        existSeller.liked.push(likeEvent?.content);
      }
    }

    if (subscribeEvent) {
      const subscriptionIndex = existSeller.subscriptions.indexOf(
        subscribeEvent?.content
      );

      if (subscriptionIndex !== -1 && subscribeEvent?.status == 0) {
        existSeller.subscriptions.splice(subscriptionIndex, 1);
      } else if (subscriptionIndex === -1 && subscribeEvent?.status == 1) {
        existSeller.subscriptions.push(subscribeEvent?.content);
      }
    }

    if (req.file) {
      await saveFile(req, res);
      await unlinkImage(req, existSeller);
    }

    for (const key of Object.keys(req.body)) {
      existSeller[key] = req.body[key];
    }

    const savedSeller = await existSeller.save();

    const metaData = await SellerModel.populate(savedSeller, [
      { path: "liked", select: "title" },
      { path: "subscriptions", select: "username" },
    ]);

    return res.status(200).json(metaData);
  } catch (err) {
    unlinkImageErrorOccur(req);
    if (err.code == 11000) {
      return res.status(400).json({ msg: `Try another credentials !` });
    }
    next(err);
  }
}

async function deleteOne(req, res, next) {
  try {
    const deletedSeller = await SellerModel.findByIdAndDelete(req.params?.id);

    if (!deletedSeller || req.params.id.length !== 24) {
      const msg = `Seller not found !`;
      return res.status(404).json({ msg });
    }

    if (deletedSeller.img) {
      await unlinkImageToDelete(deletedSeller, "img");
    }

    return res.status(200).json(deletedSeller);
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
