import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

app.use((req, res) => {
  return res.status(404);
});

app.use((err: Error, req: Request, res: Response) => {
  return res.status(500);
});

export default app;