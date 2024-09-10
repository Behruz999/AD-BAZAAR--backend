const AnnouncementModel = require("../models/announcement");
const {
  saveFiles,
  unlinkImageToDelete,
  unlinkImageErrorOccur,
  unlinkImage,
} = require("../utils/upload");

async function add(req, res, next) {
  try {
    await saveFiles(req, res);
    const newAnnouncement = await AnnouncementModel.create(req.body);

    return res.status(201).json(newAnnouncement);
  } catch (err) {
    // unlinkImageErrorOccur(req);
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const allAnnouncements = await AnnouncementModel.find();

    return res.status(200).json(allAnnouncements);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const specifiedAnnouncement = await AnnouncementModel.findById(
      req.params.id
    );

    if (!specifiedAnnouncement) {
      return res.status(404).json({ msg: `Announcement not found !` });
    }

    specifiedAnnouncement.views = specifiedAnnouncement.views += 1;

    await specifiedAnnouncement.save();

    return res.status(200).json(specifiedAnnouncement);
  } catch (err) {
    next(err);
  }
}

async function editOne(req, res, next) {
  try {
    const existAnnouncement = await AnnouncementModel.findById(req.params.id);

    if (!existAnnouncement) {
      return res.status(404).json({ msg: `Announcement not found !` });
    }

    if (req?.files) {
      const newImageURLs = await saveFiles(req, res);
      if (newImageURLs) {
        existAnnouncement.images.push(...newImageURLs);
      }
    }

    for (const key of Object.keys(req.body)) {
      if (key === "deleteImages") {
        await unlinkImage(req, existAnnouncement);

        existAnnouncement.images = existAnnouncement.images.filter(
          (imageUrl) => !req.body.deleteImages.includes(imageUrl)
        );
      }

      if (key !== "images" && key !== "deleteImages") {
        existAnnouncement[key] = req.body[key];
      }
    }

    await existAnnouncement.save();

    return res.status(200).json(existAnnouncement);
  } catch (err) {
    // unlinkImageErrorOccur(req);
    next(err);
  }
}

async function deleteOne(req, res, next) {
  try {
    const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAnnouncement) {
      return res.status(404).json({ msg: `Announcement not found !` });
    }

    await unlinkImageToDelete(deletedAnnouncement, "images");

    return res.status(200).json(deletedAnnouncement);
  } catch (err) {
    next(err);
  }
}

async function getAuthorAnnouncements(req, res, next) {
  try {
    const authorAnnouncements = await AnnouncementModel.find({
      seller: req.params.id,
    });

    return res.status(200).json(authorAnnouncements);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  add,
  getAll,
  getOne,
  editOne,
  deleteOne,
  getAuthorAnnouncements,
};
