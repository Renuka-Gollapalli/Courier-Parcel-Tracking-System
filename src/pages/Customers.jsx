import { useState, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Customers = () => {
  const { customers, insertRecord, updateRecord, deleteRecord } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const columns = [
    { key: 'CUSTOMER_ID', label: 'ID' },
    { key: 'FIRST_NAME', label: 'First Name' },
    { key: 'LAST_NAME', label: 'Last Name' },
    { key: 'STREET', label: 'Street' },
    { key: 'CITY', label: 'City' },
    { key: 'ZIP_CODE', label: 'Zip' },
    { key: 'PHONE_NUMBER', label: 'Phone' }
  ];

  const handleOpenModal = (record = null) => {
    if (record) {
      setFormData(record);
      setEditingId(record.CUSTOMER_ID);
    } else {
      setFormData({
        CUSTOMER_ID: `C10${customers.length + 10}`,
        FIRST_NAME: '', LAST_NAME: '', STREET: '', CITY: '', ZIP_CODE: '', PHONE_NUMBER: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateRecord('customer', 'CUSTOMER_ID', formData);
    } else {
      insertRecord('customer', formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm('Delete customer ' + record.CUSTOMER_ID + '?')) {
      deleteRecord('customer', 'CUSTOMER_ID', record.CUSTOMER_ID);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Customers Management</h1>
          <p>View, search, and manage customer records.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}><Plus size={20} /> Add Customer</button>
      </div>

      <DataTable 
        title="Customer Directory"
        columns={columns} 
        data={customers} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Customer' : 'Add New Customer'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Customer ID</label>
            <input required name="CUSTOMER_ID" value={formData.CUSTOMER_ID || ''} onChange={(e) => setFormData({...formData, CUSTOMER_ID: e.target.value})} readOnly={!!editingId} style={editingId ? { background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', cursor: 'not-allowed' } : {}} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>First Name</label><input required value={formData.FIRST_NAME || ''} onChange={(e) => setFormData({...formData, FIRST_NAME: e.target.value})} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Last Name</label><input required value={formData.LAST_NAME || ''} onChange={(e) => setFormData({...formData, LAST_NAME: e.target.value})} /></div>
          </div>
          <div><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Street Address</label><input required value={formData.STREET || ''} onChange={(e) => setFormData({...formData, STREET: e.target.value})} /></div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>City</label><input required value={formData.CITY || ''} onChange={(e) => setFormData({...formData, CITY: e.target.value})} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Zip Code</label><input required value={formData.ZIP_CODE || ''} onChange={(e) => setFormData({...formData, ZIP_CODE: e.target.value})} /></div>
          </div>
          <div><label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label><input required value={formData.PHONE_NUMBER || ''} onChange={(e) => setFormData({...formData, PHONE_NUMBER: e.target.value})} /></div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>{editingId ? 'Update Record' : 'Insert Record'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
