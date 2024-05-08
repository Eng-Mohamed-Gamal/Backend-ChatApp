import dotenv from "dotenv";
import express from "express";
import { initiateApp } from "./src/initiate-app.js";

const app = express();

dotenv.config();






initiateApp(app, express);




