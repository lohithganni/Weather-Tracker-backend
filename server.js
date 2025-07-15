import express from "express";
import cors from "cors";
import router from "./api/weather.route.js";
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/", router);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
