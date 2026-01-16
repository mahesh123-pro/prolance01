import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export default function Button({ className, variant = 'primary', size = 'md', isLoading, children, ...props }) {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "border border-slate-200 hover:bg-slate-100 bg-transparent text-slate-900",
        ghost: "hover:bg-slate-100 text-slate-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 py-2 px-4",
        lg: "h-11 px-8 rounded-md text-lg",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
