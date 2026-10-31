import { 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Plus, 
  AlertTriangle, 
  Info
} from 'lucide-react';
import type { Product, Order, OrderStatus, TabType } from '../types';
import { HOURLY_SALES_DEMO } from '../data/mockData';

interface OverviewProps {
  products: Product[];
  orders: Order[];
  setActiveTab: (tab: TabType) => void;
  onOpenAddProduct: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onViewOrderDetails: (order: Order) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  products,
  orders,
  setActiveTab,
  onOpenAddProduct,
  onUpdateOrderStatus,
  onViewOrderDetails,
}) => {
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing');
  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const lowStockProducts = products.filter((p) => p.stock <= 20 || !p.inStock);

  // Illustrative demonstration sales calculation
  const demoTotalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const maxBarAmount = Math.max(...HOURLY_SALES_DEMO.map((h) => h.amount));

  return (
    <div>
      {/* Demonstration notice banner */}
      <div className="demo-banner">
        <div className="demo-banner-content">
          <Info size={18} color="#15803d" />
          <div>
            <strong>Interactive Prototype:</strong> All metric values, sales figures, and live order alerts below are simulated sample data for local shopkeeper demonstration in Your City.
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('products')}
        >
          Explore Catalog
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="metrics-grid">
        <div 
          className="metric-card" 
          onClick={() => setActiveTab('products')}
          title="Click to view all products"
        >
          <div className="metric-card-top">
            <span className="metric-card-label">Total Catalog Products</span>
            <div className="metric-card-icon">
              <Package size={18} />
            </div>
          </div>
          <div className="metric-card-value">{products.length}</div>
          <div className="metric-card-footer">
            <span className="metric-trend">
              <TrendingUp size={13} /> {products.filter((p) => p.inStock).length} active
            </span>
            <span>• {lowStockProducts.length} low stock</span>
          </div>
        </div>

        <div 
          className="metric-card highlight" 
          onClick={() => setActiveTab('orders')}
          title="Click to view pending orders"
        >
          <div className="metric-card-top">
            <span className="metric-card-label">Pending / Actionable Orders</span>
            <div className="metric-card-icon">
              <Clock size={18} />
            </div>
          </div>
          <div className="metric-card-value">{pendingOrders.length}</div>
          <div className="metric-card-footer">
            <span className="metric-trend">
              {orders.filter((o) => o.status === 'Pending').length} unconfirmed
            </span>
            <span>• {orders.filter((o) => o.status === 'Preparing').length} in packing</span>
          </div>
        </div>

        <div 
          className="metric-card" 
          onClick={() => setActiveTab('orders')}
          title="Click to view completed deliveries"
        >
          <div className="metric-card-top">
            <span className="metric-card-label">Completed Orders Today</span>
            <div className="metric-card-icon">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="metric-card-value">{completedOrders.length}</div>
          <div className="metric-card-footer">
            <span className="metric-trend">100% fulfilled</span>
            <span>• Avg 14 mins delivery</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Illustrative Daily Sales</span>
            <div className="metric-card-icon">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="metric-card-value">₹{demoTotalSales.toLocaleString('en-IN')}</div>
          <div className="metric-card-footer">
            <span className="metric-trend">
              <TrendingUp size={13} /> {orders.length} orders
            </span>
            <span>• Demo figures only</span>
          </div>
        </div>
      </div>

      {/* Main split grid: Hourly Sales Chart + Quick Actions */}
      <div className="dashboard-split-grid">
        {/* Hourly distribution chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Hourly Order & Sales Pace</div>
              <div className="card-subtitle">Simulated delivery orders across DailyGrocer market hours</div>
            </div>
            <span className="badge badge-green">Peak 6:00 PM</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="chart-bars-wrap">
                {HOURLY_SALES_DEMO.map((item) => {
                  const heightPercent = Math.round((item.amount / maxBarAmount) * 100);
                  const isPeak = item.hour === '18:00';
                  return (
                    <div key={item.hour} className="chart-bar-col">
                      <div 
                        className={`chart-bar-fill ${isPeak ? 'active' : ''}`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${item.hour}: ₹${item.amount} (${item.orders} orders)`}
                      />
                      <span className="chart-bar-label">{item.hour}</span>
                    </div>
                  );
                })}
              </div>

              <div className="chart-legend">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: '#0f172a', borderRadius: 2 }} />
                    <span>Regular Hours</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: '#15803d', borderRadius: 2 }} />
                    <span>Peak Evening Rush</span>
                  </div>
                </div>
                <div>Demo Target: ₹5,000 / day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Stock Watch */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Shop Actions</div>
            <span className="badge badge-neutral">Quick Control</span>
          </div>
          <div className="card-body">
            <button
              type="button"
              className="quick-action-item"
              onClick={onOpenAddProduct}
            >
              <div className="quick-action-left">
                <div className="quick-action-icon">
                  <Plus size={16} color="#15803d" />
                </div>
                <div>
                  <div className="quick-action-name">Add New Product</div>
                  <div className="quick-action-desc">Add grocery item to your online shelf</div>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </button>

            <button
              type="button"
              className="quick-action-item"
              onClick={() => setActiveTab('orders')}
            >
              <div className="quick-action-left">
                <div className="quick-action-icon">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <div className="quick-action-name">Manage Orders Queue</div>
                  <div className="quick-action-desc">Update statuses & view delivery slips</div>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </button>

            <button
              type="button"
              className="quick-action-item"
              onClick={() => setActiveTab('profile')}
            >
              <div className="quick-action-left">
                <div className="quick-action-icon">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="quick-action-name">Store Profile & Hours</div>
                  <div className="quick-action-desc">Update delivery radius & UPI ID</div>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </button>

            {/* Low stock alert box */}
            {lowStockProducts.length > 0 && (
              <div style={{ 
                marginTop: 14, 
                padding: 12, 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: 8 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
                  <AlertTriangle size={14} color="#15803d" />
                  <span>Stock Alert ({lowStockProducts.length} items)</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>
                  {lowStockProducts.slice(0, 2).map((p) => p.name).join(', ')}
                  {lowStockProducts.length > 2 && ` and ${lowStockProducts.length - 2} more`} need restocking soon.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Customer Orders</div>
            <div className="card-subtitle">Real-time hyperlocal order stream for DailyGrocer</div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('orders')}
          >
            View All ({orders.length})
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer & Locality</th>
                <th>Items Summary</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>#{order.id}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{order.orderTime}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.customerName}</div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>{order.locality}</div>
                  </td>
                  <td>
                    <div style={{ maxWidth: 220, fontSize: 12, color: '#334155' }}>
                      {order.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{order.totalAmount}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{order.paymentMethod}</span>
                  </td>
                  <td>
                    <select
                      className={`status-select ${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      id={`overview-slip-${order.id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewOrderDetails(order)}
                    >
                      Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
