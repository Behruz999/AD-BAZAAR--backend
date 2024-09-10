const cors = require("cors");
const { join } = require("path");
const uploadPath = join(__dirname, "../../uploads");

const allowedOrigins = [];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET, HEAD, OPTIONS, POST, PUT, PATCH, DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

module.exports = (app, express) => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.static(uploadPath));
};
