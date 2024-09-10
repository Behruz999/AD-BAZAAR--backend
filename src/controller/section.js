const SectionModel = require("../models/section");
const {
  saveFile,
  unlinkImage,
  unlinkImageToDelete,
  unlinkImageErrorOccur,
} = require("../utils/upload");

async function add(req, res, next) {
  try {
    if (req.file) {
      await saveFile(req, res);
    }

    const newSection = await SectionModel.create(req.body);

    return res.status(201).json(newSection);
  } catch (err) {
    unlinkImageErrorOccur(req);
    if (err.code === 11000) {
      const msg = `Try another name !`;
      return res.status(400).send({
        msg,
      });
    }
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const allSections = await SectionModel.find();

    return res.status(200).json(allSections);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const specifiedSection = await SectionModel.findById(req.params.id);

    if (!specifiedSection) {
      return res.status(404).json({ msg: `Section not found !` });
    }

    return res.status(200).json(specifiedSection);
  } catch (err) {
    next(err);
  }
}

async function editOne(req, res, next) {
  const { newCategories, categories } = req.body;
  try {
    const existSection = await SectionModel.findById(req.params.id);

    if (!existSection) {
      return res.status(404).json({ msg: `Section not found !` });
    }

    if (req.file) {
      await saveFile(req, res);
      await unlinkImage(req, existSection);
    }

    // Object.keys(req.body).forEach((key) => {
    //   if (key == "categories") {
    //     const newCategories = req.body.categories;
    //     newCategories.forEach((newCategory) => {
    //       const categoryIndex = existSection?.categories.findIndex(
    //         (category) => category?._id.toString() === newCategory?._id
    //       );
    //       if (categoryIndex !== -1) {
    //         existSection.categories[categoryIndex] = newCategory;
    //       } else {
    //         existSection.categories.push(newCategory);
    //       }
    //     });
    //   } else {
    //     existSection[key] = req.body[key];
    //   }
    // });

    // if (categoryId) {
    //   const existCategory = existSection?.categories.find(
    //     (c) => c?._id.toString() === categoryId
    //   );

    //   if (existCategory) {
    //     existSection.categories = existSection.categories.filter(
    //       (c) => c != existCategory
    //     );
    //   }
    // }

    const validCategories = [];
    if (newCategories) {
      const presentCategory = existSection?.categories?.find((category) => {
        return newCategories?.some(
          (nwCateg) => nwCateg?.name == category?.name
        );
      });

      if (presentCategory) {
        return res.status(400).json({ msg: `Exist category !` });
      }

      validCategories.push(...newCategories);
    }

    if (categories) {
      for (const category of categories) {
        if (category?.status == 1) {
          const presentCategoryIndex = existSection?.categories?.findIndex(
            (cat) => {
              return cat?._id == category?._id;
            }
          );

          if (presentCategoryIndex == -1) {
            return res.status(400).json({ msg: `Category not found !` });
          }

          existSection.categories[presentCategoryIndex]["_id"] = category?._id;
          existSection.categories[presentCategoryIndex]["name"] =
            category?.name;
        } else if (category?.status == 0) {
          existSection.categories = existSection?.categories.filter((cat) => {
            return !(cat?._id == category?._id && cat?.name == category?.name);
          });
        }
      }
    }

    existSection?.categories.push(...validCategories);

    await existSection.save();

    return res.status(200).json(existSection);
  } catch (err) {
    unlinkImageErrorOccur(req);
    next(err);
  }
}

async function deleteOne(req, res, next) {
  try {
    const deletedSection = await SectionModel.findByIdAndDelete(req.params.id);

    if (!deletedSection) {
      return res.status(404).json({ msg: `Section not found !` });
    }

    if (deletedSection.img) {
      await unlinkImageToDelete(deletedSection, "img");
    }

    return res.status(200).json(deletedSection);
  } catch (err) {
    next(err);
  }
}

async function getSectionCategories(req, res, next) {
  try {
    const sectionCategories = await SectionModel.findById(req.params.id).select(
      "categories"
    );

    return res.status(200).json(sectionCategories);
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
  getSectionCategories,
};
