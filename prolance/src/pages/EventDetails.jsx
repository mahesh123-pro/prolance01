import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import api from '../lib/api';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true); // Default true when connected to API
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    // Registration Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistering(true);
        try {
            await api.post(`/events/${id}/register`, formData);
            setIsRegistered(true);
        } catch (error) {
            console.error("Registration failed", error);
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96"><div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;
    }

    if (!event) return <div className="text-center p-10">Event not found</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-primary-600">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-md">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4">
                            <Badge variant="primary" className="text-sm px-3 py-1 bg-white/90 backdrop-blur text-primary-700 shadow-sm">{event.type}</Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>

                        <div className="flex flex-wrap gap-4 text-slate-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary-500" />
                                <span>{new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary-500" />
                                <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary-500" />
                                <span>{event.location}</span>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none pt-4 border-t border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">About this Event</h3>
                            <p className="text-slate-600 leading-relaxed">{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Registration */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                        <div className="mb-6 pb-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <span className="text-sm text-slate-500">Available Seats</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-900">{event.maxSeats - event.registrationsCount}</span>
                                    <span className="text-sm text-slate-400">/ {event.maxSeats}</span>
                                </div>
                            </div>
                            <Users className="h-8 w-8 text-primary-200" />
                        </div>

                        {isRegistered ? (
                            <div className="text-center py-8 space-y-3">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                                <h3 className="text-xl font-bold text-slate-900">You're Registered!</h3>
                                <p className="text-slate-500 text-sm">A confirmation email has been sent to {formData.email}.</p>
                                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/')}>Browse More Events</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <h3 className="font-semibold text-slate-900">Register Now</h3>
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Company / Institution (Optional)"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <Button className="w-full" size="lg" isLoading={registering}>
                                    Confirm Registration
                                </Button>
                                <p className="text-xs text-center text-slate-400">
                                    By registering, you agree to our terms and conditions.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
