import { Link, useNavigate } from "react-router-dom";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LockIcon from "@mui/icons-material/Lock";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { isAuthenticated } from "../../utils/auth";
import "./Home.css";

const features: {
  icon: React.ReactNode;
  title: string;
  description: string;
}[] = [
  {
    icon: <ViewKanbanIcon sx={{ fontSize: 32, color: "#2563eb" }} />,
    title: "Kanban Board",
    description:
      "Visualise work across four columns — To Do, In Progress, Review, and Done. Drag and drop tasks between columns in real time.",
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: 32, color: "#8b5cf6" }} />,
    title: "Role-Based Access",
    description:
      "Three-tier permission system: Users manage their own tasks, Managers oversee team work, and Admins have full platform control.",
  },
  {
    icon: <LockIcon sx={{ fontSize: 32, color: "#10b981" }} />,
    title: "JWT Authentication",
    description:
      "Secure token-based login and registration. Sessions persist across page reloads and expire automatically for security.",
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 32, color: "#f59e0b" }} />,
    title: "Analytics Dashboard",
    description:
      "At-a-glance statistics with charts showing task distribution by status and priority across your team or personal scope.",
  },
  {
    icon: <LocalOfferIcon sx={{ fontSize: 32, color: "#ec4899" }} />,
    title: "Tags & Priority",
    description:
      "Organise tasks with custom tags and four priority levels (Low, Medium, High, Urgent) with colour-coded visual indicators.",
  },
  {
    icon: <DeleteOutlineIcon sx={{ fontSize: 32, color: "#ef4444" }} />,
    title: "Soft Delete",
    description:
      "Deleted tasks remain visible in read-only mode so history is preserved. No data is permanently lost.",
  },
];

const frontendStack = [
  { name: "React 19", desc: "UI library with functional components and hooks" },
  {
    name: "TypeScript",
    desc: "Statically typed for reliability and IDE support",
  },
  { name: "MUI v7", desc: "Material Design component library for polished UI" },
  {
    name: "MUI X Charts",
    desc: "Data visualisation with PieChart on Dashboard",
  },
  {
    name: "React Router v7",
    desc: "Client-side routing with protected and public routes",
  },
  { name: "Vite", desc: "Lightning-fast build tool and dev server" },
];

const backendStack = [
  { name: "Node.js", desc: "JavaScript runtime powering the REST API server" },
  {
    name: "Express.js",
    desc: "Minimal web framework for routing and middleware",
  },
  { name: "MongoDB", desc: "NoSQL document database for tasks and users" },
  { name: "Mongoose", desc: "ODM for schema validation and model definitions" },
  { name: "JWT", desc: "Stateless auth tokens issued on login and register" },
  { name: "bcrypt", desc: "Password hashing before storage in the database" },
];

const Home = () => {
  const loggedIn = isAuthenticated();
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-badge">Task Management Platform</div>
          <h1 className="home-title">
            Manage tasks,
            <br />
            ship faster.
          </h1>
          <p className="home-subtitle">
            Koders is a full-stack Kanban task manager built for developer
            teams. Organise work visually, assign tasks across roles, and track
            progress from a single, clean dashboard.
          </p>
          <div className="home-hero-actions">
            <button
              className="home-btn home-btn-primary"
              onClick={() => navigate(loggedIn ? "/dashboard" : "/register")}
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="home-hero-visual">
          <div className="home-kanban-preview">
            <div className="home-kanban-col">
              <div className="home-kanban-col-header hk-todo">To Do</div>
              <div className="home-kanban-card" />
              <div className="home-kanban-card" />
            </div>
            <div className="home-kanban-col">
              <div className="home-kanban-col-header hk-inprogress">
                In Progress
              </div>
              <div className="home-kanban-card" />
              <div className="home-kanban-card" />
              <div className="home-kanban-card" />
            </div>
            <div className="home-kanban-col">
              <div className="home-kanban-col-header hk-review">Review</div>
              <div className="home-kanban-card" />
            </div>
            <div className="home-kanban-col">
              <div className="home-kanban-col-header hk-done">Done</div>
              <div className="home-kanban-card" />
              <div className="home-kanban-card" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Everything you need to ship</h2>
          <p>Purpose-built features for developers and their teams.</p>
        </div>
        <div className="home-features-grid">
          {features.map((f) => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-section--alt">
        <div className="home-section-header">
          <h2>Three roles, one platform</h2>
          <p>
            Access is scoped to your role so everyone sees exactly what they
            need.
          </p>
        </div>
        <div className="home-roles-grid">
          <div className="home-role-card">
            <div className="home-role-badge home-role-badge--user">User</div>
            <ul>
              <li>View and manage your own tasks</li>
              <li>Update task status and priority</li>
              <li>Add tags and due dates</li>
              <li>Dashboard scoped to personal tasks</li>
            </ul>
          </div>
          <div className="home-role-card home-role-card--featured">
            <div className="home-role-badge home-role-badge--manager">
              Manager
            </div>
            <ul>
              <li>All User capabilities</li>
              <li>View and manage team tasks</li>
              <li>Assign tasks to any team member</li>
              <li>Dashboard showing all team data</li>
            </ul>
          </div>
          <div className="home-role-card">
            <div className="home-role-badge home-role-badge--admin">Admin</div>
            <ul>
              <li>All Manager capabilities</li>
              <li>Access the Admin panel</li>
              <li>View all users and their tasks</li>
              <li>Delete users from the platform</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Built with modern tech</h2>
          <p>
            A clean separation between a React frontend and a Node.js REST API
            backend.
          </p>
        </div>
        <div className="home-stack-grid">
          <div className="home-stack-panel">
            <div className="home-stack-panel-header">
              <span className="home-stack-label home-stack-label--fe">
                Frontend
              </span>
              <h3>React + TypeScript</h3>
            </div>
            <ul className="home-stack-list">
              {frontendStack.map((s) => (
                <li key={s.name}>
                  <span className="home-stack-name">{s.name}</span>
                  <span className="home-stack-desc">{s.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="home-stack-panel">
            <div className="home-stack-panel-header">
              <span className="home-stack-label home-stack-label--be">
                Backend
              </span>
              <h3>Node.js + Express</h3>
            </div>
            <ul className="home-stack-list">
              {backendStack.map((s) => (
                <li key={s.name}>
                  <span className="home-stack-name">{s.name}</span>
                  <span className="home-stack-desc">{s.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {!loggedIn && (
        <section className="home-cta">
          <h2>Ready to start building?</h2>
          <p>Create your account and open the board in seconds.</p>
          <Link
            to="/register"
            className="home-btn home-btn-primary home-btn-lg"
          >
            Create Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
