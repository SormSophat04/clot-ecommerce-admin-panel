import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/useTheme';
import './ChartStyles.css';

const data = [
  { name: 'Jan', y2024: 42000, y2025: 65000 },
  { name: 'Feb', y2024: 55000, y2025: 48000 },
  { name: 'Mar', y2024: 38000, y2025: 82000 },
  { name: 'Apr', y2024: 90000, y2025: 71000 },
  { name: 'May', y2024: 62000, y2025: 95000 },
  { name: 'Jun', y2024: 74000, y2025: 112000 },
  { name: 'Jul', y2024: 58000, y2025: 128000 },
];

const formatCurrency = (v: number) => `$${(v / 1000).toFixed(0)}K`;

const RevenueComparisonChart = () => {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9';
  const labelColor = theme === 'dark' ? '#94A3B8' : '#64748B';

  return (
    <div className="chart-widget">
      <div className="widget-header">
        <div className="header-titles">
          <h3>Revenue Comparison</h3>
          <p>2024 vs 2025 year-over-year</p>
        </div>
        <div className="chart-legend-header">
          <div className="legend-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <span className="legend-dot" style={{ background: 'var(--primary)' }} /> 2024
          </div>
          <div className="legend-pill" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>
            <span className="legend-dot" style={{ background: 'var(--accent-blue)' }} /> 2025
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 12 }} tickFormatter={formatCurrency} />
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
            />
            <Line type="monotone" dataKey="y2024" name="2024" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="y2025" name="2025" stroke="var(--accent-blue)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueComparisonChart;
