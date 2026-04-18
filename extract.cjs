const Jimp = require('jimp');

async function processImage() {
  const image = await Jimp.read('public/logo1.jpg');
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  image.scan(0, 0, width, height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // The crystal is roughly in the top middle.
    // Let's create a bounding box.
    const isInsideBox = (x > width * 0.25 && x < width * 0.75 && y > height * 0.15 && y < height * 0.65);
    
    let isCrystal = false;
    
    if (isInsideBox) {
      const maxOther = Math.max(r, b);
      
      // If it's strongly green
      if (g > maxOther + 20) {
        isCrystal = true;
      }
      // If it's a dark color (the inner lines of the crystal)
      else if (r < 50 && g < 70 && b < 50) {
        isCrystal = true;
      }
    }
    
    if (!isCrystal) {
      this.bitmap.data[idx + 3] = 0;
    } else {
      // Soften the boundary if it's kinda dark background pretending to be crystal
      if (r < 20 && b < 20 && g < 40) {
        // Maybe border
        this.bitmap.data[idx + 3] = 180;
      }
    }
  });

  // Auto crop the transparent background
  image.autocrop();

  await image.writeAsync('public/crystal-icon.png');
  console.log("Image processed successfully!");
}

processImage().catch(console.error);
