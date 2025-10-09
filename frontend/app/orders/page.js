"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/orders/user/${user}`);
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'text-warning';
      case 'confirmed': return 'text-info';
      case 'preparing': return 'text-primary';
      case 'out_for_delivery': return 'text-secondary';
      case 'delivered': return 'text-success';
      case 'cancelled': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>My Orders</h1>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {orders.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <h5>No orders found</h5>
                <p className="text-muted">You haven't placed any orders yet.</p>
                <a href="/menu" className="btn btn-primary">Start Shopping</a>
              </div>
            </div>
          ) : (
            <div className="row">
              {orders.map((order) => (
                <div key={order._id} className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>Order #{order.orderId}</strong>
                      <span className={`badge bg-light ${getStatusColor(order.orderStatus)}`}>
                        {formatStatus(order.orderStatus)}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <small className="text-muted">Order Date</small>
                          <div>{formatDate(order.createdAt)}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Total Amount</small>
                          <div><strong>₹{order.pricing.finalTotal}</strong></div>
                        </div>
                      </div>
                      
                      <hr />
                      
                      <div className="mb-3">
                        <small className="text-muted">Items ({order.items.length})</small>
                        <div className="mt-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="small">
                              • {item.productName} ({item.variant}) × {item.quantity}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="small text-muted">
                              + {order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-6">
                          <small className="text-muted">Payment</small>
                          <div className="small">
                            {order.paymentInfo.method === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                          </div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Delivery Time</small>
                          <div className="small">{order.estimatedDeliveryTime}</div>
                        </div>
                      </div>
                      
                      {order.deliveryAddress?.address && (
                        <div className="mt-2">
                          <small className="text-muted">Delivery Address</small>
                          <div className="small">{order.deliveryAddress.address}</div>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          // You can implement order detail view here
                          alert(`Order details for ${order.orderId}`);
                        }}
                      >
                        View Details
                      </button>
                      
                      {order.orderStatus === 'placed' && order.paymentInfo.method === 'cash' && (
                        <button 
                          className="btn btn-outline-danger btn-sm ms-2"
                          onClick={() => {
                            // You can implement order cancellation here
                            if (confirm('Are you sure you want to cancel this order?')) {
                              alert('Order cancellation functionality can be implemented here');
                            }
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
