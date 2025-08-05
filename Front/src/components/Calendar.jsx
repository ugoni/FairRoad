import React from 'react';
import '../css/Calendar.css';

const Calendar = ({ date }) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDateOfMonth = lastDayOfMonth.getDate();

  const prevMonthLastDate = new Date(year, month, 0).getDate(); 

  const emptyDates = Array.from({ length: firstDayOfWeek }, (_, i) => ({
    date: prevMonthLastDate - firstDayOfWeek + i + 1,
    isOtherMonth: true
  }));

  const dates = Array.from({ length: lastDateOfMonth }, (_, i) => ({
    date: i + 1,
    isOtherMonth: false
  }));

  const totalCells = 42; 
  const trailingEmptyCount = totalCells - (emptyDates.length + dates.length);
  const trailingEmptyDates = Array.from({ length: trailingEmptyCount }, (_, i) => ({
    date: i + 1,
    isOtherMonth: true
  }));

  const allDates = [...emptyDates, ...dates, ...trailingEmptyDates];

  return (
    <div className="calendar">
      <div className="days">
        {days.map(day => (
          <div key={day} className={`day ${day === 'SUN' ? 'sunday' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="dates">
        {allDates.map((item, idx) => {
          const thisDate = item.date;
          let fullDate;
          if (item.isOtherMonth) {
            if (idx < 7) { 
              fullDate = new Date(year, month - 1, thisDate);
            } else { 
              fullDate = new Date(year, month + 1, thisDate);
            }
          } else {
            fullDate = new Date(year, month, thisDate);
          }

          const dayOfWeek = fullDate.getDay();
          const isSunday = dayOfWeek === 0;
          const classes = ['date'];
          if (item.isOtherMonth) classes.push('other-month');
          if (isSunday) classes.push('sunday-date');

          return (
            <div key={idx} className={classes.join(' ')}>
              {thisDate}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
