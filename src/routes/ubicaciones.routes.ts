import { Router } from 'express';
import { UbicacionesController } from '../controllers/ubicaciones.controller';

const router = Router();
const controller = new UbicacionesController();

router.get('/', controller.obtenerTodo);
router.get('/regiones', controller.obtenerRegiones);
router.get('/regiones/:codigo/comunas', controller.obtenerComunasPorRegion);

export default router;