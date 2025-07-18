#!/bin/bash
set -e

echo "🚀 Building iOS app for App Store using EAS Build..."
eas build -p ios --profile production

echo "✅ iOS build complete!"
echo "➡️  Download your .ipa file from the EAS build output above."
echo "➡️  Upload the file to App Store Connect: https://appstoreconnect.apple.com/"