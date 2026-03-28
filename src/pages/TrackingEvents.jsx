import { useState, useContext } from 'react';
import { StateContext } from '../context/StateContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const TrackingEvents = () => {
  const { trackingEvents, parcels, insertRecord, deleteRecord } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const columns = [
    { key: 'TRACKING_NUMBER', label: 'Parcel Tracking No.' },
    { key: 'EVENT_NUMBER', label: 'Event #' },
    { key: 'EVENT_DESCRIPTION', label: 'Description' },
    { key: 'EVENT_TIME', label: 'Timestamp' }
  ];

  const handleOpenModal = () => {
    setFormData({ TRACKING_NUMBER: '', EVENT_NUMBER: '', EVENT_DESCRIPTION: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    insertRecord('tracking-event', formData);
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    if (window.confirm('Delete event ' + record.EVENT_NUMBER + ' for parcel ' + record.TRACKING_NUMBER + '?')) {
      deleteRecord(`tracking-event/${record.TRACKING_NUMBER}`, 'EVENT_NUMBER', record.EVENT_NUMBER);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Tracking Events</h1>
          <p>Log milestone events for individual parcels in transit.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenModal}><Plus size={20} /> Log Event</button>
      </div>

      <DataTable 
        title="Event History"
        columns={columns} 
        data={trackingEvents || []} 
        onEdit={() => { alert("Updates not logically supported for events. Please delete and re-insert."); }} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Tracking Event">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Parcel Tracking Number</label>
            <select required value={formData.TRACKING_NUMBER || ''} onChange={(e) => setFormData({...formData, TRACKING_NUMBER: e.target.value})}>
              <option value="">Select Parcel</option>
              {parcels.map(p => <option key={p.TRACKING_NUMBER} value={p.TRACKING_NUMBER}>{p.TRACKING_NUMBER}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Event Sequence Number</label>
            <input required type="number" min="1" value={formData.EVENT_NUMBER || ''} onChange={(e) => setFormData({...formData, EVENT_NUMBER: e.target.value})} placeholder="e.g. 1" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Event Description</label>
            <input required value={formData.EVENT_DESCRIPTION || ''} onChange={(e) => setFormData({...formData, EVENT_DESCRIPTION: e.target.value})} placeholder="e.g. Arrived at Sorting Facility" />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>Record Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default TrackingEvents;
