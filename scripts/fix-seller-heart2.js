const fs = require('fs');

const file1 = 'app/seller/page.tsx';
let code1 = fs.readFileSync(file1, 'utf-8');
code1 = code1.replace('Heart,', 'MessageCircle,');
code1 = code1.replace(/<Heart /g, '<MessageCircle ');
fs.writeFileSync(file1, code1);

const file2 = 'app/seller/products/page.tsx';
let code2 = fs.readFileSync(file2, 'utf-8');
code2 = code2.replace('Heart,', 'MessageCircle,');
code2 = code2.replace(/<Heart /g, '<MessageCircle ');
fs.writeFileSync(file2, code2);

const file3 = 'app/buyer/page.tsx';
if (fs.existsSync(file3)) {
  let code3 = fs.readFileSync(file3, 'utf-8');
  code3 = code3.replace('Heart,', 'MessageCircle,');
  code3 = code3.replace(/<Heart /g, '<MessageCircle ');
  fs.writeFileSync(file3, code3);
}

const file4 = 'app/buyer/layout.tsx';
if (fs.existsSync(file4)) {
  let code4 = fs.readFileSync(file4, 'utf-8');
  code4 = code4.replace('Heart,', 'MessageCircle,');
  code4 = code4.replace(/<Heart /g, '<MessageCircle ');
  fs.writeFileSync(file4, code4);
}

const file5 = 'app/(main)/page.tsx';
if (fs.existsSync(file5)) {
  let code5 = fs.readFileSync(file5, 'utf-8');
  code5 = code5.replace('Heart,', 'MessageCircle,');
  code5 = code5.replace(/<Heart /g, '<MessageCircle ');
  code5 = code5.replace(/icon: Heart/g, 'icon: MessageCircle');
  fs.writeFileSync(file5, code5);
}

const file6 = 'app/(main)/benefits/buyer/page.tsx';
if (fs.existsSync(file6)) {
  let code6 = fs.readFileSync(file6, 'utf-8');
  code6 = code6.replace('Heart,', 'MessageCircle,');
  code6 = code6.replace(/icon: Heart/g, 'icon: MessageCircle');
  fs.writeFileSync(file6, code6);
}

const file7 = 'app/(main)/product/[id]/page.tsx';
if (fs.existsSync(file7)) {
  let code7 = fs.readFileSync(file7, 'utf-8');
  code7 = code7.replace('Heart,', 'MessageCircle,');
  fs.writeFileSync(file7, code7);
}

console.log('Fixed hearts everywhere');
