import { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../App';
import {useLocation, useNavigate} from 'react-router-dom';
import "./UserProfile.css";
import {updateCookie} from "../Cookie/Cookie.jsx";
import {jwtDecode} from "jwt-decode";
import avatar from '../../assets/avatar.jpg';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [profileData, setProfileData] = useState({});
    const navigate = useNavigate();
    const { showMessage, currentUser, setLoading, setCurrentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        if (currentUser) {
            setProfileData(currentUser);
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const submitEditHandler = async () => {
        if (currentUser === profileData) {
            showMessage('No changes made', null);
            setIsEditing(false);
            return;
        }
        setLoading(true);
        await fetch(`http://localhost:3008/updateUser/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...profileData})
        })
            .then((res) => res.json())
            .then(async (data) => {
                setTimeout(() => {
                    setLoading(false);
                    if (!data.error) {
                        showMessage('Profile updated successfully', false);
                        updateCookie('token', data.data);
                        setCurrentUser(jwtDecode(data.data));
                        setIsEditing(false);
                    } else {
                        showMessage(data.error, true);
                    }
                }, 1400);
            })
            .catch((err) => {
                console.clear();
                setTimeout(() => {
                    showMessage(err.message, true);
                    setLoading(false);
                }, 1400);
            })
    }

    const changePassword = async () => {
        setLoading(true);
        await fetch('http://localhost:3008/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: profileData.email,
                isedit: true
            })
        })
            .then((res) => res.json())
            .then(async (data) => {
                setTimeout(() => {
                    setLoading(false);
                    if (!data.error) {
                        const token = data.data.resetToken;
                        navigate(`/resetPassword?token=${token}`, { state: { edit: true } });
                    } else {
                        showMessage(data.error, true);
                    }
                }, 1400);
            })
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
                              value={profileData.name || ''}
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
                        value={profileData.username || ""}
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
                        value={profileData.email || ""}
                        onChange={handleChange}
                        readOnly={!isEditing}
                      />
                    </div>

                    {isChangingPassword && (
                        <div className='user-data'>
                            <label>Password: </label>
                            <input
                                className='data-input'
                                type="password"
                                name="password"
                                value={profileData.password || ''}
                                onChange={handleChange}
                                placeholder="Enter new password"
                            />
                        </div>
                    )}

                    <div className='button-group'>
                        <button className='edit green-bg light-text'
                                onClick={isEditing? submitEditHandler:toggleEditMode}>
                            {isEditing ? 'Save' : 'Edit'}
                        </button>

                        <button className='change-password green-bg light-text' onClick={changePassword}>
                            {isChangingPassword ? 'Save Password' : 'Change Password'}
                        </button>
                    </div>
                  </div>
              </div>
            </div>
        </>
    );
};

export default UserProfile;

