const fs = require('fs');

const file = 'src/pages/admin/GenericAdminList.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/title="Edit"/g, 'title="Edit" aria-label="Edit record"');
content = content.replace(/title="Delete"/g, 'title="Delete" aria-label="Delete record"');
content = content.replace(/<button onClick=\{\(\) => setIsModalOpen\(false\)\} className="text-ink-muted hover:text-ink transition-colors">/g, '<button onClick={() => setIsModalOpen(false)} className="text-ink-muted hover:text-ink transition-colors" aria-label="Close modal">');
fs.writeFileSync(file, content);
