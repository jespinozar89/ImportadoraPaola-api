// Módulo de Autenticación
import { PrismaUsuarioRepository } from "../repositories/usuario.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

// Módulo de Categoría
import { PrismaCategoriaRepository } from "../repositories/categoria.repository";
import { CategoriaService } from "../services/categoria.service";
import { CategoriaController } from "../controllers/categoria.controller";

// Módulo de Productos
import { PrismaProductoRepository } from "../repositories/producto.repository";
import { ProductoService } from "../services/producto.service";
import { ProductoController } from "../controllers/producto.controller";

// Módulo de Pedidos
import { PrismaPedidoRepository } from "../repositories/pedido.repository";
import { PedidoService } from "../services/pedido.service";
import { PedidoController } from "../controllers/pedido.controller";

// Módulo de Favoritos
import { PrismaFavoritoRepository } from "../repositories/favorito.repository";
import { FavoritoService } from "../services/favorito.service";
import { FavoritoController } from "../controllers/favorito.controller";

// Módulo de Carrito de Compras
import { PrismaCarritoRepository } from "../repositories/carrito.repository";
import { CarritoService } from "../services/carrito.service";
import { CarritoController } from "../controllers/carrito.controller";

// Módulo de Direcciones
import { PrismaDireccionRepository } from "../repositories/direccion.repository";
import { DireccionService } from "../services/direccion.service";
import { DireccionController } from "../controllers/direccion.controller";

//Correo
import { CorreoService } from "../services/correo.service";

//Klap
import { KlapService } from "../services/klap.service";
import { KlapController } from "../controllers/klap.controller";

//webhook
import { KlapWebhookController } from '../controllers/KlapWebhook.controller';
import { KlapWebhookService } from "../services/klapWebhook.service";
import { TarifaController } from "@/controllers/tarifa.controller";

// Módulo Starken
import { StarkenService } from "../services/starken.service";
import { StarkenController } from "../controllers/starken.controller";

// Módulo Envío
import { PrismaEnvioRepository } from "../repositories/envio.repository";
import { EnvioService } from "../services/envio.service";
import { EnvioController } from "../controllers/envio.controller";

// Módulo Starken Webhook
import { StarkenWebhookService } from "../services/starkenWebhook.service";
import { StarkenWebhookController } from "../controllers/starkenWebhook.controller";

// --- Correo Module Instances ---
const correoService = new CorreoService();

// --- Auth Module Instances ---
const usuarioRepository = new PrismaUsuarioRepository();
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService,correoService);

// --- Categoria Module Instances ---
const categoriaRepository = new PrismaCategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

// --- Producto Module Instances ---
const productoRepository = new PrismaProductoRepository();
const productoService = new ProductoService(productoRepository);
const productoController = new ProductoController(productoService);

// --- Pedido Module ---
const pedidoRepository = new PrismaPedidoRepository();
const pedidoService = new PedidoService(pedidoRepository);
const pedidoController = new PedidoController(pedidoService,authService, correoService);

// --- Webhook ---
const webhookService = new KlapWebhookService(pedidoService,productoService);
const klapWebhookController = new KlapWebhookController(webhookService,correoService);

// --- Klap Module ---
const klapService = new KlapService();
const klapController = new KlapController(klapService,pedidoService);

// --- Favorito Module ---
const favoritoRepository = new PrismaFavoritoRepository();
const favoritoService = new FavoritoService(favoritoRepository);
const favoritoController = new FavoritoController(favoritoService);

// --- Carrito Module ---
const carritoRepository = new PrismaCarritoRepository();
const carritoService = new CarritoService(carritoRepository);
const carritoController = new CarritoController(carritoService);

// --- Direccion Module Instances ---
const direccionRepository = new PrismaDireccionRepository();
const direccionService = new DireccionService(direccionRepository);
const direccionController = new DireccionController(direccionService);

// --- Starken Module Instances ---
const starkenService = new StarkenService();
const starkenController = new StarkenController(starkenService);

// --- Envio Module Instances ---
const envioRepository = new PrismaEnvioRepository();
const envioService = new EnvioService(envioRepository);
const envioController = new EnvioController(envioService);

// --- Starken Webhook Instances ---
const starkenWebhookService = new StarkenWebhookService(envioService);
const starkenWebhookController = new StarkenWebhookController(starkenWebhookService);

export { 
    authController, 
    categoriaController,
    productoController,
    pedidoController,
    favoritoController,
    carritoController,
    klapController,
    klapWebhookController,
    direccionController,
    starkenController,
    starkenWebhookController,
    envioController
};