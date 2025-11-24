// CONFIGURACIÓN
const API_BASE = "https://mediturnos-backend-production.up.railway.app";

// Helpers
const $ = (id) => document.getElementById(id);

function alertar(msj) {
    alert(msj);
}

// Crear Doctor
document.getElementById("btn-crear-doctor").onclick = async () => {
    const nombre = $("doctor-nombre").value.trim();
    const especialidad = $("doctor-especialidad").value.trim();

    if (!nombre || !especialidad) {
        alertar("Completa todos los campos");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/doctores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, especialidad })
        });

        const data = await res.json();
        alertar("Doctor creado correctamente");
    } catch (err) {
        alertar("Error al crear doctor");
    }
};

// Crear Turno (CORREGIDO)
document.getElementById("btn-crear-turno").onclick = async () => {
    let doctor_id = $("turno-doctor-id").value.trim();
    const paciente = $("turno-paciente").value.trim();
    const fecha = $("turno-fecha").value.trim();
    const hora = $("turno-hora").value.trim();

    // Validación
    if (!doctor_id || !paciente || !fecha || !hora) {
        alertar("Completa todos los campos");
        return;
    }

    doctor_id = parseInt(doctor_id); // <--- CORRECCIÓN CLAVE

    if (isNaN(doctor_id)) {
        alertar("El ID del doctor debe ser un número válido");
        return;
    }

    const payload = { doctor_id, paciente, fecha, hora };

    try {
        const res = await fetch(`${API_BASE}/turnos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.text();
            console.log("Error:", err);
            alertar("Error al crear turno");
            return;
        }

        const data = await res.json();
        alertar("Turno creado correctamente");

    } catch (err) {
        alertar("Error de conexión con el servidor");
    }
};

// Ver doctores
document.getElementById("btn-ver-doctores").onclick = async () => {
    const res = await fetch(`${API_BASE}/doctores`);
    const data = await res.json();
    $("lista-doctores").textContent = JSON.stringify(data, null, 2);
};

// Ver turnos
document.getElementById("btn-ver-turnos").onclick = async () => {
    const res = await fetch(`${API_BASE}/turnos`);
    const data = await res.json();
    $("lista-turnos").textContent = JSON.stringify(data, null, 2);
};
