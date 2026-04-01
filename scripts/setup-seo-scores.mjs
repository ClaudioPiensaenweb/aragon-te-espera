const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function deleteField(name) {
    await fetch(`${DIRECTUS_URL}/fields/seo/${name}`, { method: 'DELETE', headers });
}

async function createField(field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/seo`, { method: 'POST', headers, body: JSON.stringify(field) });
    const t = await res.text();
    console.log(res.ok ? `  Created: ${field.field}` : (t.includes('already') ? `  Exists: ${field.field}` : `  Error: ${t}`));
}

async function updateField(name, data) {
    const res = await fetch(`${DIRECTUS_URL}/fields/seo/${name}`, { method: 'PATCH', headers, body: JSON.stringify(data) });
    console.log(res.ok ? `  Updated: ${name}` : `  Error: ${name}`);
}

function analyzeSeo(item) {
    const checks = [];
    const keyword = (item.keyword || '').toLowerCase().trim();
    const metaTitle = item.meta_title || '';
    const metaDesc = item.meta_description || '';
    const pageTitle = item.page_title || '';
    const slug = item.slug || '';

    // 1. Meta title length (30-60 chars)
    if (!metaTitle) {
        checks.push({ status: 'bad', text: 'Meta título vacío' });
    } else if (metaTitle.length < 30) {
        checks.push({ status: 'bad', text: `Meta título muy corto (${metaTitle.length}/60 caracteres)` });
    } else if (metaTitle.length > 60) {
        checks.push({ status: 'warn', text: `Meta título muy largo (${metaTitle.length}/60 caracteres)` });
    } else {
        checks.push({ status: 'good', text: `Meta título correcto (${metaTitle.length}/60 caracteres)` });
    }

    // 2. Meta description length (120-160 chars)
    if (!metaDesc) {
        checks.push({ status: 'bad', text: 'Meta descripción vacía' });
    } else if (metaDesc.length < 120) {
        checks.push({ status: 'warn', text: `Meta descripción corta (${metaDesc.length}/160 caracteres)` });
    } else if (metaDesc.length > 160) {
        checks.push({ status: 'warn', text: `Meta descripción larga (${metaDesc.length}/160 caracteres)` });
    } else {
        checks.push({ status: 'good', text: `Meta descripción correcta (${metaDesc.length}/160 caracteres)` });
    }

    // 3. Keyword present
    if (!keyword) {
        checks.push({ status: 'warn', text: 'No se ha definido palabra clave' });
    } else {
        checks.push({ status: 'good', text: `Palabra clave definida: "${keyword}"` });

        // 4. Keyword in meta title
        if (metaTitle.toLowerCase().includes(keyword)) {
            checks.push({ status: 'good', text: 'Palabra clave en meta título' });
        } else {
            checks.push({ status: 'bad', text: 'Palabra clave NO está en el meta título' });
        }

        // 5. Keyword in meta description
        if (metaDesc.toLowerCase().includes(keyword)) {
            checks.push({ status: 'good', text: 'Palabra clave en meta descripción' });
        } else {
            checks.push({ status: 'warn', text: 'Palabra clave NO está en la meta descripción' });
        }

        // 6. Keyword in slug
        const keywordSlug = keyword.replace(/\s+/g, '-').toLowerCase();
        if (slug.toLowerCase().includes(keywordSlug) || slug.toLowerCase().includes(keyword.replace(/\s+/g, ''))) {
            checks.push({ status: 'good', text: 'Palabra clave en la URL' });
        } else {
            checks.push({ status: 'warn', text: 'Palabra clave NO está en la URL' });
        }

        // 7. Keyword in page title
        if (pageTitle.toLowerCase().includes(keyword)) {
            checks.push({ status: 'good', text: 'Palabra clave en el título de la página' });
        } else {
            checks.push({ status: 'warn', text: 'Palabra clave NO está en el título de la página' });
        }
    }

    // 8. Slug check
    if (!slug) {
        checks.push({ status: 'bad', text: 'Slug/URL vacío' });
    } else {
        checks.push({ status: 'good', text: 'URL definida' });
    }

    // Calculate score
    const good = checks.filter(c => c.status === 'good').length;
    const total = checks.length;
    const score = Math.round((good / total) * 100);

    let scoreLabel, scoreColor;
    if (score >= 80) { scoreLabel = 'Bueno'; scoreColor = '#11b76b'; }
    else if (score >= 50) { scoreLabel = 'Mejorable'; scoreColor = '#ffa100'; }
    else { scoreLabel = 'Deficiente'; scoreColor = '#fa4362'; }

    // Build result text
    let resultText = `${scoreLabel} (${score}/100)\n`;
    checks.forEach(c => {
        const icon = c.status === 'good' ? '✓' : (c.status === 'warn' ? '⚠' : '✗');
        resultText += `${icon} ${c.text}\n`;
    });

    return { score, scoreLabel, scoreColor, resultText };
}

async function main() {
    // 1. Remove old seo_score presentation field
    console.log('Updating SEO fields...');
    await deleteField('seo_score');

    // 2. Add real score fields
    await createField({
        field: 'seo_score',
        type: 'integer',
        meta: {
            interface: 'input',
            width: 'half',
            sort: 8,
            readonly: true,
            note: 'Puntuación (0-100)',
            translations: [{ language: 'es-ES', translation: 'Puntuación' }],
            display: 'labels',
            display_options: {
                showAsDot: false,
                choices: [
                    { text: 'Deficiente', value: null, foreground: '#fff', background: '#fa4362', conditions: { seo_score: { _lt: 50 } } },
                    { text: 'Mejorable', value: null, foreground: '#fff', background: '#ffa100', conditions: { seo_score: { _gte: 50, _lt: 80 } } },
                    { text: 'Bueno', value: null, foreground: '#fff', background: '#11b76b', conditions: { seo_score: { _gte: 80 } } },
                ]
            }
        },
        schema: { default_value: 0 }
    });

    await createField({
        field: 'seo_analysis',
        type: 'text',
        meta: {
            interface: 'input-multiline',
            width: 'full',
            sort: 9,
            readonly: true,
            note: 'Análisis SEO automático (se actualiza al guardar)',
            translations: [{ language: 'es-ES', translation: 'Análisis SEO' }],
            options: { rows: 8 }
        },
        schema: {}
    });

    // 3. Calculate scores for all existing entries
    console.log('Calculating SEO scores...');
    const res = await fetch(`${DIRECTUS_URL}/items/seo?fields=*&sort=id&limit=100`, { headers });
    const data = await res.json();

    for (const item of data.data) {
        const analysis = analyzeSeo(item);
        await fetch(`${DIRECTUS_URL}/items/seo/${item.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({
                seo_score: analysis.score,
                seo_analysis: analysis.resultText
            })
        });
        console.log(`  ${item.page_title}: ${analysis.score}/100 (${analysis.scoreLabel})`);
    }

    // 4. Create a Directus Flow to auto-calculate on save
    console.log('Creating auto-calculation flow...');

    // Check if flow already exists
    const flowsRes = await fetch(`${DIRECTUS_URL}/flows?filter[name][_eq]=SEO Score Calculator`, { headers });
    const flowsData = await flowsRes.json();

    if (flowsData.data.length === 0) {
        // Create the flow
        const flowRes = await fetch(`${DIRECTUS_URL}/flows`, {
            method: 'POST', headers,
            body: JSON.stringify({
                name: 'SEO Score Calculator',
                icon: 'search',
                color: '#FF6800',
                status: 'active',
                trigger: 'event',
                accountability: 'all',
                options: {
                    type: 'filter',
                    scope: ['items.update'],
                    collections: ['seo']
                }
            })
        });
        const flow = await flowRes.json();
        const flowId = flow.data.id;
        console.log(`  Flow created: ${flowId}`);

        // Create operation: run script to calculate score
        await fetch(`${DIRECTUS_URL}/operations`, {
            method: 'POST', headers,
            body: JSON.stringify({
                flow: flowId,
                name: 'Calculate SEO Score',
                key: 'calc_seo',
                type: 'exec',
                position_x: 20,
                position_y: 1,
                options: {
                    code: `
module.exports = async function(data) {
    const item = data.$trigger.payload;
    if (!item.meta_title && !item.keyword && !item.meta_description) return data;

    const keyword = (item.keyword || '').toLowerCase().trim();
    const metaTitle = item.meta_title || '';
    const metaDesc = item.meta_description || '';
    const pageTitle = item.page_title || '';
    const slug = item.slug || '';
    const checks = [];

    if (!metaTitle) checks.push({s:'bad',t:'Meta título vacío'});
    else if (metaTitle.length<30) checks.push({s:'bad',t:'Meta título muy corto ('+metaTitle.length+'/60)'});
    else if (metaTitle.length>60) checks.push({s:'warn',t:'Meta título muy largo ('+metaTitle.length+'/60)'});
    else checks.push({s:'good',t:'Meta título correcto ('+metaTitle.length+'/60)'});

    if (!metaDesc) checks.push({s:'bad',t:'Meta descripción vacía'});
    else if (metaDesc.length<120) checks.push({s:'warn',t:'Meta descripción corta ('+metaDesc.length+'/160)'});
    else if (metaDesc.length>160) checks.push({s:'warn',t:'Meta descripción larga ('+metaDesc.length+'/160)'});
    else checks.push({s:'good',t:'Meta descripción correcta ('+metaDesc.length+'/160)'});

    if (!keyword) checks.push({s:'warn',t:'Sin palabra clave'});
    else {
        checks.push({s:'good',t:'Palabra clave: "'+keyword+'"'});
        checks.push(metaTitle.toLowerCase().includes(keyword)?{s:'good',t:'Keyword en meta título'}:{s:'bad',t:'Keyword NO en meta título'});
        checks.push(metaDesc.toLowerCase().includes(keyword)?{s:'good',t:'Keyword en meta descripción'}:{s:'warn',t:'Keyword NO en meta descripción'});
        checks.push(slug.toLowerCase().includes(keyword.replace(/\\s+/g,'-'))?{s:'good',t:'Keyword en URL'}:{s:'warn',t:'Keyword NO en URL'});
        checks.push(pageTitle.toLowerCase().includes(keyword)?{s:'good',t:'Keyword en título'}:{s:'warn',t:'Keyword NO en título'});
    }

    if (!slug) checks.push({s:'bad',t:'URL vacía'});
    else checks.push({s:'good',t:'URL definida'});

    const good = checks.filter(c=>c.s==='good').length;
    const score = Math.round((good/checks.length)*100);
    const label = score>=80?'Bueno':score>=50?'Mejorable':'Deficiente';
    const icons = {good:'✓',warn:'⚠',bad:'✗'};
    const text = label+' ('+score+'/100)\\n'+checks.map(c=>icons[c.s]+' '+c.t).join('\\n');

    data.$trigger.payload.seo_score = score;
    data.$trigger.payload.seo_analysis = text;
    return data;
}
`
                }
            })
        });
        console.log('  Operation created');
    } else {
        console.log('  Flow already exists');
    }

    // 5. Update list view to show score
    console.log('Configuring list display...');
    await updateField('seo_score', {
        meta: {
            display: 'raw',
            display_options: null
        }
    });

    console.log('Done!');
}

main().catch(console.error);
