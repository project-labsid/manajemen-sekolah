import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const imgBuf = fs.readFileSync('/home/z/my-project/upload/pasted_image_1784988561279.jpg');
  const b64 = imgBuf.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${b64}`;

  const zai = await ZAI.create();
  console.log('Sending to image edit API...');

  const response = await zai.images.generations.edit({
    prompt: 'Remove the background completely, make it fully transparent PNG with alpha channel, keep only the main logo emblem subject with crisp clean edges. Output as PNG with transparent background.',
    images: [{ url: dataUrl }],
    size: '1024x1024',
  });

  const resultB64 = response.data[0].base64;
  const buffer = Buffer.from(resultB64, 'base64');
 
  // Save as logo-no-bg.png (transparent version)
  fs.writeFileSync('/home/z/my-project/public/logo-no-bg.png', buffer);
  console.log('Saved logo-no-bg.png, size:', buffer.length);

  // Also copy as logo-tuweri.png (for backward compat)
  fs.copyFileSync('/home/z/my-project/public/logo-no-bg.png', '/home/z/my-project/public/logo-tuweri.png');
  console.log('Copied to logo-tuweri.png');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
