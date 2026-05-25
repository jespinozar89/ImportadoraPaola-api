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
                        subtotal: total,
                        fee: 0,
                        tax: 0,
                    },
                },
                methods: ["tarjetas",],
                items,
                description: "Compra en Librería Paola",
                customs: [
                    { key: "tarjetas_expiration_minutes", value: "30" },
                    { key: "notify_payment_merchant", value: "true" },
                    { key: "notify_payment_user", value: "true" },
                    { key: "notify_payment_email_merchant", value: "javier.espinoza1989@gmail.com" },
                ],
                // webhooks: {
                //     webhook_validation: "https://sunbeamed-unambiguously-shela.ngrok-free.dev/api/webhooks/validation",
                //     webhook_confirm: "https://sunbeamed-unambiguously-shela.ngrok-free.dev/api/webhooks/confirm",
                //     webhook_reject: "https://sunbeamed-unambiguously-shela.ngrok-free.dev/api/webhooks/reject"
                // },
                webhooks: {
                    webhook_validation: "https://libreriapaola.cl/api/webhooks/validation",
                    webhook_confirm: "https://libreriapaola.cl/api/webhooks/confirm",
                    webhook_reject: "https://libreriapaola.cl/api/webhooks/reject",
                },
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

            return {
                status: response.data.status,
                order_id: response.data.order_id,
                reference_id: response.data.reference_id,
                total: response.data.amount.total,
            };
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Error consultando estado de la orden en Klap");
        }
    }

    async refundOrder(orderId: string, referenceId: string, amount: number) {
        try {
            const body = {
                reference_id: referenceId,
                amount,
            };

            const response = await axios.post(
                `${klapConfig.apiUrl}/payment-gateway/v1/orders/${orderId}/refund`,
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        apikey: klapConfig.apiKey,
                    },
                    timeout: 10000
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Error realizando reembolso en Klap");
        }
    }

}
