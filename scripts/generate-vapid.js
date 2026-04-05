const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

async function generate() {
  const keys = webpush.generateVAPIDKeys();
  const envPath = path.join(__dirname, '..', '.env.local');
  
  let content = fs.readFileSync(envPath, 'utf8');
  
  if (!content.includes('NEXT_PUBLIC_VAPID_PUBLIC_KEY')) {
    content += `\nNEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`;
    content += `\nVAPID_PRIVATE_KEY=${keys.privateKey}\n`;
  } else {
    content = content.replace(/NEXT_PUBLIC_VAPID_PUBLIC_KEY=.*/, `NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
    content = content.replace(/VAPID_PRIVATE_KEY=.*/, `VAPID_PRIVATE_KEY=${keys.privateKey}`);
  }
  
  fs.writeFileSync(envPath, content);
  console.log('✅ VAPID keys generated and added to .env.local');
  console.log('PUBLIC KEY:', keys.publicKey);
}

generate();
