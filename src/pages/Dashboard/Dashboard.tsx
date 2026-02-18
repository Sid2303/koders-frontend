import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Total Users</h3>
            <p className="dashboard-card-value blue">1,234</p>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Active Projects</h3>
            <p className="dashboard-card-value green">56</p>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Pending Tasks</h3>
            <p className="dashboard-card-value orange">23</p>
          </div>
        </div>

        <div className="dashboard-activity dashboard-card">
          <h2 className="dashboard-activity-title">Recent Activity</h2>
          <div className="dashboard-activity-list">
            <div className="dashboard-activity-item blue">
              <p className="dashboard-activity-text">New user registered</p>
              <p className="dashboard-activity-time">2 hours ago</p>
            </div>
            <div className="dashboard-activity-item green">
              <p className="dashboard-activity-text">Project completed</p>
              <p className="dashboard-activity-time">5 hours ago</p>
            </div>
            <div className="dashboard-activity-item orange">
              <p className="dashboard-activity-text">Task assigned</p>
              <p className="dashboard-activity-time">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
