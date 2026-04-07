import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/useTheme';
import './ChartStyles.css';

const data = [
  { name: 'Mon', newCustomers: 32, returning: 68 },
  { name: 'Tue', newCustomers: 45, returning: 55 },
  { name: 'Wed', newCustomers: 28, returning: 72 },
  { name: 'Thu', newCustomers: 60, returning: 88 },
  { name: 'Fri', newCustomers: 55, returning: 95 },
  { name: 'Sat', newCustomers: 80, returning: 110 },
  { name: 'Sun', newCustomers: 42, returning: 78 },
];

const CustomerMapChart = () => {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9';
  const labelColor = theme === 'dark' ? '#94A3B8' : '#64748B';

  return (
    <div className="chart-widget">
      <div className="widget-header">
        <div className="header-titles">
          <h3>Customer Activity</h3>
          <p>New vs. returning customers</p>
        </div>
        <select className="dropdown-filter">
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-md)',
                fontSize: '13px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
              cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
            />
            <Bar dataKey="newCustomers" name="New"       fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={10} />
            <Bar dataKey="returning"   name="Returning"  fill="var(--accent-blue)" radius={[6, 6, 0, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>

        <div className="bar-legend">
          <div className="legend-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <span className="legend-dot" style={{ background: 'var(--primary)' }} /> New Customers
          </div>
          <div className="legend-pill" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>
            <span className="legend-dot" style={{ background: 'var(--accent-blue)' }} /> Returning
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMapChart;
