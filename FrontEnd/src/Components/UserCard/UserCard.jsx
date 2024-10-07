import React, { useContext } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCardText,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { CurrentUserContext } from "../../App";
import ReactImg from "../../assets/React.png";

const UserCard = ({ isStudent, student, instructor }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const RemoveUser = () => {
    alert(
      isStudent ? "Remove Student coming soon" : "Remove Instructor coming soon"
    );
  };

  const ViewProgress = () => {
    navigate(`/ViewProgress/${isStudent ? student.id : instructor.id}`);
  };

  return (
    <MDBCard className="mb-4 card-shadow">
      <MDBRow className="g-0">
        <MDBCol md="4">
          <MDBCardImage src={ReactImg} alt="User" fluid />
        </MDBCol>
        <MDBCol md="8">
          <MDBCardBody>
            <MDBCardText>
              {isStudent ? student.name : instructor.name} <br />
              {isStudent ? student.username : instructor.username}
            </MDBCardText>
            {(currentUser.role === "Admin" ||
              currentUser.role === "SuperAdmin") && (
              <FontAwesomeIcon
                icon={faTrash}
                color="red"
                onClick={RemoveUser}
              />
            )}
            {currentUser.role === "Student" &&
              currentUser.id === student.id && (
                <MDBBtn onClick={ViewProgress}>My Progress</MDBBtn>
              )}
            {currentUser.role === "Instructor" && (
              <MDBBtn onClick={ViewProgress}>Progress</MDBBtn>
            )}
          </MDBCardBody>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
};

export default UserCard;
