import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  FileText
} from 'lucide-react';
import type { Order, OrderStatus } from '../types';

interface OrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onViewOrderDetails: (order: Order) => void;
}

export const Orders: React.FC<OrdersProps> = ({
  orders,
  onUpdateOrderStatus,
  onViewOrderDetails,
}) => {
  const [selectedTab, setSelectedTab] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const counts = useMemo(() => {
    return {
      All: orders.length,
      Pending: orders.filter((o) => o.status === 'Pending').length,
      Preparing: orders.filter((o) => o.status === 'Preparing').length,
      'Out for Delivery': orders.filter((o) => o.status === 'Out for Delivery').length,
      Completed: orders.filter((o) => o.status === 'Completed').length,
      Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = selectedTab === 'All' || order.status === selectedTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.locality.toLowerCase().includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [orders, selectedTab, searchQuery]);

  const tabs: ('All' | OrderStatus)[] = [
    'All',
    'Pending',
    'Preparing',
    'Out for Delivery',
    'Completed',
    'Cancelled',
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header-title-box">
          <h1>Customer Orders Queue</h1>
          <p>Process, pack and dispatch hyperlocal delivery orders in DailyGrocer</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="orders-filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`order-tab-btn ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab)}
          >
            <span>{tab}</span>
            <span className="tab-count-pill">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="filters-bar" style={{ marginBottom: 16 }}>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Order ID (e.g. BLR-2049), customer name, phone, or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <ShoppingBag size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>No orders found</div>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            No orders match the current status filter &quot;{selectedTab}&quot; or search query.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '16%' }}>Order ID & Time</th>
                <th style={{ width: '22%' }}>Customer & Address</th>
                <th style={{ width: '28%' }}>Items & Quantities</th>
                <th>Payment</th>
                <th>Bill Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Slip</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isPending = order.status === 'Pending';
                const isPreparing = order.status === 'Preparing';
                const isOut = order.status === 'Out for Delivery';

                return (
                  <tr key={order.id}>
                    {/* Order ID */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>
                        #{order.id}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <Clock size={11} />
                        <span>{order.orderTime}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>
                        {order.customerName}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={11} /> {order.customerPhone}
                      </div>
                      <div style={{ fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <MapPin size={11} color="#15803d" />
                        <span>{order.locality}</span>
                      </div>
                      {order.notes && (
                        <div style={{
                          marginTop: 4,
                          fontSize: 10.5,
                          background: '#f8fafc',
                          padding: '2px 6px',
                          borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          color: '#0f172a'
                        }}>
                          Note: {order.notes}
                        </div>
                      )}
                    </td>

                    {/* Items */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: 12, color: '#0f172a' }}>
                            <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.productName}{' '}
                            <span style={{ color: '#64748b', fontSize: 11 }}>({item.unit})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment Mode */}
                    <td>
                      <span className="badge badge-neutral">{order.paymentMethod}</span>
                    </td>

                    {/* Total Amount */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                        ₹{order.totalAmount}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                      </div>
                    </td>

                    {/* Status Dropdown / Quick Action */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
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

                        {/* Quick one-click progression button */}
                        {isPending && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 11, padding: '3px 8px' }}
                            onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                          >
                            Accept & Prepare
                          </button>
                        )}
                        {isPreparing && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 11, padding: '3px 8px' }}
                            onClick={() => onUpdateOrderStatus(order.id, 'Out for Delivery')}
                          >
                            Dispatch Order
                          </button>
                        )}
                        {isOut && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 11, padding: '3px 8px' }}
                            onClick={() => onUpdateOrderStatus(order.id, 'Completed')}
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Slip */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        id={`slip-btn-${order.id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewOrderDetails(order)}
                        title="View printable packing slip"
                      >
                        <FileText size={14} />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
