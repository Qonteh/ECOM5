const fs = require('fs');
let code = fs.readFileSync('app/(main)/page.tsx', 'utf-8');

// Add state
code = code.replace(
  'const [loading, setLoading] = useState(true);',
  'const [loading, setLoading] = useState(true);\n  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});'
);

// Add fetch
code = code.replace(
  'fetchProducts();\n  }, []);',
  `fetchProducts();
    async function fetchRegions() {
      try {
        const res = await fetch('/api/regions');
        if (res.ok) {
          const data = await res.json();
          const counts: Record<string, number> = {};
          data.forEach((r: any) => {
            counts[r.region] = parseInt(r.count, 10);
          });
          setRegionCounts(counts);
        }
      } catch (e) {
        console.error('Error fetching regions:', e);
      }
    }
    fetchRegions();
  }, []);`
);

// Replace hardcoded ads output
code = code.replace(
  /\{100 \+ \(\(idx \* 87\) % 400\)\}\+ ads/g,
  '{regionCounts[region] || 0} ads'
);

fs.writeFileSync('app/(main)/page.tsx', code);
console.log('done!');
