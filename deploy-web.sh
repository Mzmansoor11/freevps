#!/bin/bash
set -e

echo "🌐 Building web version of the app..."
npx expo export:web

echo "✅ Web build complete!"
echo "➡️  Deploy the contents of the 'web-build/' directory to your preferred static host (e.g., Vercel, Netlify, GitHub Pages)."