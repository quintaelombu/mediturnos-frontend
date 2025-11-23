// CONFIGURACIÓN
const API_BASE = "https://mediturnos-backend-production.up.railway.app";

const $ = (id) => document.getElementById(id);

function mostrarMensaje(texto) {
    $("mensaje").textContent = texto;
    $("error").textContent = "";
}

function mostrarError(texto) {
    $("error").textContent = texto;
    $("mensaje").textContent = "";
}

// ─────────────────────────────────────
// Cargar lista de doctores
// ─────────────────────────────────────
async function cargarDoctores() {
    try {
        const res = await fetch(`${API_BASE}/doctores`);
        if (!res.ok) throw new Error("No se pudo obtener la lista de doctores");
        const data = await res.json();

        const ul = $("doctores-lista");
        ul.innerHTML = "";

        if (data.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No hay doctores cargados.";
            ul.appendChild(li);
            return;
        }

        data.forEach((doc) => {
            const li = document.createElement("li");
            li.textContent = `ID ${doc.id} — ${doc.nombre} (${doc.especialidad})`;
            ul.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        mostrarError("Error cargando doctores");
    }
}

// ─────────────────────────────────────
// Crear doctor
// ─────────────────────────────────────
async function crearDoctor() {
    const nombre = $("doctor-nombre").value.trim();
    const especialidad = $("doctor-especialidad").value.trim();

    if (!nombre || !especialidad) {
        mostrarError("Nombre y especialidad son obligatorios");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/doctores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre, especialidad }),
        });

        if (!res.ok) {
            const detalle = await res.text();
            console.error("Error backend:", detalle);
            throw new Error("Error al crear doctor");
        }

        const nuevo = await res.json();
        mostrarMensaje(`Doctor creado: ID ${nuevo.id} — ${nuevo.nombre}`);
        $("doctor-nombre").value = "";
        $("doctor-especialidad").value = "";
        await cargarDoctores();
    } catch (err) {
        console.error(err);
        mostrarError("No se pudo crear el doctor");
    }
}

// ─────────────────────────────────────
// Crear turno
// ─────────────────────────────────────
async function crearTurno() {
    const doctor_id = parseInt($("turno-doctor-id").value, 10);
    const paciente_nombre = $("turno-paciente-nombre").value.trim();
    const paciente_email = $("turno-paciente-email").value.trim();

    if (!doctor_id || !paciente_nombre || !paciente_email) {
        mostrarError("Todos los campos del turno son obligatorios");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/turnos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                doctor_id,
                paciente_nombre,
                paciente_email,
            }),
        });

        if (!res.ok) {
            const detalle = await res.text();
            console.error("Error backend:", detalle);
            throw new Error("Error al crear turno");
        }

        const turno = await res.json();
        mostrarMensaje(`Turno creado para ${turno.paciente_nombre} (ID turno ${turno.id})`);
        $("turno-doctor-id").value = "";
        $("turno-paciente-nombre").value = "";
        $("turno-paciente-email").value = "";
    } catch (err) {
        console.error(err);
        mostrarError("No se pudo crear el turno");
    }
}

// ─────────────────────────────────────
// Inicializar eventos cuando carga la página
// ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    $("btn-crear-doctor").addEventListener("click", (e) => {
        e.preventDefault();
        crearDoctor();
    });

    $("btn-crear-turno").addEventListener("click", (e) => {
        e.preventDefault();
        crearTurno();
    });

    // Cargar lista inicial
    cargarDoctores();
});
