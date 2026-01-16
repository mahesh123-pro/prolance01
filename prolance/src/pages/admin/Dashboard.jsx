import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../lib/api';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events/admin/all');
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            alert("Failed to delete event");
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.patch(`/events/${id}/approve`);
            setEvents(events.map(e => e.id === id ? { ...e, status: 'APPROVED' } : e));
        } catch (error) {
            alert("Failed to approve event");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-600 dark:text-slate-400">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Event Dashboard</h1>
                <Link to="/create-event">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Event Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Registrations</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{event.title}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                    {new Date(event.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge>{event.type}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${event.status === 'APPROVED'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {event.status || 'PENDING'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                        <Users className="h-4 w-4" />
                                        {event.registrationsCount || 0} / {event.maxSeats}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {(event.status === 'PENDING' || !event.status) && (
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleApprove(event.id)} title="Approve">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        </Button>
                                    )}
                                    <Link to={`/admin/edit-event/${event.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Edit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(event.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                    No events found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
