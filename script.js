// Para las tabs
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

// Ejemplo de datos ordenados de clases
const clasesSalon1 = [
  { hora: '08:00-10:00', nombre: 'Matemáticas I', tipo: 'semestral' },
  { hora: '10:00-12:00', nombre: 'Física I', tipo: 'extraordinaria' },
  { hora: '12:00-14:00', nombre: 'Química I', tipo: 'semestral' }
];

const clasesSalon2 = [
  { hora: '09:00-11:00', nombre: 'Inglés', tipo: 'semestral' },
  { hora: '11:00-13:00', nombre: 'Programación', tipo: 'extraordinaria' },
  { hora: '13:00-15:00', nombre: 'Biología', tipo: 'semestral' }
];

// Renderizar clases ordenadas
function renderClases(idDiv, clases) {
  const cont = document.getElementById(idDiv);
  cont.innerHTML = '';
  // Ordenar por hora (opcional, si tus datos ya están ordenados puedes omitir)
  clases.sort((a,b) => a.hora.localeCompare(b.hora)); 
  clases.forEach(clase => {
    const div = document.createElement('div');
    div.className = 'clase' + (clase.tipo === 'extraordinaria' ? ' extraordinaria' : '');
    div.innerHTML = `<b>${clase.nombre}</b><br><span>${clase.hora}</span>`;
    cont.appendChild(div);
  });
}

// Inicializar al cargar
window.onload = function() {
  renderClases('cal-salon1', clasesSalon1);
  renderClases('cal-salon2', clasesSalon2);
};
