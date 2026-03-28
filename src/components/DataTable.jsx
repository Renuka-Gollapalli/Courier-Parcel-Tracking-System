import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Edit2, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Navigation handlers
  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goToPrev = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{col.label}</th>
              ))}
              <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '1rem 0.5rem' }}>{row[col.key]}</td>
                ))}
                <td style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn-icon" onClick={() => onEdit(row)} title="Edit"><Edit2 size={18} /></button>
                  <button className="btn-icon" onClick={() => onDelete(row)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
        <div>
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} records
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-icon" onClick={goToFirst} disabled={currentPage === 1} title="First Record"><ChevronsLeft size={20} /></button>
          <button className="btn-icon" onClick={goToPrev} disabled={currentPage === 1} title="Previous"><ChevronLeft size={20} /></button>
          <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-hover)', borderRadius: '8px', color: 'white' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button className="btn-icon" onClick={goToNext} disabled={currentPage === totalPages} title="Next"><ChevronRight size={20} /></button>
          <button className="btn-icon" onClick={goToLast} disabled={currentPage === totalPages} title="Last Record"><ChevronsRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
