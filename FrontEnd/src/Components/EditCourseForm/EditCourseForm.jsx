import React, { useState, useEffect, useContext } from "react";
import {CurrentUserContext} from "../../App.jsx";
import { v4 } from 'uuid';

let errorList = [];

const EditCourseForm = ({ id, title, desc, hours, showEditFormHandler}) => {
    const [ form, setForm ] = useState({
        title: "",
        desc: "",
        hours: "",
    });
    const [ courseData, setCourseData ] = useState({});
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
        setForm({ title, desc, hours });
        setCourseData({ id, title, desc, hours});
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name === 'hours' && e.target.value && e.target.value < 1) {
            if (!errorList.includes('Hours must be greater than 0')) {
                errorList.push('Hours must be greater than 0');
            }
        } else {
            if (e.target.name === 'hours') {
                errorList = errorList.filter(e => e !== 'Hours must be greater than 0');
            }
        }

        if (e.target.name === 'hours' && e.target.value && isNaN(e.target.value)) {
            if (!errorList.includes('Hours must be a number')) {
                errorList.push('Hours must be a number');
            }
        } else {
            if (e.target.name === 'hours') {
                errorList = errorList.filter(e => e !== 'Hours must be a number');
            }
        }

        if (e.target.name === 'title' && e.target.value && !isNaN(e.target.value)) {
            if (!errorList.includes('Title must be a string')) {
                errorList.push('Title must be a string');
            }
        } else {
            if (e.target.name === 'title') {
                errorList = errorList.filter(e => e !== 'Title must be a string');
            }
        }

        if (e.target.name === 'desc' && e.target.value && !isNaN(e.target.value)) {
            if (!errorList.includes('Description must be a string')) {
                errorList.push('Description must be a string');
            }
        } else {
            if (e.target.name === 'desc') {
                errorList = errorList.filter(e => e !== 'Description must be a string');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!e.target.checkValidity()) return;
        if (errorList.length) return;

        editCourseHandler(courseData.id, form);
        showMessage("Course updated successfully", false);
        showEditFormHandler();
    };

    return (
        <div className="form-container">
            <h4 className="green-text alignCenter-text bold-text form-title">Edit Course</h4>
            {
                errorList.length > 0 &&
                    <div className="alert alert-danger">
                        {
                            errorList.map((error) =>
                                <div key={v4()}>
                                    <span style={{fontSize: "17px"}}>∗</span> {error}
                                </div>
                            )
                        }
                    </div>
            }
            <form className="form ps-2 pe-2" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="green-text bold-text">Title</label>
                    <input onChange={handleChange} value={form.title} type="text" id="title" name="title" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="desc" className="green-text bold-text">Description</label>
                    <textarea onChange={handleChange} value={form.desc} name="desc" id="desc" rows="10" cols="50" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="hours" className="green-text bold-text">Hours</label>
                    <input onChange={handleChange} value={form.hours} type="number" id="hours" name="hours" required/>
                </div>
                <div className='d-flex flex-column justify-content-between mt-2 mb-2'>
                    <button className="btn AddCourseButton" type="submit">Save</button>
                    <button className="btn btn-outline-danger CancelButton"
                            onClick={() => {
                                showEditFormHandler();
                                errorList = [];
                            }}
                            type="button">Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCourseForm;