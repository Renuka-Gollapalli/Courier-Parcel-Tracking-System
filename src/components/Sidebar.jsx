import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Package, Building, Truck, Clock } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Employees', path: '/employees', icon: <UserCircle size={20} /> },
    { name: 'Parcels', path: '/parcels', icon: <Package size={20} /> },
    { name: 'Service Centres', path: '/service-centres', icon: <Building size={20} /> },
    { name: 'Fleet Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
    { name: 'Tracking Events', path: '/tracking-events', icon: <Clock size={20} /> },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-surface)',
      borderRight: 'var(--glass-border)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          width: '40px', height: '40px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}>
          <Package size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>SwiftLogistics</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.2) 0%, transparent 100%)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontWeight: isActive ? 600 : 500
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
