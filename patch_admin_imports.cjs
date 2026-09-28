const fs = require('fs');
['src/pages/admin/AdminServiceForm.tsx', 'src/pages/admin/AdminWorkForm.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("import ReactQuill from 'react-quill';")) {
    content = content.replace(
      "import { Link } from 'react-router-dom';",
      "import { Link } from 'react-router-dom';\nimport ReactQuill from 'react-quill';\nimport 'react-quill/dist/quill.snow.css';"
    );
    fs.writeFileSync(file, content);
  }
});
