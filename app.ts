// import packages
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";

// import routers

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("dev"));

export default app;
