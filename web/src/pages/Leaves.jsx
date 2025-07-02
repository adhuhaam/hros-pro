import React from 'react';

export default function Leaves() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-primary">Leave Requests</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Search leaves..." className="input input-bordered w-48" />
          <button className="btn btn-primary">Apply Leave</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow border border-base-300 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows, replace with dynamic data */}
            <tr>
              <td>Jane Doe</td>
              <td>Sick</td>
              <td>2024-07-01</td>
              <td>2024-07-03</td>
              <td><span className="badge badge-warning">Pending</span></td>
              <td>
                <button className="btn btn-xs btn-outline btn-success mr-2">Approve</button>
                <button className="btn btn-xs btn-outline btn-error">Reject</button>
              </td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>Casual</td>
              <td>2024-07-05</td>
              <td>2024-07-06</td>
              <td><span className="badge badge-success">Approved</span></td>
              <td>
                <button className="btn btn-xs btn-outline btn-info">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 