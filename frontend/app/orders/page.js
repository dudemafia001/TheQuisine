"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import "./orders.css";

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTracking, setShowTracking] = useState({});

  // Toggle tracking view for specific order
  const toggleTrackingView = (orderId) => {
    setShowTracking(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Get tracking stages based on current order status
  const getTrackingStages = (currentStatus) => {
    const stages = [
      {
        title: "Order Placed",
        description: "Your order has been received and confirmed",
        status: "completed" // Always completed since we have the order
      },
      {
        title: "Send to Cooking",
        description: "Your order is being prepared in the kitchen",
        status: currentStatus === 'placed' ? 'pending' : 
                currentStatus === 'preparing' ? 'current' : 'completed'
      },
      {
        title: "Out for Delivery",
        description: "Your order is on the way to your location",
        status: (currentStatus === 'placed' || currentStatus === 'preparing') ? 'pending' :
                currentStatus === 'out_for_delivery' ? 'current' : 'completed'
      },
      {
        title: "Delivered",
        description: "Your order has been delivered successfully",
        status: currentStatus === 'delivered' ? 'completed' : 
                currentStatus === 'cancelled' ? 'cancelled' : 'pending'
      }
    ];

    return stages;
  };

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
                <p className="text-muted">You haven&apos;t placed any orders yet.</p>
                <a href="/" className="btn btn-primary">Start Shopping</a>
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
                        className="btn btn-outline-success btn-sm"
                        onClick={() => toggleTrackingView(order.orderId)}
                      >
                        📦 Track Order
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
                      
                      {/* Order Tracking Section */}
                      {showTracking[order.orderId] && (
                        <div className="mt-3 p-3 border-top">
                          <h6 className="mb-3">📍 Order Tracking</h6>
                          <div className="tracking-progress">
                            {getTrackingStages(order.orderStatus).map((stage, index) => (
                              <div key={index} className={`tracking-stage ${stage.status}`}>
                                <div className="stage-indicator">
                                  <div className={`stage-circle ${stage.status}`}>
                                    {stage.status === 'completed' ? '✓' : 
                                     stage.status === 'current' ? '●' : '○'}
                                  </div>
                                  {index < 3 && <div className={`stage-line ${stage.status}`}></div>}
                                </div>
                                <div className="stage-content">
                                  <div className={`stage-title ${stage.status}`}>{stage.title}</div>
                                  <div className="stage-description">{stage.description}</div>
                                  {stage.status === 'completed' && stage.timestamp && (
                                    <div className="stage-time">
                                      {new Date(stage.timestamp).toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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
