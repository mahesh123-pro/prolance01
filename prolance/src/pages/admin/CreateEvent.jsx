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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert dates to ISO strings for API
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
            navigate('/admin/dashboard');
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">
                    {isEditMode ? 'Edit Event' : 'Create New Event'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Event Title</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. React Deep Dive" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Event Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Hackathon">Hackathon</option>
                                <option value="Meetup">Meetup</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Max Seats</label>
                            <Input type="number" name="maxSeats" value={formData.maxSeats} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Start Date</label>
                            <Input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">End Date</label>
                            <Input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Location</label>
                        <Input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Online or 123 Main St" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Registration Deadline</label>
                        <Input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Cover Image URL</label>
                        <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            <Save className="mr-2 h-4 w-4" /> Save Event
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
