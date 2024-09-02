import express, { type Request, type Response, type Application } from "express";
import config from "config";

const app: Application = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

const PORT = config.get<number>("port");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
