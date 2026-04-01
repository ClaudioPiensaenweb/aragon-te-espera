const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function fieldExists(collection, field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, { headers });
    return res.ok;
}

async function addSeoField(collection, fieldName, sort) {
    if (await fieldExists(collection, fieldName)) {
        console.log(`  Field "${fieldName}" already exists on "${collection}", skipping.`);
        return;
    }
    const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
        method: 'POST', headers,
        body: JSON.stringify({
            field: fieldName,
            type: 'json',
            meta: {
                interface: 'seo-interface',
                display: 'seo-display',
                width: 'full',
                sort: sort,
                options: {
                    social_image: false,
                    focus_keyphrase: true,
                    sitemap_settings: true,
                    se_controls: true,
                    custom_fields: false,
                },
                display_options: {
                    search_preview: true,
                }
            },
            schema: { is_nullable: true }
        })
    });
    if (res.ok) {
        console.log(`  Field "${fieldName}" added to "${collection}"`);
    } else {
        const err = await res.text();
        console.error(`  Error adding field to "${collection}": ${err}`);
    }
}

async function migrateData() {
    console.log('Migrating existing SEO data to plugin JSON format...');
    const res = await fetch(`${DIRECTUS_URL}/items/seo?fields=*&limit=200`, { headers });
    const data = await res.json();
    const items = data.data || [];

    let migrated = 0;
    for (const item of items) {
        // Skip if already has seo_data
        if (item.seo_data && item.seo_data.title) continue;

        const seoJson = {
            title: item.meta_title || item.page_title || '',
            meta_description: item.meta_description || '',
            focus_keyphrase: item.keyword || '',
            no_index: item.indexable === false,
            no_follow: false,
            sitemap: {
                change_frequency: 'monthly',
                priority: item.page_type === 'page' ? '0.8' : '0.6'
            }
        };

        // Home pages get higher priority
        if (item.slug === '/' || item.slug === '/en') {
            seoJson.sitemap.priority = '1.0';
            seoJson.sitemap.change_frequency = 'weekly';
        }

        await fetch(`${DIRECTUS_URL}/items/seo/${item.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ seo_data: seoJson })
        });
        migrated++;
    }
    console.log(`  Migrated ${migrated} entries`);
}

async function migratePostsData() {
    console.log('Migrating posts SEO data...');
    const res = await fetch(`${DIRECTUS_URL}/items/posts?fields=id,title,slug,seo&limit=200`, { headers });
    const data = await res.json();
    const posts = data.data || [];

    // Get SEO collection entries for posts to pull existing meta data
    const seoRes = await fetch(`${DIRECTUS_URL}/items/seo?fields=slug,meta_title,meta_description,keyword,indexable&filter[page_type][_eq]=post&limit=200`, { headers });
    const seoData = await seoRes.json();
    const seoMap = {};
    for (const s of (seoData.data || [])) {
        seoMap[s.slug] = s;
    }

    let migrated = 0;
    for (const post of posts) {
        // Skip if already has seo data
        if (post.seo && post.seo.title) continue;

        const prefix = post.slug ? (post.language === 'en' ? '/en/news/' : '/noticias/') : '';
        const fullSlug = prefix + post.slug;
        const existing = seoMap[fullSlug] || {};

        const seoJson = {
            title: existing.meta_title || post.title || '',
            meta_description: existing.meta_description || '',
            focus_keyphrase: existing.keyword || '',
            no_index: existing.indexable === false,
            no_follow: false,
            sitemap: {
                change_frequency: 'monthly',
                priority: '0.6'
            }
        };

        await fetch(`${DIRECTUS_URL}/items/posts/${post.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ seo: seoJson })
        });
        migrated++;
    }
    console.log(`  Migrated ${migrated} posts`);
}

async function hideOldFields() {
    console.log('Hiding old SEO fields (replaced by plugin)...');
    const oldFields = ['meta_title', 'meta_description', 'keyword', 'seo_score', 'seo_analysis', 'indexable', 'seo_dashboard_link'];
    for (const field of oldFields) {
        if (await fieldExists('seo', field)) {
            await fetch(`${DIRECTUS_URL}/fields/seo/${field}`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ meta: { hidden: true } })
            });
            console.log(`  Hidden: ${field}`);
        }
    }
}

async function setPublicPermissions() {
    console.log('Ensuring public read on seo_data and posts.seo...');
    // The existing public read on seo collection with fields=* should cover seo_data
    // Just verify it exists
    const policiesRes = await fetch(`${DIRECTUS_URL}/policies`, { headers });
    const policiesData = await policiesRes.json();
    const publicPolicy = policiesData.data.find(p => p.icon === 'public');
    if (!publicPolicy) { console.log('  No public policy found'); return; }

    // Check posts read permission includes seo field
    const permRes = await fetch(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=posts&filter[policy][_eq]=${publicPolicy.id}&filter[action][_eq]=read`, { headers });
    const permData = await permRes.json();
    if (permData.data && permData.data[0]) {
        await fetch(`${DIRECTUS_URL}/permissions/${permData.data[0].id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ fields: ['*'] })
        });
        console.log('  Posts read permission updated to include seo field');
    }
}

async function main() {
    // 1. Add seo_data field to seo collection (for static pages)
    console.log('Adding SEO plugin field to seo collection...');
    await addSeoField('seo', 'seo_data', 10);

    // 2. Add seo field to posts collection (for blog posts)
    console.log('Adding SEO plugin field to posts collection...');
    await addSeoField('posts', 'seo', 10);

    // 3. Migrate existing data
    await migrateData();
    await migratePostsData();

    // 4. Hide old fields
    await hideOldFields();

    // 5. Permissions
    await setPublicPermissions();

    console.log('Done! SEO plugin integrated.');
}

main().catch(console.error);
