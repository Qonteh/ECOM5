const fs = require('fs');

const file1 = 'app/seller/page.tsx';
let code1 = fs.readFileSync(file1, 'utf-8');
code1 = code1.replace(/import \{([^}]*)Heart([^}]*)\} from 'lucide-react';/, "import {$1MessageCircle$2} from 'lucide-react';");
code1 = code1.replace(/<Heart /g, '<MessageCircle ');
// If any other reference to Heart, like in an array, replace it. But it's an imported component.
fs.writeFileSync(file1, code1);

const file2 = 'app/seller/products/page.tsx';
let code2 = fs.readFileSync(file2, 'utf-8');
code2 = code2.replace(/import \{([^}]*)Heart([^}]*)\} from 'lucide-react';/, "import {$1MessageCircle$2} from 'lucide-react';");
code2 = code2.replace(/<Heart /g, '<MessageCircle ');
fs.writeFileSync(file2, code2);

console.log('Fixed seller pages');
