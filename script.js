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

// JSON de horarios
const horarios = {
  "salon1": [
    { dia: "Lunes", materia: "Matemáticas para químicos", inicio: "08:00", fin: "10:00" },
    { dia: "Lunes", materia: "Normatividad", inicio: "10:00", fin: "11:30" }
  ],
  "salon2": [
    { dia: "Lunes", materia: "Toxicología", inicio: "09:30", fin: "11:30" }
  ],
  "salon3": [],
  "salon4": [],
  "salon5": [],
  "salon6": [],
  "salon7": [],
  "salon8": [],
  "salon9": [],
  "salon10": [],
  "salon11": [],
  "salon12": [],
  "lab1": [],
  "lab2": [],
  "lab3": [],
  "lab4": [],
  "usosMultiples": []
};

// Configuración base
const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i); // 8:00 - 20:00

function renderCalendario(id, data) {
  const cont = document.getElementById(id);
  if(!cont) return;

  // Grid básico
  cont.innerHTML = "";
  cont.style.display = "grid";
  cont.style.gridTemplateColumns = "80px repeat(5, 1fr)";
  cont.style.position = "relative";
  cont.style.border = "1px solid #ddd";
  cont.style.height = "600px";

  horas.forEach(h => {
    const horaDiv = document.createElement("div");
    horaDiv.className = "hora";
    horaDiv.textContent = `${h}:00`;
    horaDiv.style.gridColumn = "1";
    horaDiv.style.borderTop = "1px solid #eee";
    horaDiv.style.fontSize = "12px";
    horaDiv.style.textAlign = "right";
    horaDiv.style.paddingRight = "4px";
    cont.appendChild(horaDiv);

    dias.forEach(() => {
      const diaDiv = document.createElement("div");
      diaDiv.className = "dia";
      diaDiv.style.borderLeft = "1px solid #eee";
      cont.appendChild(diaDiv);
    });
  });

  // Render eventos
  data.forEach(ev => {
    const diaIndex = dias.indexOf(ev.dia) + 2;
    const inicio = parseFloat(ev.inicio.replace(":", "." ).replace("30",".5"));
    const fin = parseFloat(ev.fin.replace(":", "." ).replace("30",".5"));
    const top = (inicio-8)*40; // 40px por hora
    const height = (fin-inicio)*40;

    const evento = document.createElement("div");
    evento.className = "evento";
    evento.style.position = "absolute";
    evento.style.top = `${top}px`;
    evento.style.left = `${(diaIndex-1)*16.6}%`;
    evento.style.width = "16%";
    evento.style.height = `${height}px`;
    evento.style.background = "rgba(52,199,89,0.85)";
    evento.style.borderRadius = "6px";
    evento.style.color = "white";
    evento.style.fontSize = "12px";
    evento.style.padding = "4px";
    evento.textContent = ev.materia;

    cont.appendChild(evento);
  });
}

// Render de todos
Object.keys(horarios).forEach(id => {
  renderCalendario(id, horarios[id]);
});
