// URL del backend
const API = "https://mediturnos-backend-production.up.railway.app";

// Función para mostrar mensajes claros
function mensaje(texto) {
    alert(texto);
}

// Crear doctor
async function crearDoctor() {
    const nombre = document.getElementById("doc-nombre").value;
    const especialidad = document.getElementById("doc-esp").value;

    const res = await fetch(`${API}/doctores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, especialidad })
    });

    const data = await res.json();

    if (res.ok) mensaje(`Doctor creado: ${data.nombre}`);
    else mensaje("Error al crear doctor");
}

// Ver doctores
async function verDoctores() {
    const res = await fetch(`${API}/doctores`);
    const data = await res.json();
    document.getElementById("lista-doctores").textContent = JSON.stringify(data, null, 2);
}

// Crear turno
async function crearTurno() {
    const doctor_id = parseInt(document.getElementById("turno-docid").value);
    const paciente = document.getElementById("turno-pac").value;
    const fecha = document.getElementById("turno-fecha").value;
    const hora = document.getElementById("turno-hora").value;

    const res = await fetch(`${API}/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id, paciente, fecha, hora })
    });

    const data = await res.json();

    if (res.ok) mensaje(`Turno creado para ${data.paciente}`);
    else mensaje("Error al crear turno");
}

// Ver turnos
async function verTurnos() {
    const res = await fetch(`${API}/turnos`);
    const data = await res.json();
    document.getElementById("lista-turnos").textContent = JSON.stringify(data, null, 2);
}
