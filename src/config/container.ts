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

// --- Auth Module Instances ---
const usuarioRepository = new PrismaUsuarioRepository();
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

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
const pedidoController = new PedidoController(pedidoService);

// --- Favorito Module ---
const favoritoRepository = new PrismaFavoritoRepository();
const favoritoService = new FavoritoService(favoritoRepository);
const favoritoController = new FavoritoController(favoritoService);

// --- Carrito Module ---
const carritoRepository = new PrismaCarritoRepository();
const carritoService = new CarritoService(carritoRepository);
const carritoController = new CarritoController(carritoService);

export { 
    authController, 
    categoriaController,
    productoController,
    pedidoController,
    favoritoController,
    carritoController
};