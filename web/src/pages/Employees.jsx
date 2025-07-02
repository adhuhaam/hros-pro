import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/employees';
const DEPT_URL = 'http://localhost:4000/api/departments';
const DESIG_URL = 'http://localhost:4000/api/designations';

function validate(form) {
  if (!form.fullName.trim()) return 'Full name is required';
  if (!form.email.trim()) return 'Email is required';
  // Simple email regex
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email format';
  return '';
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', dob: '', departmentId: '', designationId: '', dateOfJoining: ''
  });
  const [formError, setFormError] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(DEPT_URL);
      const data = await res.json();
      setDepartments(data);
    } catch {}
  };

  const fetchDesignations = async () => {
    try {
      const res = await fetch(DESIG_URL);
      const data = await res.json();
      setDesignations(data);
    } catch {}
  };

  useEffect(() => { fetchEmployees(); fetchDepartments(); fetchDesignations(); }, []);

  const openAddModal = () => {
    setEditEmployee(null);
    setForm({ fullName: '', email: '', phone: '', address: '', dob: '', departmentId: '', designationId: '', dateOfJoining: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditEmployee(emp);
    setForm({ 
      ...emp, 
      fullName: emp.fullName || '',
      dob: emp.dob ? emp.dob.split('T')[0] : '', 
      dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '', 
      departmentId: emp.departmentId || '', 
      designationId: emp.designationId || '' 
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditEmployee(null);
    setForm({ fullName: '', email: '', phone: '', address: '', dob: '', departmentId: '', designationId: '', dateOfJoining: '' });
    setFormError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMsg = validate(form);
    if (validationMsg) {
      setFormError(validationMsg);
      return;
    }
    try {
      const method = editEmployee ? 'PUT' : 'POST';
      const url = editEmployee ? `${API_URL}/${editEmployee.id}` : API_URL;
      const employeeData = {
        ...form
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });
      if (!res.ok) throw new Error('Failed to save employee');
      await fetchEmployees();
      setSuccess(editEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
      closeModal();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete employee');
      await fetchEmployees();
      setSuccess('Employee deleted successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-primary">
      <div className="max-w-7xl mx-auto py-10 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Employees</h1>
          <div className="flex gap-2">
            <button className="btn btn-neutral shadow-md" onClick={openAddModal}>Add Employee</button>
          </div>
        </div>
        {error && <div className="alert alert-error mb-4 shadow-lg border border-error/30 bg-base-200/80 text-error-content">{error}</div>}
        {success && <div className="alert alert-success mb-4 shadow-lg border border-success/30 bg-base-200/80 text-success-content">{success}</div>}
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-base-300 bg-base-200/80 backdrop-blur-md">
          <table className="table table-zebra w-full text-base-content">
            <thead className="sticky top-0 bg-base-200/90 backdrop-blur-md z-10">
              <tr>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Email</th>
                <th className="font-semibold">Phone</th>
                <th className="font-semibold">Department</th>
                <th className="font-semibold">Designation</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/70">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/70">No employees found.</td></tr>
              ) : employees.map(emp => (
                <tr key={emp.id} className="hover:bg-base-300/40 transition-colors">
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone || '-'}</td>
                  <td>{emp.department?.name || '-'}</td>
                  <td>{emp.designation?.title || '-'}</td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info mr-2" onClick={() => openEditModal(emp)}>Edit</button>
                    <button className="btn btn-xs btn-outline btn-error" onClick={() => handleDelete(emp.id)}>Delete</button>
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
                <h2 className="text-lg sm:text-xl font-bold text-primary">{editEmployee ? 'Edit' : 'Add'} Employee</h2>
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
                    <span className="label-text text-sm font-medium">Full Name</span>
                  </label>
                  <input name="fullName" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Email</span>
                    </label>
                    <input name="email" type="email" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Phone</span>
                    </label>
                    <input name="phone" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-medium">Address</span>
                  </label>
                  <input name="address" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.address} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Date of Birth</span>
                    </label>
                    <input name="dob" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.dob} onChange={handleChange} />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Date of Joining</span>
                    </label>
                    <input name="dateOfJoining" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.dateOfJoining} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Department</span>
                    </label>
                    <select name="departmentId" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.departmentId} onChange={handleChange} required>
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Designation</span>
                    </label>
                    <select name="designationId" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.designationId} onChange={handleChange} required>
                      <option value="">Select Designation</option>
                      {designations.map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-4 border-t border-base-300">
                <button type="button" className="btn btn-ghost btn-sm sm:btn-md order-2 sm:order-1" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-neutral btn-sm sm:btn-md order-1 sm:order-2 shadow">{editEmployee ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 