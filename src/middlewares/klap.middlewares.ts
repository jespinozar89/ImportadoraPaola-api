import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { klapConfig } from "../config/klap";

export function validateApikey(req: Request, res: Response, next: NextFunction) {
  const headerApikey = req.header("Apikey");
  const order = req.body;

  const ecommerceReferenceId = order.reference_id;
  const klapOrderId = order.order_id;
  const apikey = klapConfig.apiKey;

  const key = ecommerceReferenceId + klapOrderId + apikey;
  const hashApiKey = crypto.createHash("sha256").update(key).digest("hex");

  if (hashApiKey !== headerApikey) {
    return res.status(403).json({ error: "Error en autenticación" });
  }

  next();
}
