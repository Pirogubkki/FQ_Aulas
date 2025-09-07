const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const H_INICIO = 8, H_FIN = 20; // 8am to 8pm

function timeToMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}
function minutesToHHMM(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
function getHalfHourRows() {
  let rows = [];
  for (let m = H_INICIO * 60; m < H_FIN * 60; m += 30) {
    rows.push({ start: m, end: m + 30 });
  }
  return rows;
}

let horarios = {};
fetch('horarios.json')
  .then(r => r.json())
  .then(data => {
    horarios = data;
    cargarSubmenuSalones();
    mostrarHorarioDeSalon("Salón 1");
  });

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

function mostrarHorarioDeSalon(salon) {
  const horario = horarios[salon];
  const tablaDiv = document.getElementById('horario-salon');
  tablaDiv.innerHTML = "";

  const rows = getHalfHourRows();
  let tabla = `<div class="horario-tabla"><table><thead><tr><th>Hora</th>`;
  for(let dia of DIAS) tabla += `<th>${dia}</th>`;
  tabla += `</tr></thead><tbody>`;

  // Map for row/colspan logic
  let cellOccupied = {};
  for (let dia of DIAS) cellOccupied[dia] = Array(rows.length).fill(false);

  for (let i = 0; i < rows.length; i++) {
    let { start, end } = rows[i];
    let horaLabel = `${minutesToHHMM(start)} - ${minutesToHHMM(end)}`;
    tabla += `<tr><td>${horaLabel}</td>`;

    for (let dia of DIAS) {
      if (cellOccupied[dia][i]) { tabla += ""; continue; }

      // Find class starting in this slot
      const clases = horario[dia] || [];
      const clase = clases.find(c => timeToMinutes(c.inicio) === start);

      if (clase) {
        const ini = timeToMinutes(clase.inicio), fin = timeToMinutes(clase.fin);
        let rowspan = Math.max(1, Math.round((fin - ini) / 30));
        // Mark rows as occupied
        for (let j = 1; j < rowspan; j++) cellOccupied[dia][i + j] = true;
        let claseExtra = clase.tipo && clase.tipo.toLowerCase() === "extraordinaria" ? "extraordinaria" : "";
        tabla += `<td rowspan="${rowspan}" style="position:relative;vertical-align:middle;">
          <div class="bloque-clase ${claseExtra}">
            <b>${clase.materia}</b>
            <div style="font-size:12px">${clase.inicio} - ${clase.fin}</div>
          </div>
        </td>`;
      } else {
        tabla += `<td></td>`;
      }
    }
    tabla += `</tr>`;
  }
  tabla += `</tbody></table></div>`;
  tablaDiv.innerHTML = tabla;
}
