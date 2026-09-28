const fs = require('fs');

const fixFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("schema={{", "schema={[ {");
  content = content.replace("          }\n          }}", "          }\n          ]}");
  fs.writeFileSync(file, content);
};

fixFile('src/pages/WorkDetail.tsx');
fixFile('src/pages/ProductDetail.tsx');
