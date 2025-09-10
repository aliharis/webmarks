#!/bin/bash

# Create simple placeholder PNG files for the extension icons
# These are base64-encoded 1x1 pixel transparent PNGs

echo "Creating placeholder PNG icons..."

# Base64 of a minimal PNG (1x1 transparent pixel)
BASE64_PNG="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

# Create the PNG files
echo $BASE64_PNG | base64 -d > public/icons/icon16.png
echo $BASE64_PNG | base64 -d > public/icons/icon48.png  
echo $BASE64_PNG | base64 -d > public/icons/icon128.png

echo "Placeholder icons created!"