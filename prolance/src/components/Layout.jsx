import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils'; // Corrected path
import { Calendar } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 tracking-tight hover:opacity-80 transition-opacity">
                        <Calendar className="h-6 w-6" />
                        <span>EventFlow</span>
                    </Link>
                    <nav className="flex gap-6">
                        <Link
                            to="/"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary-600",
                                location.pathname === '/' ? "text-primary-600" : "text-slate-600"
                            )}
                        >
                            Explore Events
                        </Link>
                        {!isAdmin && (
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                                Organizer Login
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© 2026 EventFlow. Crafted for excellence.</p>
                </div>
            </footer>
        </div>
    );
}
