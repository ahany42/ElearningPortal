import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import styled from "styled-components";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";
import {
  faUser,
  faChalkboardTeacher,
  faFileAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CourseDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CurrentUserContext } from "../../App";
import CourseMaterial from "../CourseMaterial/CourseMaterial";
import NotFoundImg from "../../assets/404.svg";
import Placeholder from "../Placeholder/Placeholder";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AccessDenied from "../../assets/AccessDenied.svg";
import CaughtUp from "../../assets/Grades.svg";
import Front_ENV from "../../../Front_ENV.jsx";
import { getCookie } from "../Cookie/Cookie.jsx";
import Loader from "../Loader/Loader.jsx";

const DetailsHeaderDiv = styled.div`
  position: relative;

  &::before {
    content: "";
    background-image: url(${(props) =>
      props.$image
        ? `${Front_ENV.Back_Origin}/${props.$image}`
        : CoursePlaceHolder});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.2;
  }
`;

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    showMessage,
    courses,
    fetchCourses,
    materials,
    isAuthenticated,
    confirmationToast,
    setMaterials,
  } = useContext(CurrentUserContext);
  const [loader, setLoader] = useState(true);
  const route = useLocation();
  const course = courses.find((course) => course.id === id);

  const fetchMaterials = async () => {
    const params = new URLSearchParams({
      courseId: id,
    });
    // Fetch materials for the student
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseMaterials?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((res) => res.json());

    setTimeout(() => setLoader(false), 500);

    if (response.data) {
      setMaterials(response.data);
    } else {
      setMaterials([]);
      showMessage(response.error, true);
    }
  };

  const fetchData = async () => {
    await fetchCourses();
    isAuthenticated && (await fetchMaterials());
  };

  useEffect(() => {
    if (id === `undefined` || !id) {
      navigate("/Courses");
      return;
    }
    fetchData();
  }, [route]);

  const EnrollCourse = async (courseID) => {
    if (!isAuthenticated) {
      showMessage("Please Login to Enroll", true);
      navigate("/login");
      return;
    }

    const confirm = await confirmationToast(
      "Are you sure you want to enroll in this course?"
    );
    if (confirm) {
      setLoader(true);
      const response = await fetch(`${Front_ENV.Back_Origin}/enroll-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: courseID,
          duration: course.hours,
        }),
      }).then((response) => response.json());
      setLoader(false);
      if (response.error) {
        showMessage(response.error, true);
      } else {
        fetchCourses();
        showMessage(response.message, false);
      }
    }
  };

  const AddMaterial = () => {
    navigate(`/AddMaterial/${course.id}`);
  };
  const AssignInstructor = async (courseId) => {
    setLoader(true);
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getUsers?role=Instructor`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());
    setLoader(false);
    navigate(`/AssignInstructor/${courseId}`, {
      state: { instructorsList: response.data, assignInstructor: true },
    });
  };
  const StudentsList = async () => {
    setLoader(true);
    const params = new URLSearchParams({
      courseId: id,
      type: "students",
    });
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseUsersList?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());
    setLoader(false);
    navigate(`/CourseDetails/${id}/StudentsList`, {
      state: { studentsList: response.data },
    });
  };

  const InstructorsList = async () => {
    setLoader(true);
    const params = new URLSearchParams({
      courseId: id,
      type: "instructors",
    });
    const response = await fetch(
      `${Front_ENV.Back_Origin}/getCourseUsersList?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token") || "",
        },
      }
    ).then((response) => response.json());
    setLoader(false);
    navigate(`/CourseDetails/${id}/InstructorsList`, {
      state: { instructorsList: response.data },
    });
  };

  return course ? (
    <>
      <div className="buttons-container">
        <button
          className="goBackBtn"
          style={{ top: "12px", left: "60px" }}
          onClick={() => {
            if (route.state && route.state.progress) {
              navigate(-1);
            } else {
              navigate(`/Courses`);
            }
          }}
        >
          <svg
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Back</span>
        </button>
        {currentUser.role === "Instructor" && course.isEnrolled && (
          <div className="add-material-button-container">
            <button className="AddButton add-material" onClick={AddMaterial}>
              <FontAwesomeIcon icon={faPlus} title="Add Course" />
              Add Material
            </button>
          </div>
        )}
      </div>
      <div className="card course-details card-shadow">
        {/* check if instructor is teaching this course */}
        <DetailsHeaderDiv
          className="card-header details-header"
          $image={course.image ? course.image.replaceAll("\\", "/") : ""}
        >
          <h3 className="course-title alignLeft-text bold-text">
            {course.title}
          </h3>
          <div className="course-stats">
            <h6 className="stats">
              {course.hours} <FontAwesomeIcon icon={faClock} />
            </h6>
            <h6
              className={
                course.isEnrolled || currentUser.role === "Admin"
                  ? "stats stats-button"
                  : "stats"
              }
              onClick={
                course.isEnrolled || currentUser.role === "Admin"
                  ? StudentsList
                  : null
              }
            >
              {course.numStudents} <FontAwesomeIcon icon={faUser} />
            </h6>
            <h6
              className={
                course.isEnrolled || currentUser.role === "Admin"
                  ? "stats stats-button"
                  : "stats"
              }
              onClick={
                course.isEnrolled || currentUser.role === "Admin"
                  ? InstructorsList
                  : null
              }
            >
              {course.numInstructors}
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </h6>
            <h6 className="stats">
              {course.materialCount} <FontAwesomeIcon icon={faFileAlt} />
            </h6>
          </div>
          {currentUser.role === "Student" || !currentUser.role ? (
            !course.isEnrolled ? (
              <button
                className="enroll-button-courseDetails bold-text"
                onClick={() => EnrollCourse(course.id)}
              >
                Enroll
              </button>
            ) : (
              <p
                className="blue-text bold-text"
                style={{ height: "fit-content" }}
              >
                Enrolled
              </p>
            )
          ) : null}
          {(currentUser.role === "Admin" ||
            currentUser.role === "SuperAdmin") && (
            <button
              className="enroll-button-courseDetails bold-text"
              onClick={() => AssignInstructor(course.id)}
            >
              Assign Instructor
            </button>
          )}
          <h5 className="course-description">{course.desc}</h5>
        </DetailsHeaderDiv>
        {currentUser.role &&
        (course.isEnrolled ||
          currentUser.role.toLowerCase() === "admin" ||
          currentUser.role.toLowerCase() === "superadmin") ? (
          <div
            className="course-material card-body"
            style={loader ? { minHeight: "400px", background: "#d8d8d8" } : {}}
          >
            <h5>Added Material:</h5>
            {loader ? (
              <Loader />
            ) : materials.length ? (
              <div className="material-list">
                <CourseMaterial courseId={course.id} />
              </div>
            ) : (
              <Placeholder text="You're all caught up" img={CaughtUp} />
            )}
          </div>
        ) : (
          <Placeholder
            text="Enroll to course to view Material"
            img={AccessDenied}
          />
        )}
      </div>
    </>
  ) : (
    <Placeholder text="Course Not Found" img={NotFoundImg} />
  );
};

export default CourseDetails;
