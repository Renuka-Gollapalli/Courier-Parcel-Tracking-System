import { useState, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Employees = () => {
  const { employees, insertRecord, updateRecord, deleteRecord } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const columns = [
    { key: 'EMPLOYEE_ID', label: 'Employee ID' },
    { key: 'NAME', label: 'Name' },
    { key: 'SALARY', label: 'Salary (₹)' },
    { key: 'CENTRE_ID', label: 'Service Centre' }
  ];

  const handleOpenModal = (record = null) => {
    if (record) {
      setFormData(record);
      setEditingId(record.EMPLOYEE_ID);
    } else {
      setFormData({
        EMPLOYEE_ID: `E00${employees.length + 3}`,
        NAME: '', SALARY: '', CENTRE_ID: 'SC-001'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateRecord('employee', 'EMPLOYEE_ID', formData);
    } else {
      insertRecord('employee', formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm('Delete employee ' + record.EMPLOYEE_ID + '?')) {
      deleteRecord('employee', 'EMPLOYEE_ID', record.EMPLOYEE_ID);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Employees & Centres</h1>
          <p>Manage staff directory and service centre assignments.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}><Plus size={20} /> Add Employee</button>
      </div>

      <DataTable 
        title="Staff Directory"
        columns={columns} 
        data={employees} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Employee' : 'Add New Employee'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Employee ID</label>
            <input required name="EMPLOYEE_ID" value={formData.EMPLOYEE_ID || ''} onChange={(e) => setFormData({...formData, EMPLOYEE_ID: e.target.value})} readOnly={!!editingId} style={editingId ? { background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', cursor: 'not-allowed' } : {}} />
          </div>
          <div><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label><input required value={formData.NAME || ''} onChange={(e) => setFormData({...formData, NAME: e.target.value})} /></div>
          <div><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Salary</label><input required type="number" value={formData.SALARY || ''} onChange={(e) => setFormData({...formData, SALARY: e.target.value})} /></div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Service Centre</label>
            <select required value={formData.CENTRE_ID || ''} onChange={(e) => setFormData({...formData, CENTRE_ID: e.target.value})}>
              <option value="SC-001">SC-001 - Main Hub</option>
              <option value="SC-002">SC-002 - North Station</option>
              <option value="SC-003">SC-003 - East Depot</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>{editingId ? 'Update Record' : 'Insert Record'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
