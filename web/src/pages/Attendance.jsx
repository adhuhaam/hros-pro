import React, { useEffect, useState } from 'react';
import { useHeader } from '../context/HeaderContext';

export default function Attendance() {
  const { updateHeader } = useHeader();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState({
    employeeName: '', date: '', checkIn: '', checkOut: '', status: 'Present'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    updateHeader('Attendance Management');
  }, [updateHeader]);

  useEffect(() => {
    // Simulate fetching attendance data
    setTimeout(() => {
      setAttendance([
        { id: 1, employeeName: 'John Doe', date: '2024-01-15', checkIn: '09:00', checkOut: '17:00', status: 'Present' },
        { id: 2, employeeName: 'Jane Smith', date: '2024-01-15', checkIn: '08:45', checkOut: '17:30', status: 'Present' },
        { id: 3, employeeName: 'Mike Johnson', date: '2024-01-15', checkIn: '10:00', checkOut: '16:00', status: 'Late' },
        { id: 4, employeeName: 'Sarah Wilson', date: '2024-01-15', checkIn: '-', checkOut: '-', status: 'Absent' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const openAddModal = () => {
    setEditRecord(null);
    setForm({ employeeName: '', date: '', checkIn: '', checkOut: '', status: 'Present' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditRecord(record);
    setForm({ ...record });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRecord(null);
    setForm({ employeeName: '', date: '', checkIn: '', checkOut: '', status: 'Present' });
    setFormError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeName.trim()) return setFormError('Employee name is required');
    if (!form.date) return setFormError('Date is required');
    if (!form.status.trim()) return setFormError('Status is required');
    
    try {
      if (editRecord) {
        // Update existing record
        setAttendance(attendance.map(a => a.id === editRecord.id ? { ...form, id: editRecord.id } : a));
        setSuccess('Attendance record updated successfully!');
      } else {
        // Add new record
        const newRecord = { ...form, id: Date.now() };
        setAttendance([newRecord, ...attendance]);
        setSuccess('Attendance record added successfully!');
      }
      closeModal();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    setAttendance(attendance.filter(a => a.id !== id));
    setSuccess('Attendance record deleted successfully!');
    setTimeout(() => setSuccess(''), 2500);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Present': 'badge-success',
      'Late': 'badge-warning',
      'Absent': 'badge-error',
      'Half Day': 'badge-info'
    };
    return `badge ${badges[status] || 'badge-neutral'}`;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-base-100 to-base-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <button className="btn btn-neutral shadow-md" onClick={openAddModal}>Add Record</button>
          </div>
        </div>
        
        {error && <div className="alert alert-error mb-4 shadow-lg border border-error/30 bg-base-200/80 text-error-content">{error}</div>}
        {success && <div className="alert alert-success mb-4 shadow-lg border border-success/30 bg-base-200/80 text-success-content">{success}</div>}
        
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-base-300 bg-base-200/80 backdrop-blur-md">
          <table className="table table-zebra w-full text-base-content">
            <thead className="sticky top-0 bg-base-200/90 backdrop-blur-md z-10">
              <tr>
                <th className="font-semibold">Employee</th>
                <th className="font-semibold">Date</th>
                <th className="font-semibold">Check In</th>
                <th className="font-semibold">Check Out</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/70">Loading...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/70">No attendance records found.</td></tr>
              ) : attendance.map(record => (
                <tr key={record.id} className="hover:bg-base-300/40 transition-colors">
                  <td>{record.employeeName}</td>
                  <td>{record.date}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>
                    <span className={`${getStatusBadge(record.status)} shadow-sm`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info mr-2" onClick={() => openEditModal(record)}>Edit</button>
                    <button className="btn btn-xs btn-outline btn-error" onClick={() => handleDelete(record.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all" onClick={closeModal} />
            <form className="card w-full max-w-lg bg-base-200/90 shadow-2xl p-4 sm:p-6 lg:p-8 border border-base-300 rounded-2xl relative z-10 max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-primary">{editRecord ? 'Edit' : 'Add'} Attendance Record</h2>
                <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={closeModal}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {formError && <div className="alert alert-error mb-4 text-sm shadow border border-error/30 bg-base-100/80 text-error-content">{formError}</div>}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Employee Name</span>
                  </label>
                  <input name="employeeName" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.employeeName} onChange={handleChange} required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Date</span>
                  </label>
                  <input name="date" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.date} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Check In</span>
                    </label>
                    <input name="checkIn" type="time" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.checkIn} onChange={handleChange} />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Check Out</span>
                    </label>
                    <input name="checkOut" type="time" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.checkOut} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Status</span>
                  </label>
                  <select name="status" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.status} onChange={handleChange} required>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn btn-primary flex-1 shadow-md">
                    {editRecord ? 'Update' : 'Add'} Record
                  </button>
                  <button type="button" className="btn btn-ghost flex-1" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 