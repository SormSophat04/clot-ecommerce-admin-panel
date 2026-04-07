import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './SummaryCard.css';

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  iconBgColor: 'rose' | 'blue' | 'green' | 'amber' | 'teal' | 'red';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, trend, trendUp, icon: Icon, iconBgColor }) => {
  return (
    <div className="summary-card">
      <div className={`summary-icon bg-${iconBgColor}`}>
        <Icon size={24} className="icon-white" />
      </div>
      <div className="summary-info">
        <h3 className="summary-value">{value}</h3>
        <p className="summary-title">{title}</p>
      </div>
      <div className="summary-trend-container">
        <div className={`trend-badge ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trend}</span>
        </div>
        <p className="trend-period">(30 days)</p>
      </div>
    </div>
  );
};

export default SummaryCard;
