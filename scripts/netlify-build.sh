#!/bin/bash

# Netlify build script to handle esbuild platform-specific dependencies

echo "🔧 Installing platform-specific esbuild dependencies..."

# Force install the linux-x64 esbuild binary for Netlify's build environment
npm install @esbuild/linux-x64@^0.24.2 --no-save --force

echo "📦 Installing all dependencies including dev dependencies..."
npm install --include=optional --include=dev --production=false

echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
