import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import ScheduleForm from '../components/ScheduleForm';
import '../css/CalendarPage.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleAddSchedule = (schedule) => {
    setSchedules([...schedules, schedule]);
  };

  return (
    <div className="calendar-page-container">
      <div className="calendar-section">
        <div className="calendar-header">
          <div className="month-box">
              {date.toLocaleString('en-US', { month: 'short' })}' {date.getFullYear()} 
          </div>
          <div className="nav-buttons">
            <button onClick={handlePrevMonth} className="calendar-nav-button">&lt;</button>
            <span className="dot">•</span>
            <button onClick={handleNextMonth} className="calendar-nav-button">&gt;</button>
          </div>
        </div>
        <hr />
        <Calendar date={date} />
      </div>
      <div className="schedule-section">
        <ScheduleForm onAddSchedule={handleAddSchedule} />
      </div>
    </div>
  );
};

export default CalendarPage;