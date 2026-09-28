const fs = require('fs');

const updateAlt = (file, from, to) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(file, content);
  }
}

updateAlt('src/pages/admin/AdminStore.tsx', 'alt=""', 'alt={product.title}');
updateAlt('src/pages/admin/AdminServices.tsx', 'alt=""', 'alt={service.title}');

