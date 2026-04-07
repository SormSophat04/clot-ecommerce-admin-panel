import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import SummaryCard from './components/dashboard/SummaryCard';
import PieChartWidget from './components/dashboard/PieChartWidget';
import RevenueLineChart from './components/dashboard/RevenueLineChart';
import RevenueComparisonChart from './components/dashboard/RevenueComparisonChart';
import CustomerMapChart from './components/dashboard/CustomerMapChart';
import ReviewCard from './components/dashboard/ReviewCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      {/* ── Summary row ── */}
      <div className="summary-cards-row">
        <SummaryCard title="Total Orders"    value="8,432"  trend="12%" trendUp={true}  icon={ShoppingBag} iconBgColor="rose"   />
        <SummaryCard title="Total Products"  value="12,084" trend="8%"  trendUp={true}  icon={Package}     iconBgColor="blue"   />
        <SummaryCard title="Total Customers" value="4,670"  trend="5%"  trendUp={true}  icon={Users}       iconBgColor="green"  />
        <SummaryCard title="Total Revenue"   value="$128K"  trend="18%" trendUp={true}  icon={DollarSign}  iconBgColor="amber"  />
      </div>

      {/* ── Charts row ── */}
      <div className="charts-row">
        <PieChartWidget />
        <RevenueLineChart />
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
          <ReviewCard
            name="Emma Johnson"
            timeText="2 days ago"
            reviewText="The quality of the jeans is outstanding. Fits perfectly and the denim feels premium. Definitely will buy again!"
            rating={5}
            avatarUrl="https://ui-avatars.com/api/?name=Emma+Johnson&background=E94560&color=fff&bold=true"
            productImageUrl="https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop"
          />
          <ReviewCard
            name="James Carter"
            timeText="4 days ago"
            reviewText="The sneakers look exactly like in the pictures. Super comfortable and delivered in 2 days. Will recommend to friends."
            rating={4}
            avatarUrl="https://ui-avatars.com/api/?name=James+Carter&background=3B82F6&color=fff&bold=true"
            productImageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"
          />
          <ReviewCard
            name="Sophia Lee"
            timeText="1 week ago"
            reviewText="Absolutely love the jacket! The material is lightweight but warm. Great for the season. Perfect purchase!"
            rating={5}
            avatarUrl="https://ui-avatars.com/api/?name=Sophia+Lee&background=10B981&color=fff&bold=true"
            productImageUrl="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop"
          />
          <ReviewCard
            name="Liam Brown"
            timeText="2 weeks ago"
            reviewText="The shirt fabric is very soft. Love the minimalist design — pairs with basically anything in my wardrobe."
            rating={4}
            avatarUrl="https://ui-avatars.com/api/?name=Liam+Brown&background=8B5CF6&color=fff&bold=true"
            productImageUrl="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
