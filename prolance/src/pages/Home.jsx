import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../lib/api';


export default function Home() {
    const [events, setEvents] = useState([]);

    // Mock data for initial view will be replaced by API call later
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-12">
            <section className="text-center space-y-4 max-w-3xl mx-auto pt-10 pb-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    Discover <span className="text-primary-600">Events</span> That Matter
                </h1>
                <p className="text-lg text-slate-600">
                    Join workshops, seminars, and hackathons. Elevate your skills and network with the best.
                </p>

                <div className="flex items-center gap-2 max-w-md mx-auto mt-8 bg-white p-2 rounded-full shadow-lg border border-slate-100 transition-shadow focus-within:shadow-xl">
                    <Search className="ml-3 text-slate-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="flex-1 outline-none text-slate-700 placeholder:text-slate-400 text-sm"
                    />
                    <Button size="sm" className="rounded-full px-6">Search</Button>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <div key={event.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={event.image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop'}
                                alt={event.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary-700">
                                {event.type}
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-emerald-600">
                                    {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-slate-500 text-sm flex items-center gap-2 line-clamp-1">
                                    📍 {event.location}
                                </p>
                            </div>
                            <Link to={`/events/${event.id}`} className="block w-full">
                                <Button variant="outline" className="w-full group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-700">
                                    View Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
