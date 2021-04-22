import config from "config";
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";

export const listen = (onData) => {
  const serialPort = config.get("serialPort");
  const port = new SerialPort(serialPort);
  const parser = port.pipe(new Readline({ delimiter: "\n" }));

  port.write("AT+VCID=1\r", function (err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log("Enabling CallerId nice");
  });

  parser.on("data", onData);
};
