import config from "config";
import SerialPort from "serialport";

const serialPort = config.get("serialPort") as string;
const port = new SerialPort(serialPort, { autoOpen: false });

port.write("NMBR=1\r", (error) => {
  if (error) {
    return console.log("Error on write: ", error.message);
  }
});
