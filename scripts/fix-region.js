const fs = require('fs');
let code = fs.readFileSync('app/(main)/region/[slug]/page.tsx', 'utf-8');

code = code.replace(/category\\.subcategories/g, 'categories');
code = code.replace(/categoryIdId/g, 'categoryId'); // bad replace fix

// Wait, the sidebar has a Region dropdown. Let's remove the Region dropdown from the Region page, or just keep it and sync it to navigation?
// We will just keep it but change the selected region. Wait, it doesn't matter too much, the user is already on the region page!

fs.writeFileSync('app/(main)/region/[slug]/page.tsx', code);
console.log('rewritten 2.0');
