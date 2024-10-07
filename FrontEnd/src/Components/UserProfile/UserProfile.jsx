import React, { useState, useContext, useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBCardText,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";
import { CurrentUserContext } from "../../App";
import { getCookie, updateCookie } from "../Cookie/Cookie.jsx";
import {jwtDecode} from "jwt-decode";
import { NavLink } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import './UserProfile.css'
const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedImage, setSelectedImage] = useState(avatar);
  const [password, setPassword] = useState("");
  const { showMessage, currentUser, setLoading, setCurrentUser } =
    useContext(CurrentUserContext);
  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
      setPassword(currentUser.password);
    }
    setSelectedImage(currentUser.avatar || avatar);
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
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const submitEditHandler = async () => {
    if (!profileData.name || !profileData.username || !profileData.email) {
      showMessage("Please fill in all the required fields.", true);
      return;
    }
    setLoading(true);
    await fetch(`http://localhost:3008/updateUser/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${getCookie("token")}`,
      },
      body: JSON.stringify({ ...profileData }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (!data.error) {
          showMessage("Profile updated successfully", false);
          updateCookie("token", data.data);
          setCurrentUser(jwtDecode(data.data)); 
          setIsEditing(false);
        } else {
          showMessage(data.error, true);
        }
      })
      .catch((err) => {
        showMessage(err.message, true);
        setLoading(false);
      });
  };

  const submitPasswordChangeHandler = async () => {
    if (!password) {
      showMessage("Password cannot be empty", true);
      return;
    }
    setLoading(true);
    await fetch(`http://localhost:3008/updatePassword/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${getCookie("token")}`,
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (!data.error) {
          showMessage("Password updated successfully", false);
          setPassword(""); 
        } else {
          showMessage(data.error, true);
        }
      })
      .catch((err) => {
        showMessage(err.message, true);
        setLoading(false);
      });
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <NavLink to="/">Home</NavLink>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={selectedImage}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px", height: "160px", margin: "auto" }}
                  fluid
                />
                <p className="text-muted mb-1">{currentUser.role}</p>

                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn
                    onClick={isEditing ? submitEditHandler : toggleEditMode}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="8">
            <MDBCard className="mb-4" style={{ gap: "30px", width: "860px" }}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Name:</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <input
                      className="text-muted data-input"
                      type="text"
                      name="name"
                      value={profileData.name || ""}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      style={{ width: "100%" }}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Username:</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <input
                      className="text-muted data-input"
                      type="text"
                      name="username"
                      value={profileData.username || ""}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      style={{ width: "100%" }}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email:</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <input
                      className="text-muted data-input"
                      type="email"
                      name="email"
                      value={profileData.email || ""}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      style={{ width: "100%" }}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Password:</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9" >
                    <input
                      className="text-muted data-input"
                      type={isEditing ? "password" : "text"}
                      name="password"
                      value={password || ""}
                      onChange={handlePasswordChange}
                      style={{ width: "100%" }}
                    />
                    {isEditing && (
                      <MDBBtn
                      onClick={submitPasswordChangeHandler}
                        style={{marginTop:"25px "}}
                      >
                        Change Password
                      </MDBBtn>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default UserProfile;