import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryDataPoint } from '../../types/api';
import './PieChartWidget.css';

const DEFAULT_DATA: CategoryDataPoint[] = [
  { name: 'Apparel',     value: 68, color: '#E94560' },
  { name: 'Footwear',    value: 21, color: '#3B82F6' },
  { name: 'Accessories', value: 11, color: '#10B981' },
];

interface PieChartWidgetProps {
  data?: CategoryDataPoint[];
}

const PieChartWidget: React.FC<PieChartWidgetProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <div className="pie-widget">
      <div className="widget-header">
        <h3>Sales by Category</h3>
        <span className="dot-menu">•••</span>
      </div>

      <div className="pie-container">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={52}
              outerRadius={72}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => `${v}%`}
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: item.color }} />
              <div className="legend-text">
                <span className="legend-label">{item.name}</span>
              </div>
              <span className="legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartWidget;
