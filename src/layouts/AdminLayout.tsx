import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, ShoppingBag, MessageSquare, 
  Settings, LogOut, Briefcase, FileText, Image, Users,
  BarChart, Activity, Award, BookOpen, Share2, Tag, Box, Star
} from 'lucide-react';
import { auth, loginWithGoogle, logout } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AdminLayout() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email === 'taican4real@gmail.com') {
          setIsAuthorized(true);
          setLoading(false);
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setIsAuthorized(true);
            } else {
              setAuthError("Unauthorized. Your account does not have admin privileges.");
              setIsAuthorized(false);
            }
          } catch (e) {
            setAuthError("Unauthorized or missing permissions.");
            setIsAuthorized(false);
          }
          setLoading(false);
        }
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const navGroups = [
    {
      label: 'Dashboard',
      items: [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      label: 'Content',
      items: [
        { name: 'Biography', path: '/admin/biography', icon: <FileText size={18} /> },
        { name: 'Career', path: '/admin/career', icon: <Briefcase size={18} /> },
        { name: 'Achievements', path: '/admin/achievements', icon: <Award size={18} /> },
        { name: 'Legacy', path: '/admin/legacy', icon: <BookOpen size={18} /> },
      ]
    },
    {
      label: 'Portfolio & Services',
      items: [
        { name: 'Works', path: '/admin/works', icon: <FolderKanban size={18} /> },
        { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} /> },
        { name: 'Services', path: '/admin/services', icon: <Briefcase size={18} /> },
        { name: 'Quote Requests', path: '/admin/quotes', icon: <MessageSquare size={18} /> },
      ]
    },
    {
      label: 'Commerce',
      items: [
        { name: 'Products', path: '/admin/store', icon: <ShoppingBag size={18} /> },
        { name: 'Categories', path: '/admin/categories', icon: <Tag size={18} /> },
        { name: 'Digital Assets', path: '/admin/digital-assets', icon: <Box size={18} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
        { name: 'Customers', path: '/admin/customers', icon: <Users size={18} /> },
      ]
    },
    {
      label: 'Site',
      items: [
        { name: 'Media', path: '/admin/media', icon: <Image size={18} /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <Star size={18} /> },
        { name: 'SEO', path: '/admin/seo', icon: <Share2 size={18} /> },
        { name: 'Social Links', path: '/admin/social-links', icon: <Share2 size={18} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'Analytics', path: '/admin/analytics', icon: <BarChart size={18} /> },
        { name: 'System Logs', path: '/admin/logs', icon: <Activity size={18} /> },
      ]
    }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50">Loading...</div>;
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-border-subtle text-center">
          <h1 className="font-serif text-3xl text-ink mb-2">Admin Login</h1>
          {authError ? <p className="text-red-600 mb-8">{authError}</p> : <p className="text-ink-muted mb-8">Please sign in to access the dashboard.</p>}
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-ink text-canvas py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors"
          >
            Sign in with Google
          </button>
          <div className="mt-6">
            <Link to="/" className="text-sm text-ink-muted hover:text-ink underline underline-offset-4">Return to site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border-subtle flex-shrink-0 flex flex-col h-full">
        <div className="p-6 border-b border-border-subtle flex-shrink-0">
          <h1 className="font-serif text-2xl text-ink tracking-tight">MB Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || 
                                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${
                        isActive 
                          ? 'bg-ink text-canvas' 
                          : 'text-ink-muted hover:bg-zinc-100 hover:text-ink'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border-subtle space-y-2 flex-shrink-0">
          <div className="px-4 py-2 mb-2 text-xs text-ink-muted truncate">
            {user.email}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-ink-muted hover:bg-zinc-100 hover:text-ink text-left"
          >
            <LogOut size={20} />
            Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-ink-muted hover:bg-zinc-100 hover:text-ink"
          >
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
