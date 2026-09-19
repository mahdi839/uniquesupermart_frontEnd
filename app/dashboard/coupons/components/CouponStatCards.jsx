"use client";

export default function CouponStatCards({ items = [] }) {
  return (
    <div className="row g-3 mb-4">
      {items.map((item) => (
        <div className="col-sm-6 col-xl-3" key={item.label}>
          <div className={`card coupon-stat-card ${item.tone}`}>
            <div className="card-body">
              <div>
                <div className="coupon-stat-label">{item.label}</div>
                <div className="coupon-stat-value">{item.value}</div>
              </div>
              <div className="coupon-stat-icon">{item.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
