import axios from "axios";
import { klapConfig } from "../config/klap";
import { Item, User } from "@/dtos/klap.dto";

export class KlapService {

    async createOrder(referenceId: string, user: User, items: Item[], total: number) {
        try {
            const body = {
                reference_id: referenceId,
                user,
                amount: {
                    currency: "CLP",
                    total,
                    details: {
                        subtotal: total - 2000, // ejemplo
                        fee: 1000,
                        tax: 1000,
                    },
                },
                methods: ["tarjetas"],
                items,
                description: "Orden de prueba desde backend Node",
                customs: [
                    { key: "tarjetas_expiration_minutes", value: "30" },
                    { key: "notify_payment_merchant", value: "true" },
                    { key: "notify_payment_user", value: "true" },
                    { key: "notify_payment_email_merchant", value: "javier.espinoza1989@gmail.com" },
                ],
                webhooks: {
                    webhook_validation: "https://libreriapaola.cl/api/webhooks/validation",
                    webhook_confirm: "https://libreriapaola.cl/api/webhooks/confirm",
                    webhook_reject: "https://libreriapaola.cl/api/webhooks/reject",
                }
            };

            const response = await axios.post(`${klapConfig.apiUrl}/payment-gateway/v1/orders`, body, {
                headers: {
                    "Content-Type": "application/json",
                    apikey: klapConfig.apiKey,
                },
            });

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Error creando orden en Klap");
        }
    }

    async getOrderStatus(orderId: string) {
        try {
            const response = await axios.get(
                `${klapConfig.apiUrl}/payment-gateway/v1/orders/${orderId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        apikey: klapConfig.apiKey,
                    },
                }
            );

            return { status: response.data.status };
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Error consultando estado de la orden en Klap");
        }
    }

}
