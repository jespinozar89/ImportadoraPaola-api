import { DetallePedidoDTO } from "@/dtos/pedido.dto";
import { PedidoService } from "./pedido.service";
import { ProductoService } from "./producto.service";
import { Pedido } from "@prisma/client";

export class WebhookService {

    constructor(
        private pedidoService: PedidoService,
        private productoService: ProductoService
    ) { }

    async validateStock(items: Array<{ code: string; quantity: number }>): Promise<boolean> {
        for (const item of items) {
            const productoId = Number(item.code);

            if (isNaN(productoId)) return false;

            const producto = await this.productoService.findById(productoId);

            if (!producto || producto.stock < item.quantity) {
                return false;
            }
        }
        return true;
    }

    async confirmOrderAndDeductStock(items: DetallePedidoDTO[]): Promise<void> {

        const payload = items.map(item => ({
            producto_id: Number(item.producto_id),
            cantidad: item.cantidad
        }));

        await this.productoService.deductStock(payload);
    }

    async findByKlapId(id: string) {
        return await this.pedidoService.findByKlapId(id);
    }

    async updateKlapOrderId(oldKlapOrderId: string, newKlapOrderId: string): Promise<any> {
       return await this.pedidoService.updateKlapOrderId(oldKlapOrderId, newKlapOrderId);
    }

}