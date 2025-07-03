import React, { useEffect, useState } from 'react';
import { useHeader } from '../context/HeaderContext';

const API_URL = 'http://localhost:4000/api/recruitment';
const DEPT_URL = 'http://localhost:4000/api/departments';
const DESIG_URL = 'http://localhost:4000/api/designations';

export default function Recruitment() {
  const { updateHeader } = useHeader();
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({
    designation: '', department: '', status: 'Open', postedAt: '', closedAt: '', numberOfPosts: 1
  });
  const [formError, setFormError] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs');
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

  useEffect(() => {
    updateHeader('Recruitment');
  }, [updateHeader]);

  useEffect(() => { fetchJobs(); fetchDepartments(); fetchDesignations(); }, []);

  const openAddModal = () => {
    setEditJob(null);
    setForm({ designation: '', department: '', status: 'Open', postedAt: '', closedAt: '', numberOfPosts: 1 });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditJob(job);
    setForm({ ...job, postedAt: job.postedAt ? job.postedAt.split('T')[0] : '', closedAt: job.closedAt ? job.closedAt.split('T')[0] : '', numberOfPosts: job.numberOfPosts || 1 });
    setFormError('');
    setShowModal(true);
  };

  const openViewModal = (job) => {
    setViewJob(job);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditJob(null);
    setForm({ designation: '', department: '', status: 'Open', postedAt: '', closedAt: '', numberOfPosts: 1 });
    setFormError('');
  };

  const closeViewModal = () => {
    setViewJob(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.designation.trim()) return setFormError('Designation is required');
    if (!form.department.trim()) return setFormError('Department is required');
    if (!form.status.trim()) return setFormError('Status is required');
    if (!form.numberOfPosts || isNaN(form.numberOfPosts) || form.numberOfPosts < 1) return setFormError('Number of posts must be at least 1');
    try {
      const method = editJob ? 'PUT' : 'POST';
      const url = editJob ? `${API_URL}/${editJob.id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save job');
      await fetchJobs();
      setSuccess(editJob ? 'Job updated successfully!' : 'Job posted successfully!');
      closeModal();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
      await fetchJobs();
      setSuccess('Job deleted successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-base-100 to-base-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <button className="btn btn-neutral shadow-md" onClick={openAddModal}>Post Job</button>
          </div>
        </div>
        {error && <div className="alert alert-error mb-4 shadow-lg border border-error/30 bg-base-200/80 text-error-content">{error}</div>}
        {success && <div className="alert alert-success mb-4 shadow-lg border border-success/30 bg-base-200/80 text-success-content">{success}</div>}
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-base-300 bg-base-200/80 backdrop-blur-md">
          <table className="table table-zebra w-full text-base-content">
            <thead className="sticky top-0 bg-base-200/90 backdrop-blur-md z-10">
              <tr>
                <th className="font-semibold">Designation</th>
                <th className="font-semibold">Department</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold">Posts</th>
                <th className="font-semibold">Posted</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/70">Loading...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-base-content/70">No job postings found.</td></tr>
              ) : jobs.map(job => (
                <tr key={job.id} className="hover:bg-base-300/40 transition-colors">
                  <td>{job.designation}</td>
                  <td>{job.department}</td>
                  <td>
                    <span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-error'} shadow-sm`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.numberOfPosts || 1}</td>
                  <td>{job.postedAt ? job.postedAt.split('T')[0] : '-'}</td>
                  <td>
                    <button className="btn btn-xs btn-outline btn-info mr-2 shadow-sm" onClick={() => openViewModal(job)}>View</button>
                    <button className="btn btn-xs btn-outline btn-warning mr-2 shadow-sm" onClick={() => openEditModal(job)}>Edit</button>
                    <button className="btn btn-xs btn-outline btn-error shadow-sm" onClick={() => handleDelete(job.id)}>Delete</button>
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
                <h2 className="text-lg sm:text-xl font-bold text-primary">{editJob ? 'Edit' : 'Post'} Job</h2>
                <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={closeModal}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {formError && <div className="alert alert-error mb-4 text-sm shadow border border-error/30 bg-base-100/80 text-error-content">{formError}</div>}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Designation</span>
                    </label>
                    <select name="designation" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.designation} onChange={handleChange} required>
                      <option value="">Select Designation</option>
                      {designations.map(d => (
                        <option key={d.id} value={d.title}>{d.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Department</span>
                    </label>
                    <select name="department" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.department} onChange={handleChange} required>
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Status</span>
                    </label>
                    <select name="status" className="select select-bordered select-sm sm:select-md bg-base-100 text-primary" value={form.status} onChange={handleChange} required>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Number of Posts</span>
                    </label>
                    <input name="numberOfPosts" type="number" min="1" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.numberOfPosts} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Posted At</span>
                    </label>
                    <input name="postedAt" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.postedAt} onChange={handleChange} />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Closed At</span>
                    </label>
                    <input name="closedAt" type="date" className="input input-bordered input-sm sm:input-md bg-base-100 text-primary" value={form.closedAt} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-4 border-t border-base-300">
                <button type="button" className="btn btn-ghost btn-sm sm:btn-md order-2 sm:order-1" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-neutral btn-sm sm:btn-md order-1 sm:order-2 shadow">{editJob ? 'Update' : 'Post'}</button>
              </div>
            </form>
          </div>
        )}
        {/* Modal for View */}
        {viewJob && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all" onClick={closeViewModal} />
            <div className="card w-full max-w-lg bg-base-200/90 shadow-2xl p-4 sm:p-6 lg:p-8 border border-base-300 rounded-2xl relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-primary">Job Details</h2>
                <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={closeViewModal}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3 text-base-content">
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Designation:</span>
                  <span>{viewJob.designation}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Department:</span>
                  <span>{viewJob.department}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Status:</span>
                  <span className={`badge ${viewJob.status === 'Open' ? 'badge-success' : 'badge-error'} shadow-sm`}>
                    {viewJob.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Number of Posts:</span>
                  <span>{viewJob.numberOfPosts || 1}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Posted At:</span>
                  <span>{viewJob.postedAt ? viewJob.postedAt.split('T')[0] : '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Closed At:</span>
                  <span>{viewJob.closedAt ? viewJob.closedAt.split('T')[0] : '-'}</span>
                </div>
              </div>
              <div className="flex justify-end mt-6 pt-4 border-t border-base-300">
                <button className="btn btn-neutral shadow" onClick={closeViewModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 