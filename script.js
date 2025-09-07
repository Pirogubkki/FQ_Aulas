async function cargarHorarios() {
  const resp = await fetch("horarios.json");
  const data = await resp.json();

  const tabs = document.getElementById("tabs");
  const calendar = document.getElementById("calendar");

  // Crear pestañas para cada salón
  Object.keys(data).forEach((salon, idx) => {
    const btn = document.createElement("button");
    btn.textContent = salon;
    btn.onclick = () => mostrarHorario(salon, data[salon]);
    if (idx === 0) btn.classList.add("active");
    tabs.appendChild(btn);
  });

  // Mostrar el primero por defecto
  mostrarHorario(Object.keys(data)[0], data[Object.keys(data)[0]]);
}

function mostrarHorario(salon, horarios) {
  document.querySelectorAll("#tabs button").forEach(b => b.classList.remove("active"));
  [...document.querySelectorAll("#tabs button")].find(b => b.textContent === salon).classList.add("active");

  let html = `<h2>${salon}</h2>
  <table>
    <thead>
      <tr>
        <th>Hora</th>
        <th>Lunes</th>
        <th>Martes</th>
        <th>Miércoles</th>
        <th>Jueves</th>
        <th>Viernes</th>
      </tr>
    </thead>
    <tbody>`;

  // Horas de 08:00 a 20:00
  for (let h = 8; h < 20; h++) {
    const horaStr = `${String(h).padStart(2,"0")}:00`;
    html += `<tr><td>${horaStr}</td>`;
    ["Lunes","Martes","Miércoles","Jueves","Viernes"].forEach(dia => {
      const clase = horarios[dia]?.find(c => c.inicio === horaStr);
      html += `<td>${clase ? `<strong>${clase.materia}</strong><br>${clase.inicio} - ${clase.fin}` : ""}</td>`;
    });
    html += "</tr>";
  }

  html += "</tbody></table>";
  document.getElementById("calendar").innerHTML = html;
}

cargarHorarios();
