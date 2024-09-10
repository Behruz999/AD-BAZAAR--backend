const { connect } = require("mongoose");

async function DBConnection(req, res, next) {
  try {
    await connect(process.env?.DB_URL);
    console.log(`DB's online...`);
  } catch (err) {
    next(err);
  }
}

async function PORTConnection(app) {
  app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT}'s port online...`);
  });
}

module.exports = {
  DBConnection,
  PORTConnection,
};
