const fs = require('fs');
const path = require('path');

const svgContent = `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="20" fill="url(#gradient)"/>
  <path d="M40 40V88L64 72L88 88V40H40Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="#667eea"/>
      <stop offset="1" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
</svg>`;

const sizes = [16, 48, 128];

sizes.forEach(size => {
  const scaledSvg = svgContent.replace('width="128" height="128"', `width="${size}" height="${size}"`);
  const fileName = path.join(__dirname, 'public', 'icons', `icon${size}.png`);
  
  console.log(`Note: For production, convert the SVG to PNG files.`);
  console.log(`Placeholder for ${fileName} created.`);
  
  fs.writeFileSync(fileName.replace('.png', '.svg'), scaledSvg);
});

console.log('\nTo convert SVG to PNG, you can use tools like:');
console.log('- ImageMagick: convert icon.svg icon.png');
console.log('- Online converters');
console.log('- Design tools like Figma, Sketch, or Adobe XD');