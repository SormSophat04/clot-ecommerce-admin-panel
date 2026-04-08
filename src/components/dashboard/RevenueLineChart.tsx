import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/useTheme';
import type { RevenueDataPoint } from '../../types/api';
import './ChartStyles.css';

const DEFAULT_DATA = [
  { name: 'Sun', orders: 95 },
  { name: 'Mon', orders: 210 },
  { name: 'Tue', orders: 160 },
  { name: 'Wed', orders: 340 },
  { name: 'Thu', orders: 275 },
  { name: 'Fri', orders: 420 },
  { name: 'Sat', orders: 310 },
];

interface RevenueLineChartProps {
  data?: RevenueDataPoint[];
}

const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9';
  const labelColor = theme === 'dark' ? '#94A3B8' : '#64748B';

  // Transform API data if provided, otherwise use default
  const chartData = data
    ? data.map((item) => ({
        name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        orders: item.orders,
        revenue: item.revenue,
      }))
    : DEFAULT_DATA;

  return (
    <div className="chart-widget line-chart-widget">
      <div className="widget-header">
        <div className="header-titles">
          <h3>Weekly Orders</h3>
          <p>Order volume across the current week</p>
        </div>
        <button className="btn-save-report">Export CSV</button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value) => [`${Number(value ?? 0)} orders`, 'Orders']}
            />
            <Area type="monotone" dataKey="orders" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" dot={false} activeDot={{ r: 5, fill: 'var(--primary)', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueLineChart;
