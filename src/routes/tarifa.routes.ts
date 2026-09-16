import { Router } from 'express';
import { TarifaController } from '../controllers/tarifa.controller';


const router = Router();
const tarifaController = new TarifaController();

router.get('/', tarifaController.obtenerTodasLasTarifas);
router.post('/cotizar', tarifaController.cotizarEnvio);

export default router;