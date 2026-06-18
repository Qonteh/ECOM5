const fs = require('fs');
let code = fs.readFileSync('app/auth/login/page.tsx', 'utf-8');

// Replace state and add useEffect for stats
code = code.replace(
  'const [formData, setFormData] = useState({',
  `const [userCount, setUserCount] = useState<number | string>('...');
  const [listingCount, setListingCount] = useState<number | string>('...');

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes] = await Promise.all([
          fetch('/api/users?limit=1'),
          fetch('/api/products?status=active&limit=1')
        ]);
        if (usersRes.ok) {
          const uData = await usersRes.json();
          setUserCount(uData.total || 0);
        }
        if (productsRes.ok) {
          const pData = await productsRes.json();
          setListingCount(pData.total || 0);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }
    fetchStats();
  }, []);

  const [formData, setFormData] = useState({`
);

// Add useEffect to imports
code = code.replace(
  /import \{ useState \} from 'react';/,
  "import { useState, useEffect } from 'react';"
);

// We need to replace the demo buttons and the dividing line
// Let's use regex to remove the "Or try demo" block and the buttons

code = code.replace(
  /<div className="relative">[\s\S]*?Developer\s*<\/Button>\s*<\/div>\s*<\/form>/,
  `</form>`
);

// Wait, the regex might be tricky. Let's do it directly.
code = code.replace(
  /<div className="relative">[\s\S]*?<span className="bg-card px-2 text-muted-foreground">Or try demo<\/span>[\s\S]*?<\/div>\s*<div className="mt-4 grid grid-cols-3 gap-2">[\s\S]*?<\/div>/,
  ''
);

// Replace hardcoded stats output
code = code.replace(
  /Join over 100,000 Tanzanians buying and selling everything from/g,
  'Join {userCount} Tanzanians buying and selling everything from'
);

code = code.replace(
  /<p className="text-2xl font-bold">50K\+<\/p>/g,
  '<p className="text-2xl font-bold">{listingCount}</p>'
);

fs.writeFileSync('app/auth/login/page.tsx', code);
console.log('done!');
