import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import categoriaRoutes from "./routes/categoria.routes";
import productoRoutes from "./routes/productos.routes";

dotenv.config();

const app = express();

// Middlewares Globales
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Paola Store API corriendo en puerto ${PORT}`);
});