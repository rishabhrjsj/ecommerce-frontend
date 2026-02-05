import React, { useState, useEffect } from "react";
import { fetchProfile } from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await fetchProfile();
        setUser(data);
      } catch (err) {
        setError("Failed to fetch profile data. Please try logging in again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);
  if (loading) {
    return <p className="loading-message">Loading profile...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {user && (
        <div className="profile-details">
          <img
            src={user.profileImage}
            alt={`${user.name}'s profile`}
            className="profile-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/200x200/CCCCCC/333333?text=User";
            }}
          />
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
