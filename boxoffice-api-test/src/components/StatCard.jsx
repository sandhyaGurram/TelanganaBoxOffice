const StatCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div>
          <p className="stat-title">{title}</p>

          <h3 className="stat-value">{value}</h3>

          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="stat-icon">
            <Icon size={19} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
