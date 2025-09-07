const horarios = {
  "salon1": [
    { dia: "Lunes", materia: "Matemáticas para químicos", inicio: "08:00", fin: "10:00" },
    { dia: "Lunes", materia: "Normatividad y legislación", inicio: "10:00", fin: "11:30" },
    { dia: "Martes", materia: "Física e introducción a la fisicoquímica", inicio: "08:00", fin: "10:00" },
    { dia: "Viernes", materia: "Química general y bioinorgánica", inicio: "10:30", fin: "12:30" }
  ],
  "salon2": [
    { dia: "Lunes", materia: "Toxicología", inicio: "09:30", fin: "11:30" },
    { dia: "Lunes", materia: "Síntesis de Fármacos", inicio: "12:00", fin: "13:30" },
    { dia: "Miércoles", materia: "Laboratorio de hematología Clínica", inicio: "15:00", fin: "18:00" }
  ]
};

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = Array.from({ length: 12 }, (_, i) => 8 + i); // 8 a 20

function renderHorario(id, data) {
  const cont = document.getElementById(id);

  // Encabezado
  cont.innerHTML = `<div></div>${dias.map(d => `<div>${d}</div>`).join("")}`;

  // Filas por hora
  horas.forEach(h => {
    cont.innerHTML += `<div class="hora">${h}:00</div>` +
      dias.map(() => `<div></div>`).join("");
  });

  // Posicionar clases
  data.forEach(clase => {
    const diaIndex = dias.indexOf(clase.dia) + 1;
    const inicio = parseFloat(clase.inicio.replace(":", ".").replace("30", ".5"));
    const fin = parseFloat(clase.fin.replace(":", ".").replace("30", ".5"));
    const duracion = fin - inicio;

    const top = (inicio - 8) * 40; // 40px por hora
    const height = duracion * 40;

    const celda = cont.querySelector(`.calendario > div:nth-child(${diaIndex + 1})`);
    const claseDiv = document.createElement("div");
    claseDiv.className = "clase";
    claseDiv.style.top = `${top}px`;
    claseDiv.style.height = `${height}px`;
    claseDiv.textContent = clase.materia;
    celda.appendChild(claseDiv);
  });
}

renderHorario("salon1", horarios.salon1);
renderHorario("salon2", horarios.salon2);
