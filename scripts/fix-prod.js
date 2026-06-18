const fs = require('fs');

const path = 'app/(main)/product/[id]/page.tsx';
let code = fs.readFileSync(path, 'utf-8');

if (!code.includes('useRouter')) {
  code = code.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect } from "react";\nimport { useRouter } from "next/navigation";'
  );
  
  code = code.replace(
    /export default function ProductDetail\(\{[\s\S]*?\}\) \{/,
    (match) => `${match}\n  const router = useRouter();`
  );
}

code = code.replace(/openChat\(\);/g, 'router.push("/messages");');

fs.writeFileSync(path, code);
console.log('Fixed product/[id]/page.tsx');
