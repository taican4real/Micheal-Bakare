/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import GlobalSkeleton from './components/GlobalSkeleton';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Works = lazy(() => import('./pages/Works'));
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
const Services = lazy(() => import('./pages/Services'));
const Store = lazy(() => import('./pages/Store'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Media = lazy(() => import('./pages/Media'));
const Contact = lazy(() => import('./pages/Contact'));

const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderStatus = lazy(() => import('./pages/OrderStatus'));
const Legal = lazy(() => import('./pages/Legal'));


const AdminWorks = lazy(() => import('./pages/admin/AdminWorks'));
const AdminWorkForm = lazy(() => import('./pages/admin/AdminWorkForm'));
const AdminStore = lazy(() => import('./pages/admin/AdminStore'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminServiceForm = lazy(() => import('./pages/admin/AdminServiceForm'));

const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const AdminQuoteDetail = lazy(() => import('./pages/admin/AdminQuoteDetail'));
const GenericAdminList = lazy(() => import('./pages/admin/GenericAdminList'));


function App() {
  return (
    <Suspense fallback={<GlobalSkeleton />}>
      <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="works" element={<Works />} />
        <Route path="works/:id" element={<WorkDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="store" element={<Store />} />
        <Route path="store/:id" element={<ProductDetail />} />
        <Route path="media" element={<Media />} />
        <Route path="contact" element={<Contact />} />

        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-status/:id" element={<OrderStatus />} />
        <Route path="legal/:type" element={<Legal />} />
        <Route path="legal" element={<Legal />} />

      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="works" element={<AdminWorks />} />
        <Route path="works/new" element={<AdminWorkForm />} />
        <Route path="works/:id/edit" element={<AdminWorkForm />} />
        
        <Route path="store" element={<AdminStore />} />
        <Route path="store/new" element={<AdminProductForm />} />
        
        <Route path="store/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />


        <Route path="services" element={<AdminServices />} />
        <Route path="services/new" element={<AdminServiceForm />} />
        <Route path="services/:id/edit" element={<AdminServiceForm />} />
        
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="quotes/:id" element={<AdminQuoteDetail />} />
        <Route path="settings" element={<GenericAdminList collectionName="settings" title="Settings" description="Manage global site settings." fields={[{name:'key',label:'Setting Key',type:'text',required:true},{name:'value',label:'Setting Value',type:'text',required:true}]} />} />

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

      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;
