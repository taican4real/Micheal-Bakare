const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard imports with lazy imports
const standardImports = `import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import WorkDetail from './pages/WorkDetail';
import Services from './pages/Services';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import AdminWorks from './pages/admin/AdminWorks';
import AdminWorkForm from './pages/admin/AdminWorkForm';
import AdminStore from './pages/admin/AdminStore';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminServices from './pages/admin/AdminServices';
import AdminServiceForm from './pages/admin/AdminServiceForm';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminQuoteDetail from './pages/admin/AdminQuoteDetail';
import GenericAdminList from './pages/admin/GenericAdminList';`;

const lazyImports = `import { Suspense, lazy } from 'react';

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
const AdminWorks = lazy(() => import('./pages/admin/AdminWorks'));
const AdminWorkForm = lazy(() => import('./pages/admin/AdminWorkForm'));
const AdminStore = lazy(() => import('./pages/admin/AdminStore'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminServiceForm = lazy(() => import('./pages/admin/AdminServiceForm'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const AdminQuoteDetail = lazy(() => import('./pages/admin/AdminQuoteDetail'));
const GenericAdminList = lazy(() => import('./pages/admin/GenericAdminList'));`;

code = code.replace(standardImports, lazyImports);

code = code.replace('<Routes>', '<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-ink-muted">Loading...</div>}>\n      <Routes>');
code = code.replace('</Routes>', '</Routes>\n    </Suspense>');

fs.writeFileSync('src/App.tsx', code);
