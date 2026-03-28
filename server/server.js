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
