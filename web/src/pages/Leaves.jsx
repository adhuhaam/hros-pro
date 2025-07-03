import React, { useEffect, useState } from 'react';
import { useHeader } from '../context/HeaderContext';

export default function Leaves() {
  const { updateHeader } = useHeader();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [form, setForm] = useState({
    employeeName: '', leaveType: '', startDate: '', endDate: '', reason: '', status: 'Pending'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    updateHeader('Leave Management');
  }, [updateHeader]);

  useEffect(() => {
    // Simulate fetching leaves data
    setTimeout(() => {
      setLeaves([
        { id: 1, employeeName: 'John Doe', leaveType: 'Sick Leave', startDate: '2024-01-15', endDate: '2024-01-17', reason: 'Not feeling well', status: 'Approved' },
        { id: 2, employeeName: 'Jane Smith', leaveType: 'Annual Leave', startDate: '2024-02-01', endDate: '2024-02-05', reason: 'Family vacation', status: 'Pending' },
        { id: 3, employeeName: 'Mike Johnson', leaveType: 'Personal Leave', startDate: '2024-01-20', endDate: '2024-01-20', reason: 'Personal appointment', status: 'Rejected' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const openAddModal = () => {
    setEditLeave(null);
    setForm({ employeeName: '', leaveType: '', startDate: '', endDate: '', reason: '', status: 'Pending' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (leave) => {
    setEditLeave(leave);
    setForm({ ...leave });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditLeave(null);
    setForm({ employeeName: '', leaveType: '', startDate: '', endDate: '', reason: '', status: 'Pending' });
    setFormError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeName.trim()) return setFormError('Employee name is required');
    if (!form.leaveType.trim()) return setFormError('Leave type is required');
    if (!form.startDate) return setFormError('Start date is required');
    if (!form.endDate) return setFormError('End date is required');
    if (!form.reason.trim()) return setFormError('Reason is required');
    
    try {
      if (editLeave) {
        // Update existing leave
        setLeaves(leaves.map(l => l.id === editLeave.id ? { ...form, id: editLeave.id } : l));
        setSuccess('Leave updated successfully!');
      } else {
        // Add new leave
        const newLeave = { ...form, id: Date.now() };
        setLeaves([newLeave, ...leaves]);
        setSuccess('Leave request submitted successfully!');
      }
      closeModal();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this leave request?')) return;
    setLeaves(leaves.filter(l => l.id !== id));
    setSuccess('Leave request deleted successfully!');
    setTimeout(() => setSuccess(''), 2500);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-warning',
      'Approved': 'badge-success',
      'Rejected': 'badge-error'
    };
    return `badge ${badges[status] || 'badge-neutral'}`;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-base-100 to-base-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <button className="btn btn-neutral shadow-md" onClick={openAddModal}>Request Leave</button>
          </div>
        </div>
        
        {error && <div className="alert alert-error mb-4 shadow-lg border border-error/30 bg-base-200/80 text-error-content">{error}</div>}
        {success && <div className="alert alert-success mb-4 shadow-lg border border-success/30 bg-base-200/80 text-success-content">{success}</div>}
        
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-base-300 bg-base-200/80 backdrop-blur-md">
          <table className="table table-zebra w-full text-base-content">
            <thead className="sticky top-0 bg-base-200/90 backdrop-blur-md z-10">
              <tr>
                <th className="font-semibold">Employee</th>
                <th className="font-semibold">Leave Type</th>
                <th className="font-semibold">Start Date</th>
                <th className="font-semibold">End Date</th>
                <th className="font-semibold">Reason</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-base-content/70">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-base-content/70">No leave requests found.</td></tr>
              ) : leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-base-300/40 transition-colors">
                  <td>{leave.employeeName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td className="max-w-xs truncate">{leave.reason}</td>
                  <td>
                    <span className={`${getStatusBadge(leave.status)} shadow-sm`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info mr-2" onClick={() => openEditModal(leave)}>Edit</button>
                    <button className="btn btn-xs btn-outline btn-error" onClick={() => handleDelete(leave.id)}>Delete</button>
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
                <h2 className="text-lg sm:text-xl font-bold text-primary">{editLeave ? 'Edit' : 'Request'} Leave</h2>
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
                    <span className="label-text text-sm font-medium">Leave Type</span>
                  </label>
                  <select name="leaveType" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.leaveType} onChange={handleChange} required>
                    <option value="">Select Leave Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Start Date</span>
                    </label>
                    <input name="startDate" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.startDate} onChange={handleChange} required />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">End Date</span>
                    </label>
                    <input name="endDate" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.endDate} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Reason</span>
                  </label>
                  <textarea name="reason" className="textarea textarea-bordered textarea-sm sm:textarea-md bg-base-100 text-primary" rows="3" value={form.reason} onChange={handleChange} required></textarea>
                </div>
                {editLeave && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Status</span>
                    </label>
                    <select name="status" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.status} onChange={handleChange} required>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn btn-primary flex-1 shadow-md">
                    {editLeave ? 'Update' : 'Submit'} Request
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