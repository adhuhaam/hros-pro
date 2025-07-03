import React, { useEffect, useState } from 'react';
import { useHeader } from '../context/HeaderContext';

export default function Payroll() {
  const { updateHeader } = useHeader();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPayroll, setEditPayroll] = useState(null);
  const [form, setForm] = useState({
    employeeName: '', month: '', year: '', basicSalary: '', allowances: '', deductions: '', netSalary: '', status: 'Pending'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    updateHeader('Payroll Management');
  }, [updateHeader]);

  useEffect(() => {
    // Simulate fetching payroll data
    setTimeout(() => {
      setPayrolls([
        { id: 1, employeeName: 'John Doe', month: 'January', year: '2024', basicSalary: 5000, allowances: 500, deductions: 200, netSalary: 5300, status: 'Paid' },
        { id: 2, employeeName: 'Jane Smith', month: 'January', year: '2024', basicSalary: 4500, allowances: 400, deductions: 150, netSalary: 4750, status: 'Paid' },
        { id: 3, employeeName: 'Mike Johnson', month: 'January', year: '2024', basicSalary: 6000, allowances: 600, deductions: 300, netSalary: 6300, status: 'Pending' },
        { id: 4, employeeName: 'Sarah Wilson', month: 'January', year: '2024', basicSalary: 5500, allowances: 550, deductions: 250, netSalary: 5800, status: 'Processing' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const openAddModal = () => {
    setEditPayroll(null);
    setForm({ employeeName: '', month: '', year: '', basicSalary: '', allowances: '', deductions: '', netSalary: '', status: 'Pending' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (payroll) => {
    setEditPayroll(payroll);
    setForm({ ...payroll });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditPayroll(null);
    setForm({ employeeName: '', month: '', year: '', basicSalary: '', allowances: '', deductions: '', netSalary: '', status: 'Pending' });
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate net salary
      if (name === 'basicSalary' || name === 'allowances' || name === 'deductions') {
        const basic = parseFloat(updated.basicSalary) || 0;
        const allowances = parseFloat(updated.allowances) || 0;
        const deductions = parseFloat(updated.deductions) || 0;
        updated.netSalary = (basic + allowances - deductions).toFixed(2);
      }
      return updated;
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeName.trim()) return setFormError('Employee name is required');
    if (!form.month.trim()) return setFormError('Month is required');
    if (!form.year.trim()) return setFormError('Year is required');
    if (!form.basicSalary || parseFloat(form.basicSalary) <= 0) return setFormError('Basic salary must be greater than 0');
    
    try {
      if (editPayroll) {
        // Update existing payroll
        setPayrolls(payrolls.map(p => p.id === editPayroll.id ? { ...form, id: editPayroll.id } : p));
        setSuccess('Payroll record updated successfully!');
      } else {
        // Add new payroll
        const newPayroll = { ...form, id: Date.now() };
        setPayrolls([newPayroll, ...payrolls]);
        setSuccess('Payroll record added successfully!');
      }
      closeModal();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this payroll record?')) return;
    setPayrolls(payrolls.filter(p => p.id !== id));
    setSuccess('Payroll record deleted successfully!');
    setTimeout(() => setSuccess(''), 2500);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-warning',
      'Processing': 'badge-info',
      'Paid': 'badge-success',
      'Failed': 'badge-error'
    };
    return `badge ${badges[status] || 'badge-neutral'}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-base-100 to-base-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <button className="btn btn-neutral shadow-md" onClick={openAddModal}>Generate Payroll</button>
          </div>
        </div>
        
        {error && <div className="alert alert-error mb-4 shadow-lg border border-error/30 bg-base-200/80 text-error-content">{error}</div>}
        {success && <div className="alert alert-success mb-4 shadow-lg border border-success/30 bg-base-200/80 text-success-content">{success}</div>}
        
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-base-300 bg-base-200/80 backdrop-blur-md">
          <table className="table table-zebra w-full text-base-content">
            <thead className="sticky top-0 bg-base-200/90 backdrop-blur-md z-10">
              <tr>
                <th className="font-semibold">Employee</th>
                <th className="font-semibold">Period</th>
                <th className="font-semibold">Basic Salary</th>
                <th className="font-semibold">Allowances</th>
                <th className="font-semibold">Deductions</th>
                <th className="font-semibold">Net Salary</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-base-content/70">Loading...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-base-content/70">No payroll records found.</td></tr>
              ) : payrolls.map(payroll => (
                <tr key={payroll.id} className="hover:bg-base-300/40 transition-colors">
                  <td>{payroll.employeeName}</td>
                  <td>{payroll.month} {payroll.year}</td>
                  <td className="font-medium">{formatCurrency(payroll.basicSalary)}</td>
                  <td className="text-success">{formatCurrency(payroll.allowances)}</td>
                  <td className="text-error">{formatCurrency(payroll.deductions)}</td>
                  <td className="font-bold text-primary">{formatCurrency(payroll.netSalary)}</td>
                  <td>
                    <span className={`${getStatusBadge(payroll.status)} shadow-sm`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info mr-2" onClick={() => openEditModal(payroll)}>Edit</button>
                    <button className="btn btn-xs btn-outline btn-error" onClick={() => handleDelete(payroll.id)}>Delete</button>
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
                <h2 className="text-lg sm:text-xl font-bold text-primary">{editPayroll ? 'Edit' : 'Generate'} Payroll</h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Month</span>
                    </label>
                    <select name="month" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.month} onChange={handleChange} required>
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Year</span>
                    </label>
                    <input name="year" type="number" min="2020" max="2030" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.year} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Basic Salary</span>
                    </label>
                    <input name="basicSalary" type="number" step="0.01" min="0" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.basicSalary} onChange={handleChange} required />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Allowances</span>
                    </label>
                    <input name="allowances" type="number" step="0.01" min="0" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.allowances} onChange={handleChange} />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Deductions</span>
                    </label>
                    <input name="deductions" type="number" step="0.01" min="0" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.deductions} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Net Salary</span>
                  </label>
                  <input name="netSalary" type="number" step="0.01" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary font-bold" value={form.netSalary} readOnly />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Status</span>
                  </label>
                  <select name="status" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.status} onChange={handleChange} required>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn btn-primary flex-1 shadow-md">
                    {editPayroll ? 'Update' : 'Generate'} Payroll
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