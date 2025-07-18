#!/bin/bash
set -e

echo "🔑 Logging in to Expo (if not already logged in)..."
npx expo whoami || npx expo login

echo "🚀 Publishing the latest version to Expo..."
npx expo publish

echo "✅ Deployment complete! Your app is live on Expo."