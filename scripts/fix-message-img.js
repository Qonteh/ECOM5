const fs = require('fs');
let code = fs.readFileSync('app/(main)/messages/page.tsx', 'utf-8');

code = code.replace(
  "{activeConversation.productImage.startsWith('http') ? (",
  "{activeConversation.productImage ? ("
);

code = code.replace(
  "src={activeConversation.productImage}",
  "src={activeConversation.productImage.startsWith('iVBOR') ? `data:image/jpeg;base64,${activeConversation.productImage}` : activeConversation.productImage}"
);

fs.writeFileSync('app/(main)/messages/page.tsx', code);
console.log('fixed message images');
