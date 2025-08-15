
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ping
app.get("/", (_req, res) => res.json({ ok:true, name:"Backend Evaluación Clase", ts:Date.now() }));

// Rutas API
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

// UI de prueba
app.use(express.static(path.join(__dirname, "public")));
app.get("/app", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 3000;
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) { console.error("❌ Falta MONGODB_URI en .env"); process.exit(1); }

mongoose.connect(MONGODB_URI).then(() => {
  console.log("✅ MongoDB conectado");
  app.listen(PORT, () => console.log(`🚀 API en http://localhost:${PORT}`));
}).catch(err => { console.error("❌ Error conectando a MongoDB:", err.message); process.exit(1); });
