const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i); // 8:00 - 20:00

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

// Ejemplo de datos
const salon1 = [
  {dia:"Lunes", inicio:"08:00", fin:"10:00", materia:"Matemáticas para químicos"},
  {dia:"Lunes", inicio:"10:00", fin:"11:30", materia:"Normatividad y legislación"},
  {dia:"Martes", inicio:"08:00", fin:"10:00", materia:"Física e introducción a la fisicoquímica"},
  {dia:"Viernes", inicio:"16:00", fin:"18:30", materia:"Análisis químico"},
];

const salon2 = [
  {dia:"Lunes", inicio:"09:30", fin:"11:30", materia:"Toxicología"},
  {dia:"Lunes", inicio:"12:00", fin:"13:30", materia:"Síntesis de Fármacos"},
  {dia:"Miércoles", inicio:"15:00", fin:"18:00", materia:"Laboratorio de hematología Clínica"},
];

// Render
renderCalendario("cal-salon1", salon1);
renderCalendario("cal-salon2", salon2);

// Tabs
function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tabs button[data-tab='${tabName}']`).classList.add("active");
}
