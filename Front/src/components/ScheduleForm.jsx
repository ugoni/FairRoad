import React, { useState, useEffect } from 'react';
import '../css/ScheduleForm.css';

const ScheduleForm = ({ onAddSchedule, selectedDate,showNewEventForm, setShowNewEventForm }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [etc, setEtc] = useState('');

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
      setShowNewEventForm(false);
    }
  }, [selectedDate, setShowNewEventForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddSchedule({ title, date, duration, location, etc });
    setTitle('');
    setDuration('');
    setLocation('');
    setEtc('');
    setShowNewEventForm(false);
  };

  const handleAddEventClick = () => {
    if (selectedDate) {
      setShowNewEventForm(true);
    }
  };

  const handleCancel = () => {
    setShowNewEventForm(false);
    setTitle('');
    setDuration('');
    setLocation('');
    setEtc('');
  };

  return (
    <div className="schedule-form-container">
      <div className="form-footer">
        <span className="label-text">My Schedule</span>
        <button type="button" className="add-button" onClick={handleAddEventClick}>Add event</button>
      </div>

      {showNewEventForm && (
        <div className="schedule-overlay" onClick={handleCancel}>
          <div className="schedule-box" onClick={(e) => e.stopPropagation()}>
            <form className="new-event-form" onSubmit={handleSubmit}>
              <div className='new-event-row'>
                <input
                  type="text"
                  className="schedule-input"
                  placeholder="New Event"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <button type="submit" className="finish-button">Finish</button>
              </div>
              <hr className='schedule-hr'/>
              <input
                type="text"
                className="schedule-input"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <hr className='schedule-hr'/>
              <input
                type="text"
                className="schedule-input"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <hr className='schedule-hr'/>
              <input
                type="text"
                className="schedule-input"
                placeholder="Add Memo, URL, etc..."
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
              />
              <div className="new-event-buttons">
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!selectedDate && !showNewEventForm && (
        <div className="no-date-selected">
          <p>Please select a date.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;
