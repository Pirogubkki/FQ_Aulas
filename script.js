document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  let currentSalon = "Laboratorio 1"; // Salón por defecto
  let calendar;

  // Inicializar calendario
  function initCalendar(events) {
    if (calendar) calendar.destroy();

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "timeGridWeek",
      locale: "es",
      slotMinTime: "07:00:00",
      slotMaxTime: "22:00:00",
      events: events.filter(e => e.salon === currentSalon),
    });

    calendar.render();
  }

  // Cargar eventos desde JSON
  fetch("events.json")
    .then(res => res.json())
    .then(data => {
      initCalendar(data);

      // Llenar select del formulario
      const salonSelect = document.getElementById("salonSelect");
      const salones = [...new Set(data.map(e => e.salon))];
      salones.forEach(s => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        salonSelect.appendChild(option);
      });

      // Manejo de pestañas
      document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active", "bg-blue-600", "text-white"));
          btn.classList.add("active", "bg-blue-600", "text-white");
          currentSalon = btn.dataset.salon;
          initCalendar(data);
        });
      });

      // Formulario de reserva -> Google Sheets
      document.getElementById("reservaForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const payload = Object.fromEntries(formData.entries());

        // Enviar a Google Apps Script (crear script web en Google Sheets)
        fetch("TU_URL_DE_GOOGLE_APPS_SCRIPT", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(() => {
          document.getElementById("statusMsg").textContent = "Solicitud enviada. Espera aprobación.";
          this.reset();
        });
      });
    });
});
  });
});
