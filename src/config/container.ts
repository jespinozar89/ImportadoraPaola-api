// Módulo de Autenticación
import { PrismaUsuarioRepository } from "../repositories/usuario.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

// Módulo de Categoría
import { PrismaCategoriaRepository } from "../repositories/categoria.repository";
import { CategoriaService } from "../services/categoria.service";
import { CategoriaController } from "../controllers/categoria.controller";

// --- Auth Module Instances ---
const usuarioRepository = new PrismaUsuarioRepository();
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

// --- Categoria Module Instances ---
const categoriaRepository = new PrismaCategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

export { authController, categoriaController };