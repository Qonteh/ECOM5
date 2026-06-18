const fs = require('fs');
let code = fs.readFileSync('app/auth/login/page.tsx', 'utf-8');
code = code.replace(/\/\/ Demo login for testing[\s\S]*?router\.push\(`\/\$\{role\}`\);\n  };/, '');
fs.writeFileSync('app/auth/login/page.tsx', code);
console.log("done2")
