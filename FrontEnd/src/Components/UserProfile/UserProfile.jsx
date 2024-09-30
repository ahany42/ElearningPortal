import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import avatar from '../../assets/avatar.jpg';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    username: 'johndoe123',
    email: 'johndoe@example.com',
    password: '',
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const changePassword = () => {
    navigate('/ResetPassword');
  };

  return (
    <>
      <h1>User Profile</h1>
      <div className="profile-container">
        <div className="profile-picture green-bg light-text">
          <img src={avatar} alt="User" />
          <p>Student</p>
        </div>
        <div className="profile-details">
          <div className="user-data-container green-bg">
            <div className="user-data">
              <label>Name: </label>
              <input
                className={`data-input ${!isEditing ? 'read-only' : ''}`}
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="user-data">
              <label>Username: </label>
              <input
                className={`data-input ${!isEditing ? 'read-only' : ''}`}
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="user-data">
              <label>Email: </label>
              <input
                className={`data-input ${!isEditing ? 'read-only' : ''}`}
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            {isChangingPassword && (
              <div className="user-data">
                <label>Password: </label>
                <input
                  className="data-input"
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
            )}
          </div>

          <div className="button-group">
            <button className="edit green-bg light-text" onClick={toggleEditMode}>
              {isEditing ? 'Save' : 'Edit'}
            </button>

            <button
              className="change-password green-bg light-text"
              onClick={changePassword}
            >
              {isChangingPassword ? 'Save Password' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

