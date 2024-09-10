const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const addRequestId = require("express-request-id")();
const errorHandler = require("./utils/errorHandler");
const morganMiddleware = require("./utils/morgan");
const { jsonS } = require("./utils");
const apiRoute = require("./routes/v1");
const validateRequiredEnvs = require("./utils/requiredEnvs");
const { SESSION_SECRET } = require("./config/app");
const session = require("express-session");

const app = express();

// validate ENV
validateRequiredEnvs();

// create a rotating write stream
app.use(addRequestId);

app.set("trust proxy", true);

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// adding Helmet to enhance your API's security
app.use(helmet());
app.options("*", cors());
app.use(morganMiddleware);

app.use(
  session({ secret: `${SESSION_SECRET}`, saveUninitialized: true, resave: true })
);

// api route
app.use("/api/v1", apiRoute);

// status report
app.all("/", (req, res) => {
  return jsonS(res, 200, `Online by ${Date()} on ${req.app.get("env")} Environment`, {});
});

app.use("**", (req, res, next) => {
  let err = {};
  err.message = `${req.ip} tried to reach a resource at ${req.originalUrl} that is not on this server.`;
  err.code = 404;
  err.isOperational = true;
  next(err);
}
);

app.use(errorHandler);

module.exports = app;
