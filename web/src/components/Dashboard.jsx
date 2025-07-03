import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, CalendarDaysIcon, BanknotesIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useHeader } from '../context/HeaderContext';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const { updateHeader } = useHeader();
  const { theme } = useTheme();
  const [employeeStatus, setEmployeeStatus] = useState(null);
  const [turnoverData, setTurnoverData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateHeader('Dashboard');
  }, [updateHeader]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statusRes, turnoverRes, deptRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:4000/api/dashboard/employee-status'),
          fetch('http://localhost:4000/api/dashboard/turnover-ratio'),
          fetch('http://localhost:4000/api/dashboard/department-distribution'),
          fetch('http://localhost:4000/api/dashboard/analytics')
        ]);

        const statusData = await statusRes.json();
        const turnoverData = await turnoverRes.json();
        const deptData = await deptRes.json();
        const analyticsData = await analyticsRes.json();

        setEmployeeStatus(statusData);
        setTurnoverData(turnoverData);
        setDepartmentData(deptData);
        setAnalyticsData(analyticsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
          font: {
            family: 'Aptos',
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#ffffff' : '#1e293b',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#475569',
        borderColor: '#006bad',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Aptos',
          weight: '600'
        },
        bodyFont: {
          family: 'Aptos',
          weight: '400'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
          font: {
            family: 'Aptos',
            weight: '500'
          }
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
          font: {
            family: 'Aptos',
            weight: '500'
          }
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        }
      }
    }
  };

  const turnoverChartData = {
    labels: turnoverData.map(item => item.month),
    datasets: [
      {
        label: 'Turnover Ratio (%)',
        data: turnoverData.map(item => item.turnoverRatio),
        borderColor: '#006bad',
        backgroundColor: theme === 'dark' ? 'rgba(0, 107, 173, 0.1)' : 'rgba(0, 107, 173, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#006bad',
        pointBorderColor: theme === 'dark' ? '#ffffff' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const departmentChartData = {
    labels: departmentData.map(item => item.name),
    datasets: [
      {
        data: departmentData.map(item => item.count),
        backgroundColor: [
          '#006bad',
          '#22d3ee',
          '#fbbf24',
          '#f87171',
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderColor: theme === 'dark' ? '#27272a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const employeeStatusData = {
    labels: ['Active', 'New Hires', 'Terminated'],
    datasets: [
      {
        data: employeeStatus ? [
          employeeStatus.active,
          employeeStatus.newHires,
          employeeStatus.terminated
        ] : [0, 0, 0],
        backgroundColor: [
          '#22d3ee',
          '#006bad',
          '#f87171'
        ],
        borderColor: theme === 'dark' ? '#27272a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-modern loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-base-100 to-base-200/50">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="card-modern group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-focus rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-primary transition-all duration-300">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Total Employees</h3>
                  <p className="text-2xl font-bold text-gradient">{employeeStatus?.total || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-modern group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center shadow-glow-success group-hover:shadow-glow-success transition-all duration-300">
                  <UserIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Active</h3>
                  <p className="text-2xl font-bold text-success">{employeeStatus?.active || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-modern group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-info to-info/80 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-primary transition-all duration-300">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">New Hires</h3>
                  <p className="text-2xl font-bold text-info">{employeeStatus?.newHires || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-modern group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-error to-error/80 rounded-xl flex items-center justify-center shadow-glow-error group-hover:shadow-glow-error transition-all duration-300">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Terminated</h3>
                  <p className="text-2xl font-bold text-error">{employeeStatus?.terminated || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-modern group">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-xl flex items-center justify-center shadow-glow-warning group-hover:shadow-glow-warning transition-all duration-300">
                  <CalendarDaysIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Avg Tenure</h3>
                  <p className="text-2xl font-bold text-warning">{analyticsData?.averageTenureMonths || 0} months</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Turnover Ratio Chart */}
          <div className="card-modern">
            <div className="card-body">
              <h3 className="card-title text-gradient mb-6">Employee Turnover Ratio (Monthly)</h3>
              <div className="h-64">
                <Line data={turnoverChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="card-modern">
            <div className="card-body">
              <h3 className="card-title text-gradient mb-6">Department Distribution</h3>
              <div className="h-64">
                <Doughnut data={departmentChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Employee Status Chart */}
          <div className="card-modern">
            <div className="card-body">
              <h3 className="card-title text-gradient mb-6">Employee Status Overview</h3>
              <div className="h-64">
                <Doughnut data={employeeStatusData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-modern">
            <div className="card-body">
              <h3 className="card-title text-gradient mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/employees" className="btn btn-modern w-full group">
                  <UserIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Manage Employees
                </Link>
                <Link to="/recruitment" className="btn btn-modern w-full group">
                  <BriefcaseIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Post Job
                </Link>
                <Link to="/leaves" className="btn btn-modern w-full group">
                  <CalendarDaysIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Review Leaves
                </Link>
                <Link to="/payroll" className="btn btn-modern w-full group">
                  <BanknotesIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Process Payroll
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 