import React from 'react';

export default function Attendance() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-primary">Attendance</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Search attendance..." className="input input-bordered w-48" />
          <button className="btn btn-primary">Mark Attendance</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow border border-base-300 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows, replace with dynamic data */}
            <tr>
              <td>Jane Doe</td>
              <td>2024-07-01</td>
              <td>09:00</td>
              <td>17:00</td>
              <td><span className="badge badge-success">Present</span></td>
              <td>
                <button className="btn btn-xs btn-outline btn-info">View</button>
              </td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>2024-07-01</td>
              <td>--</td>
              <td>--</td>
              <td><span className="badge badge-error">Absent</span></td>
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