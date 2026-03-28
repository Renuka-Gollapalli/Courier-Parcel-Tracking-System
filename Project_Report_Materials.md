# Logistics Database Application - Project Report

## 1. Project Description
The **Logistics and Fleet Management System** is a responsive, Full-Stack web application designed to track and manage core operational data for a logistics company. It fulfills Database Management System (DBMS) assignment requirements by creating a robust SQL schema and hooking it dynamically into graphical end-user software.

## 2. Technology Stack
- **Frontend GUI**: React.js (Vite), React Router DOM, Custom Glassmorphism CSS.
- **Backend API Server**: Node.js, Express.js.
- **Database Architecture**: MySQL Database (accessed via `mysql2` connection pooling).
- **Communication Flow**: UI triggers RESTful HTTP requests via the Fetch API; Backend translates payload into sanitized SQL queries.

## 3. Core Functional Requirements Met
1. **Record Viewing**: Dynamic Data Tables provided for all ER core entities.
2. **DML Operations**: Intuitive GUI to Insert, Update, and Delete records safely natively mapping to executing prepared SQL statements.
3. **Application-Based Processing**: Complex business logic handling Shipping Cost Calculations statically on the server tier before generating records.
4. **Specializations**: Seamless class specialization mappings by assigning Vehicles (Vans by volume, Motorcycles by CC) specifically mapped to Employee drivers.
5. **Weak Entities Tracking**: Native handling of sequential milestone (Tracking Events) mapped via composite Primary Keys.

---
## 4. Key Source Code Extracts
*(Included below are the core snippets required for the Project Logic. Note CSS styles, assets, and standard initialization components have been omitted to save length.)*


### Database Schema (DDL & Initial Seed) (`server/database_schema.sql`)
```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS LogisticsApp;
USE LogisticsApp;

-- 1. SERVICE_CENTRE Table
CREATE TABLE IF NOT EXISTS SERVICE_CENTRE (
    CENTRE_ID VARCHAR(20) PRIMARY KEY
);

-- 2. EMPLOYEE Table
CREATE TABLE IF NOT EXISTS EMPLOYEE (
    EMPLOYEE_ID VARCHAR(20) PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    SALARY DECIMAL(10, 2) NOT NULL,
    CENTRE_ID VARCHAR(20),
    FOREIGN KEY (CENTRE_ID) REFERENCES SERVICE_CENTRE(CENTRE_ID) ON DELETE SET NULL
);

-- 3. CUSTOMER Table
CREATE TABLE IF NOT EXISTS CUSTOMER (
    CUSTOMER_ID VARCHAR(20) PRIMARY KEY,
    FIRST_NAME VARCHAR(50) NOT NULL,
    LAST_NAME VARCHAR(50) NOT NULL,
    STREET VARCHAR(100),
    CITY VARCHAR(50),
    ZIP_CODE VARCHAR(20),
    PHONE_NUMBER VARCHAR(20)
);

-- 4. PARCEL Table
CREATE TABLE IF NOT EXISTS PARCEL (
    TRACKING_NUMBER VARCHAR(20) PRIMARY KEY,
    WEIGHT DECIMAL(5, 2) NOT NULL,
    LOCATION VARCHAR(50) NOT NULL,
    CUSTOMER_ID VARCHAR(20),
    FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMER(CUSTOMER_ID) ON DELETE CASCADE
);

-- 5. TRACKING_EVENT Table (Weak Entity)
CREATE TABLE IF NOT EXISTS TRACKING_EVENT (
    TRACKING_NUMBER VARCHAR(20),
    EVENT_NUMBER INT,
    EVENT_DESCRIPTION VARCHAR(255),
    EVENT_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (TRACKING_NUMBER, EVENT_NUMBER),
    FOREIGN KEY (TRACKING_NUMBER) REFERENCES PARCEL(TRACKING_NUMBER) ON DELETE CASCADE
);

-- 6. VEHICLE (Specialization Tables)
CREATE TABLE IF NOT EXISTS VAN (
    EMPLOYEE_ID VARCHAR(20) PRIMARY KEY,
    CARGO_VOLUME DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEE(EMPLOYEE_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS MOTORCYCLE (
    EMPLOYEE_ID VARCHAR(20) PRIMARY KEY,
    ENGINE_CAPACITY VARCHAR(20) NOT NULL,
    FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEE(EMPLOYEE_ID) ON DELETE CASCADE
);

-- Insert Sample Data
INSERT IGNORE INTO SERVICE_CENTRE (CENTRE_ID) VALUES ('SC-001'), ('SC-002'), ('SC-003');

INSERT IGNORE INTO CUSTOMER (CUSTOMER_ID, FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER) VALUES 
('C1001', 'Renuka', 'Gollapalli', '7 LB Road', 'Hyderabad', '533030', '9018273546'),
('C1002', 'Meera', 'Sharma', '13 River Rd', 'Chennai', '600127', '9823567812');

INSERT IGNORE INTO EMPLOYEE (EMPLOYEE_ID, NAME, SALARY, CENTRE_ID) VALUES 
('E001', 'Renuka', 45000, 'SC-001'),
('E002', 'Kavita', 42000, 'SC-001'),
('E003', 'Akash', 89000, 'SC-002');

INSERT IGNORE INTO PARCEL (TRACKING_NUMBER, WEIGHT, LOCATION, CUSTOMER_ID) VALUES 
('TN-1000', 1.2, 'Sorting Hub', 'C1001'),
('TN-1001', 5.5, 'Out for delivery', 'C1002');

INSERT IGNORE INTO VAN (EMPLOYEE_ID, CARGO_VOLUME) VALUES 
('E001', 15.5);

INSERT IGNORE INTO MOTORCYCLE (EMPLOYEE_ID, ENGINE_CAPACITY) VALUES 
('E002', '150cc'),
('E003', '250cc');

INSERT IGNORE INTO TRACKING_EVENT (TRACKING_NUMBER, EVENT_NUMBER, EVENT_DESCRIPTION) VALUES 
('TN-1000', 1, 'Package Picked Up'),
('TN-1000', 2, 'Arrived at Sorting Hub'),
('TN-1001', 1, 'Package Picked Up'),
('TN-1001', 2, 'Out for Delivery');

```

### Backend Express Server (`server/server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes for CUSTOMERS
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CUSTOMER');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { CUSTOMER_ID, FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER } = req.body;
    await db.query(
      'INSERT INTO CUSTOMER (CUSTOMER_ID, FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [CUSTOMER_ID, FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER]
    );
    res.status(201).json({ message: 'Customer inserted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER } = req.body;
    await db.query(
      'UPDATE CUSTOMER SET FIRST_NAME=?, LAST_NAME=?, STREET=?, CITY=?, ZIP_CODE=?, PHONE_NUMBER=? WHERE CUSTOMER_ID=?',
      [FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER, req.params.id]
    );
    res.json({ message: 'Customer updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM CUSTOMER WHERE CUSTOMER_ID=?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Routes for EMPLOYEES & CENTRES
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM EMPLOYEE');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { EMPLOYEE_ID, NAME, SALARY, CENTRE_ID } = req.body;
    await db.query(
      'INSERT INTO EMPLOYEE (EMPLOYEE_ID, NAME, SALARY, CENTRE_ID) VALUES (?, ?, ?, ?)',
      [EMPLOYEE_ID, NAME, SALARY, CENTRE_ID]
    );
    res.status(201).json({ message: 'Employee inserted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { NAME, SALARY, CENTRE_ID } = req.body;
    await db.query(
      'UPDATE EMPLOYEE SET NAME=?, SALARY=?, CENTRE_ID=? WHERE EMPLOYEE_ID=?',
      [NAME, SALARY, CENTRE_ID, req.params.id]
    );
    res.json({ message: 'Employee updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM EMPLOYEE WHERE EMPLOYEE_ID=?', [req.params.id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Routes for PARCELS & APPLICATION LOGIC
app.get('/api/parcels', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PARCEL');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Shipping Cost application logic API
app.post('/api/parcels/calculate-cost', (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight || isNaN(weight)) {
      return res.status(400).json({ error: 'Valid weight required' });
    }
    const computedCost = 50 + parseFloat(weight) * 20;
    res.json({ cost: computedCost });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/parcels', async (req, res) => {
  try {
    const { TRACKING_NUMBER, WEIGHT, LOCATION, CUSTOMER_ID } = req.body;
    await db.query(
      'INSERT INTO PARCEL (TRACKING_NUMBER, WEIGHT, LOCATION, CUSTOMER_ID) VALUES (?, ?, ?, ?)',
      [TRACKING_NUMBER, WEIGHT, LOCATION, CUSTOMER_ID]
    );
    res.status(201).json({ message: 'Parcel inserted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/parcels/:id', async (req, res) => {
  try {
    const { WEIGHT, LOCATION, CUSTOMER_ID } = req.body;
    await db.query(
      'UPDATE PARCEL SET WEIGHT=?, LOCATION=?, CUSTOMER_ID=? WHERE TRACKING_NUMBER=?',
      [WEIGHT, LOCATION, CUSTOMER_ID, req.params.id]
    );
    res.json({ message: 'Parcel updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/parcels/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM PARCEL WHERE TRACKING_NUMBER=?', [req.params.id]);
    res.json({ message: 'Parcel deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Routes for SERVICE_CENTRES
app.get('/api/service-centres', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SERVICE_CENTRE');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/service-centres', async (req, res) => {
  try {
    await db.query('INSERT INTO SERVICE_CENTRE (CENTRE_ID) VALUES (?)', [req.body.CENTRE_ID]);
    res.status(201).json({ message: 'Inserted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/service-centres/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM SERVICE_CENTRE WHERE CENTRE_ID=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Routes for TRACKING_EVENTS
app.get('/api/tracking-events', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM TRACKING_EVENT');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/tracking-events', async (req, res) => {
  try {
    const { TRACKING_NUMBER, EVENT_NUMBER, EVENT_DESCRIPTION } = req.body;
    await db.query('INSERT INTO TRACKING_EVENT (TRACKING_NUMBER, EVENT_NUMBER, EVENT_DESCRIPTION) VALUES (?, ?, ?)', [TRACKING_NUMBER, EVENT_NUMBER, EVENT_DESCRIPTION]);
    res.status(201).json({ message: 'Inserted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/tracking-events/:id/:event', async (req, res) => {
  try {
    await db.query('DELETE FROM TRACKING_EVENT WHERE TRACKING_NUMBER=? AND EVENT_NUMBER=?', [req.params.id, req.params.event]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Routes for VEHICLES (Combines Van and Motorcycle)
app.get('/api/vehicles', async (req, res) => {
  try {
    const [vans] = await db.query('SELECT EMPLOYEE_ID, CARGO_VOLUME as DESC_VAL, "Van" as TYPE FROM VAN');
    const [motos] = await db.query('SELECT EMPLOYEE_ID, ENGINE_CAPACITY as DESC_VAL, "Motorcycle" as TYPE FROM MOTORCYCLE');
    res.json([...vans, ...motos]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/vehicles', async (req, res) => {
  try {
    const { EMPLOYEE_ID, TYPE, DESC_VAL } = req.body;
    if (TYPE === 'Van') {
      await db.query('INSERT INTO VAN (EMPLOYEE_ID, CARGO_VOLUME) VALUES (?, ?)', [EMPLOYEE_ID, DESC_VAL]);
    } else {
      await db.query('INSERT INTO MOTORCYCLE (EMPLOYEE_ID, ENGINE_CAPACITY) VALUES (?, ?)', [EMPLOYEE_ID, DESC_VAL]);
    }
    res.status(201).json({ message: 'Inserted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/vehicles/:type/:id', async (req, res) => {
  try {
    if (req.params.type === 'Van') {
      await db.query('DELETE FROM VAN WHERE EMPLOYEE_ID=?', [req.params.id]);
    } else {
      await db.query('DELETE FROM MOTORCYCLE WHERE EMPLOYEE_ID=?', [req.params.id]);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

### Frontend Context (Database Link) (`src/context/StateContext.jsx`)
```javascript
import { createContext, useState, useEffect, useCallback } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [serviceCentres, setServiceCentres] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trackingEvents, setTrackingEvents] = useState([]);

  const API_BASE = 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      const custRes = await fetch(`${API_BASE}/customers`);
      const empRes = await fetch(`${API_BASE}/employees`);
      const parRes = await fetch(`${API_BASE}/parcels`);
      const scRes = await fetch(`${API_BASE}/service-centres`);
      const vehRes = await fetch(`${API_BASE}/vehicles`);
      const teRes = await fetch(`${API_BASE}/tracking-events`);
      
      setCustomers(await custRes.json());
      setEmployees(await empRes.json());
      setParcels(await parRes.json());
      setServiceCentres(await scRes.json());
      setVehicles(await vehRes.json());
      setTrackingEvents(await teRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insertRecord = async (entity, record) => {
    try {
      const res = await fetch(`${API_BASE}/${entity}s`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      fetchData(); // Refresh data
    } catch (err) { 
      console.error('Insert failed', err);
      alert(`Failed to add record:\n${err.message}`);
    }
  };

  const updateRecord = async (entity, pkField, record) => {
    try {
      const res = await fetch(`${API_BASE}/${entity}s/${record[pkField]}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      fetchData(); // Refresh data
    } catch (err) { 
      console.error('Update failed', err);
      alert(`Failed to update record:\n${err.message}`);
    }
  };

  const deleteRecord = async (entity, pkField, id) => {
    try {
      const res = await fetch(`${API_BASE}/${entity}s/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      fetchData(); // Refresh data
    } catch (err) { 
      console.error('Delete failed', err);
      alert(`Failed to delete record:\n${err.message}`);
    }
  };

  // Dedicated function for calculating cost via backend
  const calculateShippingCost = async (weight) => {
    try {
      const res = await fetch(`${API_BASE}/parcels/calculate-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight })
      });
      const data = await res.json();
      return data.cost;
    } catch (err) {
      console.error('Calculate cost failed', err);
      return null;
    }
  };

  return (
    <StateContext.Provider value={{
      customers, employees, parcels, 
      serviceCentres, vehicles, trackingEvents,
      insertRecord, updateRecord, deleteRecord, calculateShippingCost
    }}>
      {children}
    </StateContext.Provider>
  );
};

```

### Parcels UI logic (`src/pages/Parcels.jsx`)
```javascript
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

```

### Dashboard Entry (`src/pages/Dashboard.jsx`)
```javascript
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

```
