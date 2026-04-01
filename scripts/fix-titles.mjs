const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

const fixes = [
    { id: 11, title: "Route through Arag\u00f3n's most beautiful villages" },
    { id: 13, title: "The Aljafer\u00eda and Zaragoza's Mud\u00e9jar legacy" },
    { id: 15, title: "Aragonese gastronomy: from ternasco to chir\u00f3n" },
    { id: 17, title: "Albarrac\u00edn, a journey to the Middle Ages" },
    { id: 18, title: "Festivals and traditions in Arag\u00f3n" },
];

async function main() {
    for (const fix of fixes) {
        const res = await fetch(`${DIRECTUS_URL}/items/posts/${fix.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ title: fix.title }),
        });
        if (res.ok) {
            const data = await res.json();
            console.log(`Fixed ${fix.id}: ${data.data.title}`);
        } else {
            console.error(`Error fixing ${fix.id}: ${res.status}`);
        }
    }

    // Also check content for broken chars
    const postsRes = await fetch(`${DIRECTUS_URL}/items/posts?fields=id,title,content&filter[language][_eq]=en&sort=id`, { headers });
    const posts = await postsRes.json();
    for (const post of posts.data) {
        if (post.content && post.content.includes('\ufffd')) {
            const fixed = post.content.replace(/\ufffd/g, '');
            await fetch(`${DIRECTUS_URL}/items/posts/${post.id}`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ content: fixed }),
            });
            console.log(`Fixed content for post ${post.id}`);
        }
    }
    console.log('Done');
}
main();
