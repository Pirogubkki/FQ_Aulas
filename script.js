document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  // Ejemplo de eventos internos (sin JSON externo)
  const eventos = [
    {
      title: "Clase de Química",
      start: "2025-09-08T09:00:00",
      end: "2025-09-08T11:00:00",
      color: "#f87171",
      salon: "Laboratorio 1"
    },
    {
      title: "Laboratorio Biología",
      start: "2025-09-09T13:00:00",
      end: "2025-09-09T15:00:00",
      color: "#34d399",
      salon: "Laboratorio 2"
    }
  ];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    locale: "es",
    slotMinTime: "07:00:00",
    slotMaxTime: "22:00:00",
    events: eventos
  });

  calendar.render();
});
