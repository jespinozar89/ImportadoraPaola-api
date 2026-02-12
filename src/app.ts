import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import categoriaRoutes from "./routes/categoria.routes";
import productoRoutes from "./routes/productos.routes";
import pedidoRoutes from "./routes/pedido.routes";
import { setupSwagger } from "./config/swagger";
import favoritoRoutes from "./routes/favorito.routes";
import carritoRoutes from "./routes/carrito.routes";

dotenv.config();

const app = express();

// Middlewares Globales
app.use(cors({
  origin: "https://www.libreriapaola.cl",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
setupSwagger(app);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/favoritos", favoritoRoutes);
app.use("/api/carrito", carritoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Paola Store API corriendo en puerto ${PORT}`);
  console.log(`📖 Swagger docs disponibles en http://localhost:${PORT}/api-docs`);
});