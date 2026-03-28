import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Parcels from './pages/Parcels';
import ServiceCentres from './pages/ServiceCentres';
import Vehicles from './pages/Vehicles';
import TrackingEvents from './pages/TrackingEvents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="parcels" element={<Parcels />} />
          <Route path="service-centres" element={<ServiceCentres />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="tracking-events" element={<TrackingEvents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
