import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "@/routes/api";
import { errorHandler } from "@/handlers/error";

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRouter);

app.use(errorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
