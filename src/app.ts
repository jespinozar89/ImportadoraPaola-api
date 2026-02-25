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
import prisma from "./config/prisma";

dotenv.config();

const app = express();

// Middlewares Globales
const allowedOrigins = [
  "https://libreriapaola.cl",
  "http://localhost:4200"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
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

const server = app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
  console.log(`📖 Swagger docs disponibles en http://localhost:${PORT}/api-docs`);
});

["SIGINT", "SIGTERM"].forEach(signal => {
  process.on(signal, async () => {
    console.log(`🛑 Señal ${signal} recibida, cerrando servidor...`);
    await prisma.$disconnect();
    server.close(() => {
      console.log("✅ Servidor y base de datos cerrados correctamente");
      process.exit(0);
    });
  });
});



