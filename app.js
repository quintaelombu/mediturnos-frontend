// URL del backend en Railway
const API_URL = "https://mediturnos-backend-production.up.railway.app";

// ---------------------------
// CARGAR DOCTORES
// ---------------------------
async function cargarDoctores() {
    try {
        const res = await fetch(`${API_URL}/doctores`);
        const data = await res.json();

        const lista = document.getElementById("lista-doctores");
        lista.innerHTML = "";

        data.forEach(doc => {
            const item = document.createElement("li");
            item.textContent = `👨‍⚕️ ${doc.nombre} — ${doc.especialidad}`;
            lista.appendChild(item);
        });

    } catch (error) {
        console.error("Error cargando doctores:", error);
    }
}

// ---------------------------
// CREAR DOCTOR
// ---------------------------
async function crearDoctor() {
    const nombre = document.getElementById("nombre").value;
    const especialidad = document.getElementById("especialidad").value;

    const payload = { nombre, especialidad };

    const res = await fetch(`${API_URL}/doctores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert("Doctor creado: " + data.nombre);
    cargarDoctores();
}

// ---------------------------
// CREAR TURNO
// ---------------------------
async function crearTurno() {
    const doctor_id = Number(document.getElementById("turno-doctor-id").value);
    const paciente_nombre = document.getElementById("turno-nombre").value;
    const paciente_email = document.getElementById("turno-email").value;

    const payload = { doctor_id, paciente_nombre, paciente_email };

    const res = await fetch(`${API_URL}/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert("Turno creado ID: " + data.id);
}

// Cargar al iniciar
window.onload = cargarDoctores;
