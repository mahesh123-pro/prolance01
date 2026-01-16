import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Calendar } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col font-sans">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight hover:opacity-80 transition-opacity">
                        <Calendar className="h-6 w-6" />
                        <span>EventFlow</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link
                            to="/"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400",
                                location.pathname === '/' ? "text-primary-600 dark:text-primary-400" : "text-slate-600 dark:text-slate-300"
                            )}
                        >
                            Explore Events
                        </Link>
                        {!isAdmin && (
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                Organizer Login
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                                Dashboard
                            </Link>
                        )}
                        <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
                <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>© 2026 EventFlow. Crafted for excellence.</p>
                </div>
            </footer>
        </div>
    );
}
