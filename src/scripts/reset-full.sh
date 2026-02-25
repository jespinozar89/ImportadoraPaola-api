#!/bin/bash

echo "🧹 Eliminando node_modules y package-lock.json..."
pkill -u $USER node
rm -rf node_modules
rm -f package-lock.json

echo "🗑️ Limpiando cache de npm..."
npm cache clean --force

echo "📦 Reinstalando dependencias..."
npm install

echo "⚙️ Regenerando cliente Prisma..."
npx prisma generate

echo "✅ Reset completo. Dependencias y cliente Prisma regenerados."
pkill -u $USER node

