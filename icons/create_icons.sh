#!/bin/bash
# Create placeholder icons using ImageMagick (if available) or simple colored squares

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "Creating icons with ImageMagick..."
    
    # Create 16x16 icon
    convert -size 16x16 xc:"#667eea" -gravity center -pointsize 10 -fill white -annotate +0+0 "🔍" icon16.png
    
    # Create 48x48 icon
    convert -size 48x48 xc:"#667eea" -gravity center -pointsize 32 -fill white -annotate +0+0 "🔍" icon48.png
    
    # Create 128x128 icon
    convert -size 128x128 xc:"#667eea" -gravity center -pointsize 96 -fill white -annotate +0+0 "🔍" icon128.png
    
    echo "Icons created successfully!"
else
    echo "ImageMagick not found. Please create icons manually or install ImageMagick."
    echo "For now, creating simple placeholder files..."
    
    # Create simple placeholder PNGs
    echo "Placeholder icons needed - see README.md" > placeholder.txt
fi
