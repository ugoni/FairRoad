import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import '../css/CalendarPage.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div>
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
      <Calendar date={date} />
    </div>
  );
};

export default CalendarPage;