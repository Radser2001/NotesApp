const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const datetime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${datetime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      //create the directory if it doesn't exist
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    // create the file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

//middleware
const logger = (req, res, next) => {
  if (req.headers.origin !== process.env.localDevelopmentURL) {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  }

  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
