const fs = require('fs');

let file = fs.readFileSync('src/pages/admin/AdminWorkForm.tsx', 'utf8');

if (!file.includes('ReactQuill')) {
  file = file.replace(
    "import { Plus, Trash2, ArrowLeft } from 'lucide-react';",
    "import { Plus, Trash2, ArrowLeft } from 'lucide-react';\nimport ReactQuill from 'react-quill';\nimport 'react-quill/dist/quill.snow.css';"
  );
  
  const oldTextarea = `<textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none resize-none"
              />`;
              
  const newTextarea = `<div className="bg-zinc-50 rounded-xl overflow-hidden [&_.ql-container]:min-h-[200px] [&_.ql-container]:text-base [&_.ql-container]:font-sans [&_.ql-editor]:min-h-[200px] [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-border-subtle [&_.ql-container]:border-x-0 [&_.ql-container]:border-b-0 [&_.ql-container]:border-border-subtle border border-border-subtle focus-within:ring-2 focus-within:ring-ink transition-shadow">
                <ReactQuill
                  theme="snow"
                  value={formData.description || ''}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  modules={{
                    toolbar: [
                      [{ 'header': [2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'clean']
                    ]
                  }}
                />
              </div>`;
              
  file = file.replace(oldTextarea, newTextarea);
  fs.writeFileSync('src/pages/admin/AdminWorkForm.tsx', file);
  console.log('Work form patched');
}
