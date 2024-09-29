import React, {useContext, useState} from "react";
import './AddAssignmentForm.css';
import {CurrentUserContext} from "../../App.jsx";
import {v4} from "uuid";
import {MenuItem, Select} from "@mui/material";

let errorList = [];

const AddAssignmentForm = ({ addHandler, showFormHandler }) => {
    const [ error, setError ] = useState('');
    const [ form, setForm ] = useState({ title: '', desc: '', due: '', course: '' });
    const { showMessage, setCourses, courses } = useContext(CurrentUserContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

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

        const { title, desc, due, course } = e.target;
        addHandler({ title: title.value, description: desc.value, id: v4(),
            dueDate: due.value, courseID: courses.find(c => c.title === course.value).id });
        showMessage('Course added successfully', false);
        showFormHandler();
    }

    return (
        <div className="form-container">
            <h4 className="green-text alignCenter-text bold-text form-title">Add Assignment</h4>
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
                <div className="d-flex justify-content-between gap-3">
                    <div className="form-group justify-content-between">
                        <label htmlFor="due" className="green-text bold-text">Due Date</label>
                        <input onChange={handleChange} value={form.due}
                               style={{height: "57px"}}
                               type="date" id="due" name="due" required/>
                    </div>
                    <div className="form-group flex-grow-1">
                        <label htmlFor="course" className="green-text bold-text">Course</label>
                        <Select
                            sx={{
                                borderRadius: "8px",
                                border: "2px solid #274546",
                                fontWeight: "600",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                }
                            }}
                            fullWidth
                            value={form.course || courses[0].title}
                            id="course"
                            onChange={handleChange}
                            name="course"
                        >
                            {courses.map((course) => (
                                <MenuItem
                                    key={course.id}
                                    value={course.title}
                                >
                                    {course.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="desc" className="green-text bold-text">Description</label>
                    <textarea onChange={handleChange} value={form.desc} name="desc" id="desc" rows="10" cols="50" required/>
                </div>

                <div className='d-flex flex-column justify-content-between mt-2 mb-2'>
                    <button className="btn AddCourseButton" type="submit">Add</button>
                    <button className="btn btn-outline-danger CancelButton"
                            onClick={() => {
                                showFormHandler();
                                errorList = [];
                            }}
                            type="button">Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddAssignmentForm;
