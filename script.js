const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const horas = Array.from({length:13},(_,i)=>8+i); // 8:00 - 20:00

let horariosJSON = null;
let botonActivo = null;

function renderSidebarButtons(horarios) {
  // Salones
  const salones = Object.keys(horarios).filter(k=>k.toLowerCase().startsWith('salón'));
  const labs = Object.keys(horarios).filter(k=>k.toLowerCase().startsWith('laboratorio'));
  const usos = Object.keys(horarios).filter(k=>k.toLowerCase().includes('usos'));
  const divSal = document.getElementById('lista-salones');
  const divLab = document.getElementById('lista-laboratorios');
  const divUsos = document.getElementById('lista-usos');
  divSal.innerHTML = ""; divLab.innerHTML = ""; divUsos.innerHTML = "";

  salones.forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.className = "sidebar-btn";
    btn.onclick = ()=>selectEspacio(nombre, btn);
    divSal.appendChild(btn);
  });
  labs.forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.className = "sidebar-btn";
    btn.onclick = ()=>selectEspacio(nombre, btn);
    divLab.appendChild(btn);
  });
  usos.forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.className = "sidebar-btn";
    btn.onclick = ()=>selectEspacio(nombre, btn);
    divUsos.appendChild(btn);
  });
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
  // Titulo
  const tit = document.createElement("h2");
  tit.textContent = nombre;
  cont.appendChild(tit);
  // Tabla
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
function selectEspacio(nombre, btn) {
  if(botonActivo) botonActivo.classList.remove('active');
  btn.classList.add('active');
  botonActivo = btn;
  const eventos = convertirADatosEventos(nombre, horariosJSON[nombre]);
  renderCalendario('horario-espacio', eventos, nombre);
}

// Formulario
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
            status.innerHTML = "Oops! Hubo un problema al enviar tu formulario"
          }
        })
      }
    }).catch(error => {
      status.innerHTML = "Oops! Hubo un problema al enviar tu formulario"
    });
  }
  form.addEventListener("submit", handleSubmit)
}

fetch('horarios.json')
  .then(r=>r.json())
  .then(data=>{
    horariosJSON = data;
    renderSidebarButtons(horariosJSON);
  });
