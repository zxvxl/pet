import React, { useEffect, useState } from 'react';

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/service-orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.data || []));
  }, []);

  return (
    <div>
      <h2>Service Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            Order #{o.id} - {o.status}
            {o.completeImages && o.completeImages.map((img) => (
              <img key={img} src={img} alt="" width="60" />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
