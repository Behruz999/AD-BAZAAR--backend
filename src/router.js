const router = require("express").Router();
const userRoutes = require("./routes/user");
const sellerRoutes = require("./routes/seller");
const announcementRoutes = require("./routes/announcement");
const sectionRoutes = require("./routes/section");

router.use("/users", userRoutes);

router.use("/sellers", sellerRoutes);

router.use("/announcements", announcementRoutes);

router.use("/sections", sectionRoutes);

module.exports = router;
