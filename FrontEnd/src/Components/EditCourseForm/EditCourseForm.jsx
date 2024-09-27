import React, { useState, useEffect, useContext } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {CurrentUserContext} from "../../App.jsx";

const EditCourseForm = () => {
    const [form, setForm] = useState({
        title: "",
        desc: "",
        hours: "",
    });
    const [courseData, setCourseData] = useState({});
    const routeState = useLocation().state;
    const { showMessage, setCourses } = useContext(CurrentUserContext);

    const editCourseHandler = (id, updatedCourse) => {
        setCourses( prevState => {
            return prevState.map((course) => {
                if (course.id === id) {
                    return updatedCourse;
                }
                return course;
            });
        });
    };

    useEffect(() => {
        if (routeState) {
            setForm({
                title: routeState.title,
                desc: routeState.desc,
                hours: routeState.hours,
            });
            setCourseData(routeState);
        } else {
            showMessage("Course not found", true);
            navigate("/courses");
        }
    }, []);

    const navigate=useNavigate()
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            editCourseHandler(courseData.id, form);
            showMessage("Course updated successfully", false);
            navigate("/courses");
        } catch (error) {
            showMessage("Unexpected error occurred, please try again", true);
        }
    };

    return (
        <div className="course-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="desc"
                        value={form.desc}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Hours</label>
                    <input
                        type="number"
                        name="hours"
                        value={form.hours}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="d-flex flex-column justify-content-between mt-2 mb-2">
                    <button className="btn SaveCourseButton" type="submit">
                        Save
                    </button>
                    <button
                        className="btn btn-outline-danger CancelButton"
                        type="button"
                        onClick={() => navigate("/courses")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCourseForm;