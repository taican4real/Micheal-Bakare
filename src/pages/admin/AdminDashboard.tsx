import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getCountFromServer, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Music, ShoppingBag, Briefcase, Plus, ArrowUpRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    works: 0,
    products: 0,
    services: 0,
    orders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [worksSnap, productsSnap, servicesSnap, ordersSnap] = await Promise.all([
          getCountFromServer(collection(db, 'portfolio')).catch(() => ({ data: () => ({ count: 0 }) })),
          getCountFromServer(collection(db, 'products')).catch(() => ({ data: () => ({ count: 0 }) })),
          getCountFromServer(collection(db, 'services')).catch(() => ({ data: () => ({ count: 0 }) })),
          getCountFromServer(collection(db, 'orders')).catch(() => ({ data: () => ({ count: 0 }) }))
        ]);

        setStats({
          works: worksSnap.data().count,
          products: productsSnap.data().count,
          services: servicesSnap.data().count,
          orders: ordersSnap.data().count
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const easeCurve = [0.22, 1, 0.36, 1];

  const quickActions = [
    { label: 'New Work', icon: Music, link: '/admin/works/new' },
    { label: 'New Product', icon: ShoppingBag, link: '/admin/store/new' },
    { label: 'New Service', icon: Briefcase, link: '/admin/services/new' },
  ];

  return (
    <div className="pb-32 w-full max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-ink tracking-tight mb-2">Command Center</h1>
        <p className="text-ink-muted text-lg font-light">Welcome back, Michael. Here is your archive overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Welcome / Primary Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeCurve }}
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-ink text-canvas p-8 md:p-10 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-[100px] -mr-20 -mt-20 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
          <div className="relative z-10">
            <h2 className="text-sm uppercase tracking-widest font-semibold text-zinc-400 mb-6 flex items-center gap-2">
              <Activity size={16} /> Live Status
            </h2>
            <div className="font-serif text-4xl md:text-5xl leading-tight mb-4">
              Your digital presence is performing optimally.
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between border-t border-zinc-800 pt-6 mt-8">
            <p className="text-zinc-400 font-light max-w-sm">
              You have {stats.works} published works and {stats.products} active products across your public channels.
            </p>
          </div>
        </motion.div>

        {/* Stat: Portfolio */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easeCurve }}
          className="col-span-1 lg:col-span-1 bg-surface border border-border-subtle p-8 rounded-[2rem] flex flex-col justify-between group hover:border-ink transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-ink group-hover:scale-110 transition-transform duration-500">
              <Music size={20} />
            </div>
            <Link to="/admin/works" className="text-ink-muted hover:text-ink transition-colors">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <div>
            <div className="text-4xl font-serif text-ink mb-1">
              {isLoading ? '...' : stats.works}
            </div>
            <div className="text-sm font-semibold tracking-widest uppercase text-ink-muted">Portfolio Works</div>
          </div>
        </motion.div>

        {/* Stat: Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: easeCurve }}
          className="col-span-1 lg:col-span-1 bg-surface border border-border-subtle p-8 rounded-[2rem] flex flex-col justify-between group hover:border-ink transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-ink group-hover:scale-110 transition-transform duration-500">
              <ShoppingBag size={20} />
            </div>
            <Link to="/admin/store" className="text-ink-muted hover:text-ink transition-colors">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <div>
            <div className="text-4xl font-serif text-ink mb-1">
              {isLoading ? '...' : stats.products}
            </div>
            <div className="text-sm font-semibold tracking-widest uppercase text-ink-muted">Store Products</div>
          </div>
        </motion.div>

        {/* Quick Actions Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeCurve }}
          className="col-span-1 md:col-span-2 lg:col-span-2 bg-surface border border-border-subtle p-8 rounded-[2rem]"
        >
          <h2 className="text-sm uppercase tracking-widest font-semibold text-ink-muted mb-6">Quick Actions</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {quickActions.map((action, idx) => (
              <Link 
                key={idx} 
                to={action.link}
                className="flex-shrink-0 flex items-center gap-3 bg-zinc-50 border border-border-subtle px-6 py-4 rounded-full hover:border-ink hover:bg-zinc-100 transition-all group"
              >
                <div className="bg-canvas p-2 rounded-full border border-border-subtle group-hover:scale-110 transition-transform">
                  <Plus size={16} className="text-ink" />
                </div>
                <span className="font-medium text-sm text-ink pr-2">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
