"use client";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>My Orders</h1>
          <div className="card">
            <div className="card-body">
              <p>Your order history will appear here.</p>
              <p className="text-muted">No orders found at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
