const fs = require('fs');

const path = 'app/(main)/product/[id]/page.tsx';
let code = fs.readFileSync(path, 'utf-8');

code = code.replace(/import \{([^}]*)Heart([^}]*)\} from 'lucide-react';/, "import {$1MessageCircle$2} from 'lucide-react';");

code = code.replace(/onClick=\{handleWishlistToggle\}/g, 'onClick={handleStartChat}');

code = code.replace(
  /<Heart[\s\S]*?className=\{cn\("w-5 h-5", isWishlisted && "fill-current"\)\}[\s\S]*?\/>/m,
  '<MessageCircle className="w-5 h-5" />'
);

code = code.replace(/isWishlisted && "text-destructive",/g, '');

code = code.replace(/<Heart /g, '<MessageCircle ');

code = code.replace(/saved/g, 'chats');
code = code.replace(/favorites/g, 'favorites');

fs.writeFileSync(path, code);
