import "./Admin.css";

const Admin = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ];

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-title">Admin Panel</h1>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">User Management</h2>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-table-id">{user.id}</td>
                    <td className="admin-table-name">{user.name}</td>
                    <td className="admin-table-email">{user.email}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          user.role === "Admin"
                            ? "admin-badge-admin"
                            : "admin-badge-user"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="admin-button-edit">Edit</button>
                      <button className="admin-button-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
