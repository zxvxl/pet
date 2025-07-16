import React, { useEffect, useState } from 'react';
import { baseUrl } from '../config';

export default function FeederAudit() {
  const [feeders, setFeeders] = useState([]);

  useEffect(() => {
    fetch(baseUrl + '/feeders')
      .then((r) => r.json())
      .then((d) => setFeeders(d.data || []));
  }, []);

  const updateStatus = (id, status) => {
    fetch(`${baseUrl}/feeders/${id}/status/${status}`, { method: 'PATCH' })
      .then(() => setFeeders((prev) => prev.filter((f) => f.id !== id)));
  };

  return (
    <div>
      <h2>Feeder Audit</h2>
      <ul>
        {feeders.map((f) => (
          <li key={f.id}>
            {f.name} - {f.phone}
            <button onClick={() => updateStatus(f.id, 1)}>Approve</button>
            <button onClick={() => updateStatus(f.id, 2)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
