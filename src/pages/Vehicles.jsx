import { useState, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Vehicles = () => {
  const { vehicles, employees, insertRecord, deleteRecord } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ TYPE: 'Van' });

  const columns = [
    { key: 'EMPLOYEE_ID', label: 'Driver (Employee ID)' },
    { key: 'TYPE', label: 'Vehicle Type' },
    { key: 'DESC_VAL', label: 'Capacity/Volume' }
  ];

  const handleOpenModal = () => {
    setFormData({ TYPE: 'Van', EMPLOYEE_ID: '', DESC_VAL: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    insertRecord('vehicle', formData);
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm('Delete vehicle for employee ' + record.EMPLOYEE_ID + '?')) {
      deleteRecord(`vehicle/${record.TYPE}`, 'EMPLOYEE_ID', record.EMPLOYEE_ID);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Vehicles Management</h1>
          <p>Assign Vans and Motorcycles to Employees.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenModal}><Plus size={20} /> Assign Vehicle</button>
      </div>

      <DataTable 
        title="Fleet Overview"
        columns={columns} 
        data={vehicles || []} 
        onEdit={() => { alert("Updates not supported for this entity. Please delete and re-assign."); }} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Vehicle to Employee">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Employee (Driver)</label>
            <select required value={formData.EMPLOYEE_ID || ''} onChange={(e) => setFormData({...formData, EMPLOYEE_ID: e.target.value})}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.EMPLOYEE_ID} value={e.EMPLOYEE_ID}>{e.EMPLOYEE_ID} - {e.NAME}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Vehicle Type</label>
            <select required value={formData.TYPE} onChange={(e) => setFormData({...formData, TYPE: e.target.value, DESC_VAL: ''})}>
              <option value="Van">Van</option>
              <option value="Motorcycle">Motorcycle</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              {formData.TYPE === 'Van' ? 'Cargo Volume (m³)' : 'Engine Capacity (cc)'}
            </label>
            <input required type={formData.TYPE === 'Van' ? "number" : "text"} step="0.1" value={formData.DESC_VAL || ''} onChange={(e) => setFormData({...formData, DESC_VAL: e.target.value})} placeholder={formData.TYPE === 'Van' ? "e.g. 15.5" : "e.g. 150cc"}/>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>Assign Vehicle</button>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
