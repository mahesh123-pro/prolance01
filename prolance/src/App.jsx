import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import CreateEvent from './pages/admin/CreateEvent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="create-event" element={<CreateEvent />} />

          {/* Admin Routes */}
          <Route path="admin" >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="edit-event/:id" element={<CreateEvent />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
