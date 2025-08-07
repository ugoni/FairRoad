
import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import ScheduleForm from '../components/ScheduleForm';
import '../css/CalendarPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleAddSchedule = (schedule) => {
    setSchedules([...schedules, schedule]);
  };

  const handleDateClick = (clickedDate) => {
    setSelectedDate(clickedDate);
  };

  const [showNewEventForm, setShowNewEventForm] = useState(false);

  return (
    <div className="container-fluid calendar-page-container">
      {showNewEventForm && <div className="background-dim-only" />} 
      <div className="row content-layer">
        <div className="col-lg-6 calendar-section">
          <div className="calendar-header">
            <div className="month-box">
                {date.toLocaleString('en-US', { month: 'short' })} '{date.getFullYear()} 
            </div>
            <div className="nav-buttons">
              <button onClick={handlePrevMonth} className="btn btn-light calendar-nav-button">&lt;</button>
              <span className="dot">•</span>
              <button onClick={handleNextMonth} className="btn btn-light calendar-nav-button">&gt;</button>
            </div>
          </div>
          <hr />
          <Calendar date={date} onDateClick={handleDateClick} selectedDate={selectedDate} />
        </div>
        <div className="col-lg-6 schedule-section">
          <ScheduleForm onAddSchedule={handleAddSchedule} selectedDate={selectedDate} 
            showNewEventForm={showNewEventForm}
            setShowNewEventForm={setShowNewEventForm}/>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 
