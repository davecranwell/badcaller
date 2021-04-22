import config from "config";
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";

const serialPort = config.get("serialPort") as string;
const port = new SerialPort(serialPort, { autoOpen: false });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

export const listen = ({ onOpen, onData }) => {
  port.write("AT+VCID=1\r", function (err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log("Enabling CallerId nice");
  });

  port.on("open", onOpen);

  parser.on("data", onData);
};
