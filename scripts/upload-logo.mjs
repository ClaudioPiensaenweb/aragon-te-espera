import { readFileSync } from 'node:fs';

const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';

async function main() {
    // Upload logo
    console.log('Uploading logo...');
    const logoBuffer = readFileSync('/usr/share/nginx/html/marca/aragon-te-espera-logo.png');
    const blob = new Blob([logoBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('title', 'Logotipo Aragón te espera');
    formData.append('file', blob, 'aragon-te-espera-logo.png');

    const res = await fetch(`${DIRECTUS_URL}/files`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${TOKEN}` },
        body: formData,
    });

    if (!res.ok) {
        console.error('Upload failed:', await res.text());
        return;
    }

    const data = await res.json();
    const logoId = data.data.id;
    console.log('Logo uploaded:', logoId);

    // Set in empresa
    await fetch(`${DIRECTUS_URL}/items/empresa`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ logotipo: logoId }),
    });
    console.log('Logo set in empresa');
}

main().catch(console.error);
