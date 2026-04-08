import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import {
  useDashboardSummary,
  useDashboardRevenue,
  useDashboardCategories,
  useReviews,
} from './hooks/api';
import SummaryCard from './components/dashboard/SummaryCard';
import PieChartWidget from './components/dashboard/PieChartWidget';
import RevenueLineChart from './components/dashboard/RevenueLineChart';
import RevenueComparisonChart from './components/dashboard/RevenueComparisonChart';
import CustomerMapChart from './components/dashboard/CustomerMapChart';
import ReviewCard from './components/dashboard/ReviewCard';
import './Dashboard.css';

// Format number with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Format currency
const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

// Format percentage
const formatPercent = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`;
};

// Get relative time string
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const Dashboard = () => {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: revenueData } = useDashboardRevenue(30);
  const { data: categoryData } = useDashboardCategories();
  const { data: reviews } = useReviews(4);

  // Loading state
  if (summaryLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* ── Summary row ── */}
      <div className="summary-cards-row">
        <SummaryCard
          title="Total Orders"
          value={formatNumber(summary?.totalOrders || 0)}
          trend={formatPercent(summary?.ordersChange || 0)}
          trendUp={(summary?.ordersChange || 0) > 0}
          icon={ShoppingBag}
          iconBgColor="rose"
        />
        <SummaryCard
          title="Total Products"
          value={formatNumber(summary?.totalProducts || 0)}
          trend={formatPercent(summary?.productsChange || 0)}
          trendUp={(summary?.productsChange || 0) > 0}
          icon={Package}
          iconBgColor="blue"
        />
        <SummaryCard
          title="Total Customers"
          value={formatNumber(summary?.totalCustomers || 0)}
          trend={formatPercent(summary?.customersChange || 0)}
          trendUp={(summary?.customersChange || 0) > 0}
          icon={Users}
          iconBgColor="green"
        />
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue || 0)}
          trend={formatPercent(summary?.revenueChange || 0)}
          trendUp={(summary?.revenueChange || 0) > 0}
          icon={DollarSign}
          iconBgColor="amber"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="charts-row">
        <PieChartWidget data={categoryData} />
        <RevenueLineChart data={revenueData} />
      </div>

      {/* ── Analytics row ── */}
      <div className="analytics-row">
        <RevenueComparisonChart />
        <CustomerMapChart />
      </div>

      {/* ── Reviews ── */}
      <div className="reviews-section">
        <div className="section-header">
          <h3>Customer Reviews</h3>
          <a href="#" className="see-all">See all →</a>
        </div>
        <div className="reviews-carousel">
          {reviews?.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.customerName}
              timeText={getRelativeTime(review.createdAt)}
              reviewText={review.reviewText}
              rating={review.rating}
              avatarUrl={review.customerAvatar}
              productImageUrl={review.productImageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
