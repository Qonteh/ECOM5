const fs = require('fs');

const path = 'components/layout/header.tsx';
let code = fs.readFileSync(path, 'utf-8');

code = code.replace(/<Heart /g, '<MessageCircle ');

code = code.replace(
  /\{wishlistItems > 0 && \([\s\S]*?\{wishlistItems\}[\s\S]*?\)\}/,
  `{unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}`
);

code = code.replace(
  /\{\/\* Wishlist \*\/\}/,
  '{/* Messages */}'
);

code = code.replace(
  /<Link href="\/wishlist">/,
  '<Link href="/messages">'
);

if (code.includes('import { Heart,')) {
  code = code.replace('import { Heart,', 'import { MessageCircle,');
} else {
  code = code.replace('Heart,', 'MessageCircle,');
}

fs.writeFileSync(path, code);
console.log('Fixed header.tsx');
