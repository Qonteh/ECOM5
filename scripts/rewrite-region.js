const fs = require('fs');
let code = fs.readFileSync('app/(main)/category/[slug]/page.tsx', 'utf-8');

code = code.replace(/CategoryPage/g, 'RegionPage');
code = code.replace(/const category = categories.find\(\(c\) => c.slug === slug\);/g, 
  "const regionSlugMatch = regions.find((r) => r.toLowerCase().replace(/\\s+/g, '-') === slug);\n  const region = regionSlugMatch || decodeURIComponent(slug).replace(/-/g, ' ');");

code = code.replace(/if \(!category\) \{/g, 'if (!region) {');
code = code.replace(/\[category\]\);/g, '[region]);');

code = code.replace(
  /fetch\(`\/api\/products\?category=\$\{category\.id\}&limit=100`\)/g,
  'fetch(`/api/products?region=${encodeURIComponent(region)}&limit=100`)'
);

code = code.replace(/Category Not Found/g, 'Region Not Found');
code = code.replace(/The category you are looking for does not exist./g, 'The region you are looking for does not exist.');

code = code.replace(/category\.name/g, 'region');
code = code.replace(/\{category\.description\}/g, '{`Explore products from ${region}`}');
code = code.replace(/Category Header/g, 'Region Header');

code = code.replace(/const Icon = iconMap\[category\.icon\] \|\| Smartphone;/g, 'const Icon = MapPin;');

// Let's change subcategory to category filter for the region page.
code = code.replace(/subcategory/g, 'categoryId');
code = code.replace(/subcategoryId/g, 'categoryId');
code = code.replace(/Subcategory quick links/g, 'Category quick links');
code = code.replace(/category\.categories/g, 'categories'); 
// oops, earlier replace changed category.subcategories to region.subcategories! wait no.
// Let's just fix the map
code = code.replace(/region\.categoryIdes/g, 'categories');
code = code.replace(/region\.subcategories/g, 'categories');

fs.writeFileSync('app/(main)/region/[slug]/page.tsx', code);
console.log('rewritten');