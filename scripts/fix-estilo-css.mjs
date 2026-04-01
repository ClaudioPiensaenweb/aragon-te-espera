const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // In Directus 11, group-detail fields render a nested .v-form.grid
    // The grid by default is: grid-template-columns: [start] minmax(0,var(--v-form-column-max-width)) [half] minmax(0,var(--v-form-column-max-width)) [full]
    // We need to override this to 4 columns for the typography group
    // The group_typography field wraps its children in a .v-form.grid
    // Fields with class .half take grid-column: start / half (col 1) or half / full (col 2)
    // We need to change to 4 equal columns and make each .half span just 1

    const css = `
/* 4-column grid for typography group in Estilo */
[data-field="group_typography"] > .interface-group-detail > .v-form.grid {
  grid-template-columns: repeat(4, 1fr) !important;
}
[data-field="group_typography"] > .interface-group-detail > .v-form.grid > .field.half {
  grid-column: span 1 !important;
}
/* Dividers span full 4 columns */
[data-field="group_typography"] > .interface-group-detail > .v-form.grid > .field.full {
  grid-column: 1 / -1 !important;
}
/* Font selectors span 2 columns */
[data-field="font_titles"],
[data-field="font_body"] {
  grid-column: span 2 !important;
}
`;

    const res = await fetch(`${DIRECTUS_URL}/settings`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ custom_css: css }),
    });

    if (res.ok) console.log('Custom CSS injected successfully');
    else console.error('Error:', await res.text());
}

main();
