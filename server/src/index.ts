import config from "config";
import axios from "axios";

import app from "./app";
import makeLogger from "./logger";
import { listen } from "./lib/serialInterface";
import lookupNumber from "./lib/lookupNumber";

const logger = makeLogger("index");
const port = config.get("port");

const server = app.listen(port);

server.on("listening", () => {
  logger.info("Started server");

  const serial = listen({
    onOpen: () => {
      logger.info("Started serial port listener");
    },
    onData: async (data: string) => {
      logger.trace(data);

      if (data.indexOf("NMBR=") > -1) {
        const phoneNumber: string = data.split("=").pop() as string;

        await lookupNumber(phoneNumber);
      }
    },
  });
});
