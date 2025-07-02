import React from 'react';

export default function Payroll() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-primary">Payroll</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Search payroll..." className="input input-bordered w-48" />
          <button className="btn btn-primary">Generate Payroll</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow border border-base-300 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows, replace with dynamic data */}
            <tr>
              <td>Jane Doe</td>
              <td>2024-06</td>
              <td>$3000</td>
              <td><span className="badge badge-success">Paid</span></td>
              <td>
                <button className="btn btn-xs btn-outline btn-info">View</button>
              </td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>2024-06</td>
              <td>$2500</td>
              <td><span className="badge badge-warning">Pending</span></td>
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