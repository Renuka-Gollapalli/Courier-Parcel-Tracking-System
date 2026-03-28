import { useState, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Calculator } from 'lucide-react';

const Parcels = () => {
  const { parcels, customers, insertRecord, updateRecord, deleteRecord } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [computedCost, setComputedCost] = useState(null);

  const columns = [
    { key: 'TRACKING_NUMBER', label: 'Tracking No.' },
    { key: 'WEIGHT', label: 'Weight (KG)' },
    { key: 'LOCATION', label: 'Status/Location' },
    { key: 'CUSTOMER_ID', label: 'Customer ID' }
  ];

  const handleOpenModal = (record = null) => {
    setComputedCost(null);
    if (record) {
      setFormData(record);
      setEditingId(record.TRACKING_NUMBER);
    } else {
      setFormData({
        TRACKING_NUMBER: `TN-10${parcels.length + 10}`,
        WEIGHT: '', LOCATION: 'Sorting Hub', CUSTOMER_ID: customers.length > 0 ? customers[0].CUSTOMER_ID : ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const calculateCost = () => {
    if (!formData.WEIGHT || isNaN(formData.WEIGHT)) return;
    const weight = parseFloat(formData.WEIGHT);
    // Base fee: 50 INR, 20 INR per KG
    const cost = 50 + (weight * 20);
    setComputedCost(cost.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateRecord('parcel', 'TRACKING_NUMBER', formData);
    } else {
      insertRecord('parcel', formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm('Delete parcel ' + record.TRACKING_NUMBER + '?')) {
      deleteRecord('parcel', 'TRACKING_NUMBER', record.TRACKING_NUMBER);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Parcels Management</h1>
          <p>Track shipments, update locations, and calculate shipping costs.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}><Plus size={20} /> Add Parcel</button>
      </div>

      <DataTable 
        title="Active Parcels"
        columns={columns} 
        data={parcels} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Parcel' : 'Add New Parcel'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tracking Number</label>
            <input required name="TRACKING_NUMBER" value={formData.TRACKING_NUMBER || ''} onChange={(e) => setFormData({...formData, TRACKING_NUMBER: e.target.value})} readOnly={!!editingId} style={editingId ? { background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', cursor: 'not-allowed' } : {}} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Customer ID (Sender)</label>
            <select required value={formData.CUSTOMER_ID || ''} onChange={(e) => setFormData({...formData, CUSTOMER_ID: e.target.value})}>
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.CUSTOMER_ID} value={c.CUSTOMER_ID}>{c.CUSTOMER_ID} - {c.FIRST_NAME} {c.LAST_NAME}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Weight (KG)</label>
              <input required type="number" step="0.1" value={formData.WEIGHT || ''} onChange={(e) => {
                setFormData({...formData, WEIGHT: e.target.value});
                setComputedCost(null); // Reset cost if weight changes
              }} />
            </div>
            <button type="button" className="btn-icon" onClick={calculateCost} title="Calculate Shipping Cost" style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <Calculator size={20} /> Calculate
            </button>
          </div>

          {/* Application Based Processing Logic display */}
          {computedCost !== null && (
            <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: 'var(--success)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Estimated Shipping Bill:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{computedCost}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status / Location</label>
            <select required value={formData.LOCATION || ''} onChange={(e) => setFormData({...formData, LOCATION: e.target.value})}>
              <option value="Sorting Hub">Sorting Hub</option>
              <option value="Picked up">Picked up</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Received at Centre">Received at Centre</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>{editingId ? 'Update Parcel' : 'Insert Parcel'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Parcels;
