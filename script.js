const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i); // 8:00 - 20:00

let horariosJSON = null;
let activeTab = 'salones';
let activeButton = null;

function openTab(tab) {
  activeTab = tab;
  // Tabs
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab-btn[data-tab='${tab}']`).classList.add("active");
  // Submenus
  document.getElementById("submenu-salones").style.display = tab === "salones" ? "" : "none";
  document.getElementById("submenu-laboratorios").style.display = tab === "laboratorios" ? "" : "none";
  document.getElementById("submenu-usos").style.display = tab === "usos" ? "" : "none";
  // Clear center
  document.getElementById("horario-espacio").innerHTML = `<p style="color:#888; text-align:center; margin-top:40px;">Select a space from the submenu.</p>`;
  if (activeButton) activeButton.classList.remove('active');
  activeButton = null;
}

function renderSubmenus(horarios) {
  // Salones submenu
  const submenuSalones = document.getElementById('submenu-salones');
  submenuSalones.innerHTML = '';
  let salones = Object.keys(horarios).filter(k=>k.toLowerCase().startsWith('salón')).slice(0,12);
  salones.forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.onclick = () => showSchedule(nombre, btn);
    submenuSalones.appendChild(btn);
  });

  // Laboratorios submenu
  const submenuLabs = document.getElementById('submenu-laboratorios');
  submenuLabs.innerHTML = '';
  let labs = Object.keys(horarios).filter(k=>k.toLowerCase().startsWith('laboratorio')).slice(0,4);
  labs.forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.onclick = () => showSchedule(nombre, btn);
    submenuLabs.appendChild(btn);
  });

  // Usos multiples (one button)
  const submenuUsos = document.getElementById('submenu-usos');
  submenuUsos.innerHTML = '';
  let usos = Object.keys(horarios).filter(k=>k.toLowerCase().includes('usos'));
  if(usos.length > 0) {
    const btn = document.createElement('button');
    btn.textContent = usos[0];
    btn.onclick = () => showSchedule(usos[0], btn);
    submenuUsos.appendChild(btn);
  }
}

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
function renderCalendario(id, data, nombre) {
  const cont = document.getElementById(id);
  cont.innerHTML = "";
  cont.className = "horario-container";
  // Title
  const tit = document.createElement("h2");
  tit.textContent = nombre;
  cont.appendChild(tit);
  // Table
  const cal = document.createElement("div");
  cal.className = "calendario";
  cont.appendChild(cal);
  cal.appendChild(document.createElement("div"));
  dias.forEach(d => {
    const diaHead = document.createElement("div");
    diaHead.textContent = d;
    diaHead.className = "dia-header";
    cal.appendChild(diaHead);
  });
  horas.forEach(h => {
    const horaDiv = document.createElement("div");
    horaDiv.textContent = `${h}:00`;
    horaDiv.className = "hora";
    cal.appendChild(horaDiv);
    dias.forEach(() => {
      const celda = document.createElement("div");
      cal.appendChild(celda);
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
    cal.appendChild(evento);
  });
}
function showSchedule(nombre, btn) {
  if(activeButton) activeButton.classList.remove('active');
  btn.classList.add('active');
  activeButton = btn;
  const eventos = convertirADatosEventos(nombre, horariosJSON[nombre]);
  renderCalendario('horario-espacio', eventos, nombre);
}

// Form
const form = document.getElementById("my-form");
if(form){
  async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        status.innerHTML = "¡Gracias por tu solicitud!";
        form.reset()
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
          } else {
            status.innerHTML = "Oops! There was a problem sending your form"
          }
        })
      }
    }).catch(error => {
      status.innerHTML = "Oops! There was a problem sending your form"
    });
  }
  form.addEventListener("submit", handleSubmit)
}

fetch('horarios.json')
  .then(r=>r.json())
  .then(data=>{
    horariosJSON = data;
    renderSubmenus(horariosJSON);
  });

// Default show salones submenu
window.onload = function() {
  openTab('salones');
};
