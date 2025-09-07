// Tabs logic
function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.tabs button[data-tab="'+tabName+'"]').classList.add('active');
}

// Sidebar logic (optional)
function openSidebar() {
  document.getElementById('sidebar').classList.add('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
}

// Config
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const H_INICIO = 8, H_FIN = 20; // 8am to 8pm

let horarios = {};
fetch('horarios.json')
  .then(r => r.json())
  .then(data => {
    horarios = data;
    cargarSubmenuSalones();
    mostrarHorarioDeSalon("Salón 1");
  });

// Submenu (salon buttons)
function cargarSubmenuSalones() {
  const submenu = document.getElementById('submenu-salones');
  submenu.innerHTML = '';
  Object.keys(horarios).forEach(salon => {
    const btn = document.createElement('button');
    btn.textContent = salon;
    btn.onclick = () => {
      document.querySelectorAll('.submenu-salones button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      mostrarHorarioDeSalon(salon);
    };
    if(salon==="Salón 1") btn.classList.add('active');
    submenu.appendChild(btn);
  });
}

// Renders the weekly timetable for a given classroom
function mostrarHorarioDeSalon(salon) {
  const horario = horarios[salon];
  const tablaDiv = document.getElementById('horario-salon');
  tablaDiv.innerHTML = "";

  let tabla = `<div class="horario-tabla"><table><thead><tr><th>Hora</th>`;
  for(let dia of DIAS) tabla += `<th>${dia}</th>`;
  tabla += `</tr></thead><tbody>`;

  // Preprocess classes for each day and index them by start time in minutes since 00:00
  let clasesMap = {};
  DIAS.forEach(dia => {
    clasesMap[dia] = {};
    (horario[dia]||[]).forEach(clase => {
      let [ih, im] = clase.inicio.split(':').map(Number);
      let key = ih*60+im;
      clasesMap[dia][key] = clase;
    });
  });

  // For each row (hour), render cells or classes
  for(let h=H_INICIO; h<H_FIN; h++) {
    let horaLabel = `${h.toString().padStart(2,"0")}:00 - ${(h+1).toString().padStart(2,"0")}:00`;
    tabla += `<tr><td>${horaLabel}</td>`;

    for(let dia of DIAS) {
      let rendered = false;
      // Check if a class starts at this exact time
      let cellStartMin = h*60;
      let clase = clasesMap[dia][cellStartMin];

      // If not, check if a class from earlier is ongoing and should cover this cell (rowspan)
      if(!clase) {
        // Find if a class is overlapping this hour, but not yet rendered in this row
        for (let k in clasesMap[dia]) {
          let claseCheck = clasesMap[dia][k];
          let [ih, im] = claseCheck.inicio.split(':').map(Number);
          let [fh, fm] = claseCheck.fin.split(':').map(Number);
          let iniMin = ih*60+im, finMin = fh*60+fm;
          if (iniMin < cellStartMin && finMin > cellStartMin) {
            rendered = true; // This cell is covered by rowspan above
            break;
          }
        }
        if(rendered) {
          tabla += ''; // Don't render <td> (this cell is spanned)
          continue;
        } else {
          tabla += `<td></td>`;
          continue;
        }
      }

      // If class starts here, calculate how many rows it spans
      let [ih, im] = clase.inicio.split(":").map(Number);
      let [fh, fm] = clase.fin.split(":").map(Number);
      let iniMin = ih*60+im, finMin = fh*60+fm;
      let spanMin = finMin - iniMin;
      let rowspan = Math.ceil(spanMin/60);
      if (spanMin % 60 !== 0 && fm > 0) rowspan++; // If ends at :30, cover next row

      // Extra color for "extraordinaria"
      let claseExtra = (clase.tipo && clase.tipo.toLowerCase() === "extraordinaria") ? "extraordinaria" : "";

      tabla += `<td rowspan="${rowspan}" style="position:relative;vertical-align:middle;">
        <div class="bloque-clase ${claseExtra}">
          <b>${clase.materia}</b>
          <div style="font-size:12px">${clase.inicio} - ${clase.fin}</div>
        </div>
      </td>`;
    }
    tabla += `</tr>`;
  }
  tabla += `</tbody></table></div>`;
  tablaDiv.innerHTML = tabla;
}
