import { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card">
          <h1 className="profile-title">Profile</h1>

          <div className="profile-header">
            <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <h2 className="profile-name">{name}</h2>
              <p className="profile-email">{email}</p>
            </div>
          </div>

          <form>
            <div className="profile-form-group">
              <label htmlFor="name" className="profile-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="email" className="profile-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="profile-input"
                required
              />
            </div>

            <div className="profile-form-group-last">
              <label htmlFor="bio" className="profile-label">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="profile-textarea"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button type="submit" className="profile-button">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
