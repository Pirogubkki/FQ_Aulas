// Tabs
function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.tabs button[data-tab="'+tabName+'"]').classList.add('active');
}

// Sidebar
function openSidebar() {
  document.getElementById('sidebar').classList.add('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
}

// Días y horas base
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const H_INICIO = 8, H_FIN = 20; // 8am a 8pm

// Cargar horarios.json (puedes hacerlo local si sirves por servidor; aquí fetch local)
let horarios = {};
fetch('horarios.json')
  .then(r => r.json())
  .then(data => {
    horarios = data;
    cargarSubmenuSalones();
    mostrarHorarioDeSalon("Salón 1");
  });

// Submenú dinámico de salones
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

// Renderizar la tabla de horario semanal
function mostrarHorarioDeSalon(salon) {
  const horario = horarios[salon];
  const tablaDiv = document.getElementById('horario-salon');
  tablaDiv.innerHTML = ""; // limpio

  // Construyo encabezados
  let tabla = `<div class="horario-tabla"><table><thead><tr><th>Hora</th>`;
  for(let dia of DIAS) tabla += `<th>${dia}</th>`;
  tabla += `</tr></thead><tbody>`;
  
  // Para cada fila de hora
  for(let h=H_INICIO; h<H_FIN; h++) {
    let horaLabel = `${h.toString().padStart(2,"0")}:00 - ${(h+1).toString().padStart(2,"0")}:00`;
    tabla += `<tr><td>${horaLabel}</td>`;
    for(let dia of DIAS) {
      tabla += `<td style="position:relative" id="celda-${dia}-${h}"></td>`;
    }
    tabla += `</tr>`;
  }
  tabla += `</tbody></table></div>`;
  tablaDiv.innerHTML = tabla;

  // Pintar bloques de clase en celdas correspondientes
  for(let dia of DIAS) {
    if(!horario[dia]) continue;
    // Ordenar clases por inicio
    let clasesDia = horario[dia].slice().sort((a,b)=>a.inicio.localeCompare(b.inicio));
    for(let clase of clasesDia) {
      let hIni = parseInt(clase.inicio.split(":")[0]);
      let mIni = parseInt(clase.inicio.split(":")[1]);
      let hFin = parseInt(clase.fin.split(":")[0]);
      let mFin = parseInt(clase.fin.split(":")[1]);
      // Para bloques que inician y terminan en la misma hora
      for(let h=hIni; h<hFin; h++) {
        let celda = document.getElementById(`celda-${dia}-${h}`);
        if(celda){
          // Solo en la primera celda del bloque muestro la materia y fusiono visualmente
          if(h===hIni){
            // Calculo duración para height (aprox, si quieres más preciso, adapta con px)
            let dur = (hFin-hIni)*36 + Math.round((mFin-mIni)/60*36);
            let claseExtra = ""; // si quieres distinguir clases extraordinarias, pon aquí la lógica
            // Por ejemplo, si el nombre incluye "extraordinaria"
            if(clase.materia.toLowerCase().includes("extraordinaria")) claseExtra = "extraordinaria";
            celda.innerHTML = `<div class="bloque-clase ${claseExtra}" style="height:${dur}px">
              <b>${clase.materia}</b>
              <span style="font-size:12px">${clase.inicio} - ${clase.fin}</span>
            </div>`;
          }
        }
      }
    }
  }
}
