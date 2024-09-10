require("dotenv").config();
const express = require("express");
const app = express();
const { DBConnection, PORTConnection } = require("./settings/connections/connection");
const allRoutes = require("./router");
const secureSystem = require("./settings/security/secure");
const { globalErrorHandler } = require("./utils/errorHandler");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

secureSystem(app, express);

(async () => {
  try {
    await DBConnection();
  } catch (err) {
    // Pass the error to the global error handler
    app.use((req, res, next) => {
      next(err);
    });
  }
})();

bot.on("message", (msg) => {
  const {
    chat: { id },
  } = msg;
  bot.sendMessage(id, "pong");
});

app.use("/api", allRoutes);

app.use(globalErrorHandler);

PORTConnection(app);
