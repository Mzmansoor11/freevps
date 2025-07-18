#!/bin/bash
set -e

# Ensure dist build exists
if [ ! -d "dist" ]; then
  echo "❌ 'dist' directory not found. Please build the web version first."
  exit 1
fi

echo "🚀 Deploying to GitHub Pages..."

# Add gh-pages as a worktree
if [ ! -d "../gh-pages" ]; then
  git worktree add ../gh-pages gh-pages || git checkout --orphan gh-pages && git reset --hard && git commit --allow-empty -m "Initial gh-pages commit" && git push origin gh-pages && git worktree add ../gh-pages gh-pages
fi

# Copy files
echo "📦 Copying files to gh-pages branch..."
rm -rf ../gh-pages/*
cp -r dist/* ../gh-pages/

# Commit and push
cd ../gh-pages
git add .
git commit -m "Deploy web build to GitHub Pages" || echo "No changes to commit."
git push origin gh-pages
cd ../Ubazol

echo "✅ Deployed! Visit your GitHub Pages site after a few minutes."