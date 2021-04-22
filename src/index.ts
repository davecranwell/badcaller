import config from "config";

import app from "./app";
import makeLogger from "./logger";
import { listen } from "./lib/serialInterface";

const logger = makeLogger("index");
const port = config.get("port");

const serial = listen((data) => {
  console.log("Data received: " + data);

  // If data contains a number extract it and activate the current caller.
  if (data.indexOf("NMBR=") > -1) {
    const phoneNumber = data.split("=")[1];
    console.log("Callers number: " + phoneNumber);
  }
});

const server = app.listen(port);

server.on("listening", () => {
  logger.info("Started");
});
