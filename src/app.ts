import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ status: "success", message: "Intelligence Query Engine" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "success", message: "ok" });
});

export default app;