import express from "express";
import { apiRouter } from "@/routes/api";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
