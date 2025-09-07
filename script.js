const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i); // 8:00 - 20:00

let horariosJSON = null;

// Tabs
function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tabs button[data-tab='${tabName}']`).classList.add("active");
}

// Render botones de selección (salones/laboratorios/usos)
function renderSelectors(horarios) {
  // Salones
  const selectorSalones = document.getElementById('selector-salones');
  selectorSalones.innerHTML = '';
  Object.keys(horarios).filter(k=>k.toLowerCase().startsWith('salón')).forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.onclick = () => mostrarHorarioSalon(nombre);
    selectorSalones.appendChild(btn);
  });

  // Laboratorios
  const selectorLabs = document.getElementById('selector-laboratorios');
  selectorLabs.innerHTML = '';
  Object.keys(horarios).filter(k=>k.toLowerCase().startsWith('laboratorio')).forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.onclick = () => mostrarHorarioLaboratorio(nombre);
    selectorLabs.appendChild(btn);
  });

  // Usos múltiples (uno solo)
  const selectorUsos = document.getElementById('selector-usos');
  selectorUsos.innerHTML = '';
  ['Usos Múltiples','Salón de Usos Múltiples','Usos multiples'].forEach(nombre => {
    if (horarios[nombre]) {
      const btn = document.createElement('button');
      btn.textContent = nombre;
      btn.onclick = () => mostrarHorarioUsos(nombre);
      selectorUsos.appendChild(btn);
    }
  });
}

// Mostrar horarios
function convertirADatosEventos(nombre, horariosSalon) {
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

function renderCalendario(id, data) {
  const cont = document.getElementById(id);
  cont.innerHTML = "";
  cont.className = "calendario";
  cont.appendChild(document.createElement("div"));
  dias.forEach(d => {
    const diaHead = document.createElement("div");
    diaHead.textContent = d;
    diaHead.className = "dia-header";
    cont.appendChild(diaHead);
  });
  horas.forEach(h => {
    const horaDiv = document.createElement("div");
    horaDiv.textContent = `${h}:00`;
    horaDiv.className = "hora";
    cont.appendChild(horaDiv);
    dias.forEach(() => {
      const celda = document.createElement("div");
      cont.appendChild(celda);
    });
  });
  data.forEach((ev, idx) => {
    const diaIndex = dias.indexOf(ev.dia) + 2;
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

function mostrarHorarioSalon(nombre) {
  const div = document.getElementById('horario-salon');
  const eventos = convertirADatosEventos(nombre, horariosJSON[nombre]);
  renderCalendario('horario-salon', eventos);
}
function mostrarHorarioLaboratorio(nombre) {
  const div = document.getElementById('horario-laboratorio');
  const eventos = convertirADatosEventos(nombre, horariosJSON[nombre]);
  renderCalendario('horario-laboratorio', eventos);
}
function mostrarHorarioUsos(nombre) {
  const div = document.getElementById('horario-usos');
  const eventos = convertirADatosEventos(nombre, horariosJSON[nombre]);
  renderCalendario('horario-usos', eventos);
}

fetch('horarios.json')
  .then(r=>r.json())
  .then(data=>{
    horariosJSON = data;
    renderSelectors(horariosJSON);
  });
