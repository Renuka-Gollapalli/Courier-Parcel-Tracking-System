import { useState, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const ServiceCentres = () => {
  const { serviceCentres, insertRecord, deleteRecord } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const columns = [
    { key: 'CENTRE_ID', label: 'Centre ID' }
  ];

  const handleOpenModal = () => {
    setFormData({ CENTRE_ID: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    insertRecord('service-centre', formData);
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm('Delete service centre ' + record.CENTRE_ID + '?')) {
      deleteRecord('service-centre', 'CENTRE_ID', record.CENTRE_ID);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Service Centres</h1>
          <p>Manage all operational hubs for the logistics network.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenModal}><Plus size={20} /> Add Centre</button>
      </div>

      <DataTable 
        title="Centres List"
        columns={columns} 
        data={serviceCentres || []} 
        onEdit={() => { alert("Update disabled for Centre ID because it's the only column."); }} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Centre">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Service Centre ID</label>
            <input required name="CENTRE_ID" value={formData.CENTRE_ID || ''} onChange={(e) => setFormData({...formData, CENTRE_ID: e.target.value})} placeholder="e.g. SC-004"/>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>Insert Record</button>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceCentres;
