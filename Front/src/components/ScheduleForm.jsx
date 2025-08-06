import React, { useState, useEffect } from 'react';
import '../css/ScheduleForm.css';

const ScheduleForm = ({ onAddSchedule, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, [selectedDate]);

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
      {!selectedDate && (
        <div className="no-date-selected">
          <p>Please select a date.</p>
        </div>
      )}
    </form>
  );
};

export default ScheduleForm;
