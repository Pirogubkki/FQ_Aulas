document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'es',
    allDaySlot: false,
    slotMinTime: "07:00:00",
    slotMaxTime: "21:00:00",
    events: [
      {
        title: 'Clase Matemáticas',
        start: '2025-09-01T09:00:00',
        end: '2025-09-01T11:00:00',
        color: 'blue' // Todo el semestre
      },
      {
        title: 'Conferencia',
        start: '2025-09-02T15:00:00',
        end: '2025-09-02T17:00:00',
        color: 'green' // Única ocasión
      }
    ]
  });

  calendar.render();

  // Manejo del formulario
  document.getElementById('formReserva').addEventListener('submit', function(e) {
    e.preventDefault();

    const salon = document.getElementById('formSalon').value;
    const fecha = document.getElementById('fecha').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFin = document.getElementById('horaFin').value;
    const tipo = document.getElementById('tipoReserva').value;

    // Asignar color según tipo
    let color = 'gray';
    if (tipo === 'unica') color = 'green';
    if (tipo === 'mes') color = 'orange';
    if (tipo === 'semestre') color = 'blue';

    // Agregar al calendario
    calendar.addEvent({
      title: `Reserva ${salon}`,
      start: `${fecha}T${horaInicio}`,
      end: `${fecha}T${horaFin}`,
      color: color
    });

    alert(`Solicitud enviada para el salón ${salon} el ${fecha}.`);

    this.reset();
  });
});
