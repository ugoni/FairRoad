import React, { useState } from 'react';
import '../css/ScheduleForm.css';

const ScheduleForm = ({ onAddSchedule }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddSchedule({ title, date });
    setTitle('');
    setDate('');
  };

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="form-footer">
        <span className="label-text">My Schedule</span>
        <button type="submit" className="add-button">Add event</button>
      </div>
    </form>
  );
};

export default ScheduleForm;
