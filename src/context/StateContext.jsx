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
