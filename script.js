// Tabs
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Accordion
const accBtns = document.querySelectorAll(".accordion-btn");
accBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const panel = btn.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

// Horarios de ejemplo
const horarios = {
  "salon1": [
    { dia: "Lunes", materia: "Matemáticas para químicos", inicio: "08:00", fin: "10:00" },
    { dia: "Lunes", materia: "Normatividad", inicio: "10:00", fin: "11:30" },
    { dia: "Martes", materia: "Física", inicio: "08:00", fin: "10:00" }
  ],
  "salon2": [
    { dia: "Lunes", materia: "Toxicología", inicio: "09:30", fin: "11:30" }
  ]
};

const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i);

function renderCalendario(id, data) {
  const cont = document.getElementById(id);
  if(!cont) return;

  // Estructura grid
  cont.innerHTML = "";
  horas.forEach(h => {
    const horaDiv = document.createElement("div");
    horaDiv.className = "hora";
    horaDiv.style.gridRow = `${h-7}`;
    horaDiv.textContent = `${h}:00`;
    cont.appendChild(horaDiv);
    dias.forEach(() => {
      const diaDiv = document.createElement("div");
      diaDiv.className = "dia";
      diaDiv.style.gridRow = `${h-7}`;
      cont.appendChild(diaDiv);
    });
  });

  // Eventos
  data.forEach(ev => {
    const diaIndex = dias.indexOf(ev.dia) + 2; // +1 hora +1 offset
    const inicio = parseFloat(ev.inicio.replace(":", "." ).replace("30",".5"));
    const fin = parseFloat(ev.fin.replace(":", "." ).replace("30",".5"));
    const top = (inicio-8)*40; // px por hora
    const height = (fin-inicio)*40;

    const evento = document.createElement("div");
    evento.className = "evento";
    evento.style.top = `${top}px`;
    evento.style.height = `${height}px`;
    evento.textContent = ev.materia;

    const col = cont.querySelector(`.dia:nth-of-type(${diaIndex})`);
    col.appendChild(evento);
  });
}

renderCalendario("salon1", horarios.salon1);
renderCalendario("salon2", horarios.salon2);
