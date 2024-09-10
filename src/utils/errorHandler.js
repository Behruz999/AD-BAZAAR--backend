const { MulterError } = require("multer");

function globalErrorHandler(err, req, res, next) {
  if (err) {
    // console.log(err);
    if (err instanceof MulterError) {
      if (err.code == "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          msg: "You can only upload one image file !",
        });
      }
    }
    return res.status(500).json({
      msg: `Internal Server Error: ${err?.message ? err?.message : err}`,
    });
  }

  next();
}

module.exports = {
  globalErrorHandler,
};
