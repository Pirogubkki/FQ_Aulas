const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i); // 8:00 - 20:00

// Convierte los datos del horario de un salón al formato de eventos
function convertirSalonADatosEventos(nombreSalon, horariosSalon) {
  const eventos = [];
  dias.forEach(dia => {
    if (horariosSalon[dia]) {
      horariosSalon[dia].forEach(clase => {
        eventos.push({
          dia: dia,
          inicio: clase.inicio,
          fin: clase.fin,
          materia: clase.materia
        });
      });
    }
  });
  return eventos;
}

// Renderiza todos los salones desde el JSON
function renderizarTodosLosSalones(horarios) {
  const contSalones = document.getElementById('contenedor-salones');
  contSalones.innerHTML = "";
  Object.keys(horarios).forEach(nombreSalon => {
    if (!nombreSalon.toLowerCase().startsWith("salón")) return;
    const h3 = document.createElement("h3");
    h3.textContent = nombreSalon;
    contSalones.appendChild(h3);

    const divCal = document.createElement("div");
    divCal.id = `cal-${nombreSalon.replace(/\s+/g, '').toLowerCase()}`;
    contSalones.appendChild(divCal);

    const eventos = convertirSalonADatosEventos(nombreSalon, horarios[nombreSalon]);
    renderCalendario(divCal.id, eventos);
  });
}

// Función para renderizar un calendario
function renderCalendario(id, data) {
  const cont = document.getElementById(id);
  if(!cont) return;

  cont.innerHTML = "";
  cont.className = "calendario";

  // Celda vacía arriba izquierda
  cont.appendChild(document.createElement("div"));

  // Encabezados de días
  dias.forEach(d => {
    const diaHead = document.createElement("div");
    diaHead.textContent = d;
    diaHead.className = "dia-header";
    cont.appendChild(diaHead);
  });

  // Filas de horas
  horas.forEach(h => {
    // Columna de hora
    const horaDiv = document.createElement("div");
    horaDiv.textContent = `${h}:00`;
    horaDiv.className = "hora";
    cont.appendChild(horaDiv);

    // Celdas vacías
    dias.forEach(() => {
      const celda = document.createElement("div");
      cont.appendChild(celda);
    });
  });

  // Render de eventos
  data.forEach((ev, idx) => {
    const diaIndex = dias.indexOf(ev.dia) + 2; // col (1=hora, 2-6=días)
    const inicio = parseFloat(ev.inicio.replace(":30",".5").replace(":00",".0"));
    const fin = parseFloat(ev.fin.replace(":30",".5").replace(":00",".0"));

    const rowStart = Math.floor((inicio-8)*2)+2; 
    const duration = (fin - inicio)*2;

    const evento = document.createElement("div");
    evento.className = `evento color-${(idx % 5)+1}`;
    evento.style.gridColumn = diaIndex;
    evento.style.gridRow = `${rowStart} / span ${duration}`;
    evento.textContent = ev.materia;

    cont.appendChild(evento);
  });
}

// Tabs
function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tabs button[data-tab='${tabName}']`).classList.add("active");
}

// Carga horarios.json y muestra los calendarios
fetch('horarios.json')
  .then(resp => resp.json())
  .then(horarios => {
    renderizarTodosLosSalones(horarios);
    // Aquí puedes agregar lógica para laboratorios y usos múltiples si lo deseas
  })
  .catch(e => {
    console.error("Error cargando horarios.json", e);
  });
