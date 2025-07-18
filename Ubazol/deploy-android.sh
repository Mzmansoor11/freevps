#!/bin/bash
set -e

echo "🚀 Building Android app for Play Store using EAS Build..."
eas build -p android --profile production

echo "✅ Android build complete!"
echo "➡️  Download your APK/AAB from the EAS build output above."
echo "➡️  Upload the file to the Google Play Console: https://play.google.com/console/"