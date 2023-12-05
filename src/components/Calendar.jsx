import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarMap() {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        getTrainings()
    }, []);

   // CalendarMap.js
const getTrainings = () => {
  fetch('https://traineeapp.azurewebsites.net/gettrainings')
    .then((response) => response.json())
    .then((data) => {
      const formattedTrainings = data.map((training) => {
        const customerName = training.customer
          ? `${training.customer.firstname} ${training.customer.lastname}`
          : 'Unknown Customer';

        return {
          title: `${training.activity} / ${customerName}`,
          start: moment(training.date).toDate(),
          end: moment(training.date).add(training.duration, "m").toDate(),
        };
      });
      setTrainings(formattedTrainings);
    })
    .catch((error) => console.error(error));
};

    
    return(
        <div>
            <Calendar
                localizer={localizer}
                events={trainings}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                tooltipAccessor={(event) => `${event.title} - ${moment(event.start).format('LT')} to ${moment(event.end).format('LT')}`}
                views={["month", "week", "day"]}
                defaultView="week"
                style={{ height: 500, width: '95%'}}
            />
        </div>
    )
}