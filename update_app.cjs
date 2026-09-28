const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importGeneric = "import GenericAdminList from './pages/admin/GenericAdminList';\n";
code = code.replace("import AdminQuoteDetail from './pages/admin/AdminQuoteDetail';", "import AdminQuoteDetail from './pages/admin/AdminQuoteDetail';\n" + importGeneric);

// Add components mapping
const routesAdd = `
        {/* Content */}
        <Route path="biography" element={<GenericAdminList collectionName="biography" title="Biography" description="Manage your biography sections." fields={[{name:'title',label:'Section Title',type:'text',required:true},{name:'content',label:'Content',type:'textarea',required:true},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="career" element={<GenericAdminList collectionName="career" title="Career" description="Manage career timeline and milestones." fields={[{name:'title',label:'Role / Milestone',type:'text',required:true},{name:'year',label:'Year',type:'text',required:true},{name:'description',label:'Description',type:'textarea'},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="achievements" element={<GenericAdminList collectionName="achievements" title="Achievements" description="Manage awards and recognition." fields={[{name:'title',label:'Award Title',type:'text',required:true},{name:'organization',label:'Organization',type:'text'},{name:'year',label:'Year',type:'text'},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="legacy" element={<GenericAdminList collectionName="legacy" title="Legacy" description="Manage legacy documentation." fields={[{name:'title',label:'Title',type:'text',required:true},{name:'content',label:'Description',type:'textarea'},{name:'status',label:'Status',type:'status'}]} />} />
        
        {/* Portfolio */}
        <Route path="projects" element={<GenericAdminList collectionName="projects" title="Projects" description="Manage ongoing and past projects." fields={[{name:'title',label:'Project Name',type:'text',required:true},{name:'description',label:'Description',type:'textarea'},{name:'status',label:'Status',type:'status'}]} />} />
        
        {/* Commerce Extras */}
        <Route path="categories" element={<GenericAdminList collectionName="categories" title="Categories" description="Manage product and portfolio categories." fields={[{name:'name',label:'Category Name',type:'text',required:true},{name:'type',label:'Type (Store/Portfolio)',type:'text'},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="digital-assets" element={<GenericAdminList collectionName="digitalAssets" title="Digital Assets" description="Manage direct secure file references." fields={[{name:'title',label:'Asset Name',type:'text',required:true},{name:'storagePath',label:'Storage Path',type:'text',required:true},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="customers" element={<GenericAdminList collectionName="customers" title="Customers" description="View customer records." fields={[{name:'name',label:'Name',type:'text',required:true},{name:'email',label:'Email',type:'text',required:true},{name:'notes',label:'Notes',type:'textarea'}]} />} />
        
        {/* Site */}
        <Route path="media" element={<GenericAdminList collectionName="media" title="Media Library" description="Manage press photos and assets." fields={[{name:'title',label:'Title',type:'text',required:true},{name:'url',label:'Image/Video URL',type:'text',required:true},{name:'caption',label:'Caption',type:'text'},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="testimonials" element={<GenericAdminList collectionName="testimonials" title="Testimonials" description="Manage client reviews and quotes." fields={[{name:'author',label:'Author',type:'text',required:true},{name:'quote',label:'Quote',type:'textarea',required:true},{name:'company',label:'Company/Role',type:'text'},{name:'status',label:'Status',type:'status'}]} />} />
        <Route path="seo" element={<GenericAdminList collectionName="seo" title="SEO Metadata" description="Manage page-level SEO." fields={[{name:'page',label:'Page Path',type:'text',required:true},{name:'title',label:'SEO Title',type:'text',required:true},{name:'description',label:'Meta Description',type:'textarea'}]} />} />
        <Route path="social-links" element={<GenericAdminList collectionName="socialLinks" title="Social Links" description="Manage external profiles." fields={[{name:'platform',label:'Platform',type:'text',required:true},{name:'url',label:'URL',type:'text',required:true},{name:'status',label:'Status',type:'status'}]} />} />
        
        {/* System */}
        <Route path="analytics" element={<GenericAdminList collectionName="analytics" title="Analytics" description="View site analytics and metrics." fields={[{name:'metric',label:'Metric Name',type:'text'},{name:'value',label:'Value',type:'text'},{name:'date',label:'Date',type:'text'}]} />} />
        <Route path="logs" element={<GenericAdminList collectionName="systemLogs" title="System Logs" description="View application logs." fields={[{name:'action',label:'Action',type:'text'},{name:'user',label:'User',type:'text'},{name:'details',label:'Details',type:'text'}]} />} />
`;

code = code.replace("<Route path=\"settings\" element={<div>Platform settings coming soon.</div>} />", "<Route path=\"settings\" element={<GenericAdminList collectionName=\"settings\" title=\"Settings\" description=\"Manage global site settings.\" fields={[{name:'key',label:'Setting Key',type:'text',required:true},{name:'value',label:'Setting Value',type:'text',required:true}]} />} />\n" + routesAdd);

fs.writeFileSync('src/App.tsx', code);
