import {useEffect, useState} from "react";
import './AddForm.css';

const AddForm = ({ addHandler, showFormHandler }) => {
    const [error, setError] = useState('');
    const [form, setForm] = useState({ title: '', desc: '', hours: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name === 'hours' && e.target.value && e.target.value < 1) {
            setError('Hours must be greater than 0');
            return;
        } else if (e.target.name === 'hours' && e.target.value && isNaN(e.target.value)) {
            setError('Hours must be a number');
            return;
        } else {
            setError('');
        }

        if (e.target.name === 'title' && e.target.value && !isNaN(e.target.value)) {
            setError('Title must be a string');
            return;
        } else {
            setError('');
        }

        if (e.target.name === 'desc' && e.target.value && !isNaN(e.target.value)) {
            setError('Description must be a string');
        } else {
            setError('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!e.target.checkValidity()) return;

        const { title, desc, hours } = e.target;
        setError('');
        addHandler({ title: title.value, desc: desc.value, hours: hours.value});
        showFormHandler();
    }

    return (
        <div className="form-container">
            {
                error && <div className="alert alert-danger">{error}</div>
            }
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="light-text">Title</label>
                    <input onChange={handleChange} value={form.title} type="text" id="title" name="title" required />
                </div>
                <div className="form-group">
                    <label htmlFor="desc" className="light-text">Description</label>
                    <textarea onChange={handleChange} value={form.desc} name="desc" id="desc" rows="10" cols="50" required />
                </div>
                <div className="form-group">
                    <label htmlFor="hours" className="light-text">Hours</label>
                    <input onChange={handleChange} value={form.hours} type="number" id="hours" name="hours" required />
                </div>
                <div className='d-flex flex-column justify-content-between mt-2 mb-2 ps-2 pe-2'>
                    <button className="btn blue-bg light-text AddCourseButton" type="submit">Add</button>
                    <button className="btn btn-outline-danger  CancelButton" onClick={showFormHandler} type="button">Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default AddForm;
