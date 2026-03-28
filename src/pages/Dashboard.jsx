import { useContext } from 'react';
import { StateContext } from '../context/StateContext';
import { Users, UserCircle, Package, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { customers, employees, parcels } = useContext(StateContext);

  const stats = [
    { label: 'Total Parcels', value: parcels.length, icon: <Package size={24} color="var(--primary)" />, suffix: 'active' },
    { label: 'Registered Customers', value: customers.length, icon: <Users size={24} color="#10b981" />, suffix: 'users' },
    { label: 'Active Employees', value: employees.length, icon: <UserCircle size={24} color="#8b5cf6" />, suffix: 'staff' },
    { label: 'Avg Transit Time', value: '2.4', icon: <TrendingUp size={24} color="#f59e0b" />, suffix: 'days' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Overview Dashboard</h1>
        <p>Monitor real-time logistics metrics and system health.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stat.value} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>{stat.suffix}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2>System Welcome</h2>
        <p>This full-stack Database Application supports live DML operations synced directly with the MySQL Database for Customers, Employees, Parcels, Vehicles, and Tracking.</p>
      </div>
    </div>
  );
};

export default Dashboard;
