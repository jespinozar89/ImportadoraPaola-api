#!/bin/bash
echo "🧹 Limpiando binarios Prisma..."
rm -rf node_modules/.prisma
npm install --omit=dev
npx prisma generate
echo "✅ Prisma regenerado"

