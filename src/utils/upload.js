const multer = require("multer");
const { join, extname } = require("path");
const { existsSync, mkdirSync, writeFile, unlink } = require("fs");
// const { unlink } = require("fs").promises;
const uploadPath = join(__dirname, "../uploads");
const { promisify } = require("util");
const unlinkAsync = promisify(unlink);
const writeFileAsync = promisify(writeFile);
const { errorLogger } = require("../utils/errorHandler");

const storage = multer.memoryStorage();

// configs for single file upload
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const msg = `Unsupported image type !`;
    errorLogger(req, msg, 400);
    cb(new Error(msg), false);
  }
  cb(null, true);
};

async function saveFile(req, res) {
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  if (req?.file) {
    const extension = extname(req.file?.originalname);
    const filename = Date.now() + extension;
    const filePath = join(uploadPath, filename);

    writeFileAsync(filePath, req.file?.buffer);
    const url = `${req.protocol}://${req.get("host")}/${filename}`;
    req.body.img = url;
  }
}

// configs for multiple files upload
const filesFilter = (req, files, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(files.mimetype)) {
    const msg = `Unsupported image type !`;
    errorLogger(req, msg, 400);
    cb(new Error(msg), false);
  }
  cb(null, true);
};

async function saveFiles(req, res) {
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  if (!req.body.images) {
    req.body.images = [];
  }

  if (req?.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const extension = extname(file.originalname);
      const filename = Date.now() + extension;
      const filePath = join(uploadPath, filename);

      await writeFileAsync(filePath, file.buffer);

      const url = `${req.protocol}://${req.get("host")}/${filename}`;
      req.body.images.push(url);
    }
  }

  // if (req?.file) {
  //   const file = req.file;
  //   const extension = extname(file.originalname);
  //   const filename = Date.now() + extension;
  //   const filePath = join(uploadPath, filename);

  //   await writeFileAsync(filePath, file.buffer);

  //   const url = `${req.protocol}://${req.get("host")}/${filename}`;
  //   req.body.images.push(url);
  // }

  return req.body.images;
}

const uploadOne = multer({
  storage,
  fileFilter,
}).single("img");

const uploadMany = multer({
  storage,
  filesFilter,
}).array("images", 20);

// deleting or updating img

async function unlinkImage(req, doc) {
  const newImageURL = req.body?.img;
  const imageURLsToDelete = req.body?.deleteImages;

  if (doc?.img) {
    const existingImagePath = join(
      uploadPath,
      getImageFilenameFromUrl(doc.img)
    );
    if (existsSync(existingImagePath)) {
      await unlinkAsync(existingImagePath);
    }
  } else if (doc?.images && Array.isArray(doc?.images)) {
    for (const imgUrl of imageURLsToDelete) {
      const imagePath = join(uploadPath, getImageFilenameFromUrl(imgUrl));
      if (existsSync(imagePath)) {
        await unlinkAsync(imagePath);
      }
    }
  }

  doc.img = newImageURL;
}

async function unlinkImageErrorOccur(request) {
  const { img } = request.body;
  if (img) {
    const filePath = img.split("/").pop();
    await unlinkAsync(join(uploadPath, filePath));
  }
}

// async function unlinkImageToDelete(person, fieldName) {
//   const imagePath = join(
//     uploadPath,
//     getImageFilenameFromUrl(person[fieldName])
//   );
//   if (existsSync(imagePath)) {
//     await unlinkAsync(imagePath);
//   }
// }

async function unlinkImageToDelete(doc, fieldName) {
  const images = doc[fieldName];

  if (Array.isArray(images)) {
    for (const imgUrl of images) {
      const imagePath = join(uploadPath, getImageFilenameFromUrl(imgUrl));
      if (existsSync(imagePath)) {
        await unlinkAsync(imagePath);
      }
    }
  } else if (typeof images === "string") {
    const imagePath = join(uploadPath, getImageFilenameFromUrl(images));
    if (existsSync(imagePath)) {
      await unlinkAsync(imagePath);
    }
  }
}

function getImageFilenameFromUrl(imgUrl) {
  const urlParts = imgUrl.split("/");
  return urlParts[urlParts.length - 1];
}

module.exports = {
  uploadOne,
  saveFile,
  uploadMany,
  saveFiles,
  unlinkImage,
  unlinkImageToDelete,
  unlinkImageErrorOccur,
};
