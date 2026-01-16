import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../lib/api';

export default function CreateEvent() {
    const { id } = useParams(); // If ID exists, we are editing
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Workshop',
        startDate: '',
        endDate: '',
        location: '',
        maxSeats: '',
        deadline: '',
        image: ''
    });

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchEventData();
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const { data } = await api.get(`/events/${id}`);
            // Format dates for input fields (datetime-local requires YYYY-MM-DDThh:mm)
            const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().slice(0, 16) : '';

            setFormData({
                ...data,
                startDate: formatDate(data.startDate),
                endDate: formatDate(data.endDate),
                deadline: formatDate(data.deadline),
            });
        } catch (error) {
            console.error("Failed to fetch event", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'ADMIN';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            maxSeats: parseInt(formData.maxSeats),
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            deadline: new Date(formData.deadline).toISOString(),
        };

        try {
            if (isEditMode) {
                await api.patch(`/events/${id}`, payload);
            } else {
                await api.post('/events', payload);
            }

            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                alert('Event submitted successfully! It will be listed once approved by an admin.');
                navigate('/');
            }
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/')} className="pl-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to {isAdmin ? 'Dashboard' : 'Home'}
            </Button>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {isEditMode ? 'Edit Event' : 'Create New Event'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Title</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. React Deep Dive" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Hackathon">Hackathon</option>
                                <option value="Meetup">Meetup</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Seats</label>
                            <Input type="number" name="maxSeats" value={formData.maxSeats} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                            <Input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                            <Input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                        <Input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Online or 123 Main St" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="flex w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Registration Deadline</label>
                        <Input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cover Image URL</label>
                        <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/')} className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            <Save className="mr-2 h-4 w-4" /> {isEditMode ? 'Update Event' : 'Submit Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
