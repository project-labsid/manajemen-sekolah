import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const imgBuf = fs.readFileSync('/home/z/my-project/upload/IMG_20260725_195538_070.png');
  const b64 = imgBuf.toString('base64');
  const dataUrl = `data:image/png;base64,${b64}`;

  const zai = await ZAI.create();
  console.log('Sending to API...');

  const response = await zai.images.generations.edit({
    prompt: 'Remove the background completely, make it fully transparent, keep only the main logo emblem subject with crisp clean edges',
    images: [{ url: dataUrl }],
    size: '1024x1024',
  });

  const resultB64 = response.data[0].base64;
  const buffer = Buffer.from(resultB64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/logo-no-bg.png', buffer);
  console.log('Saved logo-no-bg.png, size:', buffer.length);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
