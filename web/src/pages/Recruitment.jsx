import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/recruitment';
const DEPT_URL = 'http://localhost:4000/api/departments';
const DESIG_URL = 'http://localhost:4000/api/designations';

export default function Recruitment() {
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
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-primary">Recruitment</h1>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={openAddModal}>Post Job</button>
        </div>
      </div>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}
      <div className="overflow-x-auto rounded-xl shadow border border-base-300 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Designation</th>
              <th>Department</th>
              <th>Status</th>
              <th>Posts</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center">Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={6} className="text-center">No job postings found.</td></tr>
            ) : jobs.map(job => (
              <tr key={job.id}>
                <td>{job.designation}</td>
                <td>{job.department}</td>
                <td><span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-error'}`}>{job.status}</span></td>
                <td>{job.numberOfPosts || 1}</td>
                <td>{job.postedAt ? job.postedAt.split('T')[0] : '-'}</td>
                <td>
                  <button className="btn btn-xs btn-outline btn-info mr-2" onClick={() => openViewModal(job)}>View</button>
                  <button className="btn btn-xs btn-outline btn-warning mr-2" onClick={() => openEditModal(job)}>Edit</button>
                  <button className="btn btn-xs btn-outline btn-error" onClick={() => handleDelete(job.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-base-200/80 backdrop-blur-md transition-all" />
          <form className="card w-full max-w-lg bg-base-100 shadow-2xl p-8 border border-base-300 rounded-2xl relative z-10" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">{editJob ? 'Edit' : 'Post'} Job</h2>
            {formError && <div className="alert alert-error mb-4">{formError}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Designation</label>
                <select name="designation" className="select select-bordered" value={form.designation} onChange={handleChange} required>
                  <option value="">Select Designation</option>
                  {designations.map(d => (
                    <option key={d.id} value={d.title}>{d.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">Department</label>
                <select name="department" className="select select-bordered" value={form.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">Status</label>
                <select name="status" className="select select-bordered" value={form.status} onChange={handleChange} required>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">Number of Posts</label>
                <input name="numberOfPosts" type="number" min="1" className="input input-bordered" value={form.numberOfPosts} onChange={handleChange} required />
              </div>
              <div className="form-control">
                <label className="label">Posted At</label>
                <input name="postedAt" type="date" className="input input-bordered" value={form.postedAt} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label className="label">Closed At</label>
                <input name="closedAt" type="date" className="input input-bordered" value={form.closedAt} onChange={handleChange} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-neutral">{editJob ? 'Update' : 'Post'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Modal for View */}
      {viewJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="card w-full max-w-lg bg-base-100 shadow-xl p-8 border border-base-300">
            <h2 className="text-xl font-bold mb-4">Job Details</h2>
            <div className="mb-2"><b>Designation:</b> {viewJob.designation}</div>
            <div className="mb-2"><b>Department:</b> {viewJob.department}</div>
            <div className="mb-2"><b>Status:</b> {viewJob.status}</div>
            <div className="mb-2"><b>Number of Posts:</b> {viewJob.numberOfPosts || 1}</div>
            <div className="mb-2"><b>Posted At:</b> {viewJob.postedAt ? viewJob.postedAt.split('T')[0] : '-'}</div>
            <div className="mb-2"><b>Closed At:</b> {viewJob.closedAt ? viewJob.closedAt.split('T')[0] : '-'}</div>
            <div className="flex justify-end mt-6">
              <button className="btn btn-ghost" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 