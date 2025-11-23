const API = "https://mediturnos-backend-production.up.railway.app";

// ========================================================
// CARGAR DOCTORES AUTOMÁTICAMENTE
// ========================================================
async function cargarDoctores() {
    try {
        const res = await fetch(`${API}/doctores`);
        const data = await res.json();

        const select = document.getElementById("doctor_id");
        select.innerHTML = "";

        data.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.id;
            opt.innerText = `${d.nombre} – ${d.especialidad}`;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error("Error cargando doctores:", e);
    }
}

cargarDoctores();

// ========================================================
// CREAR DOCTOR
// ========================================================
async function crearDoctor() {
    const payload = {
        nombre: document.getElementById("doc_nombre").value,
        email: document.getElementById("doc_email").value,
        especialidad: document.getElementById("doc_especialidad").value,
        duracion_min: parseInt(document.getElementById("doc_duracion").value),
        precio: parseInt(document.getElementById("doc_precio").value)
    };

    try {
        const res = await fetch(`${API}/doctores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        document.getElementById("doctor_msg").innerText =
            `Doctor creado: ID ${data.id}`;

        cargarDoctores();

    } catch (e) {
        document.getElementById("doctor_msg").innerText = "Error al crear doctor.";
    }
}

// ========================================================
// CREAR TURNO
// ========================================================
async function crearTurno() {
    const payload = {
        paciente_nombre: document.getElementById("paciente_nombre").value,
        paciente_email: document.getElementById("paciente_email").value,
        doctor_id: parseInt(document.getElementById("doctor_id").value),
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        motivo: document.getElementById("motivo").value
    };

    try {
        const res = await fetch(`${API}/mp/preferencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.response && data.response.init_point) {
            window.location.href = data.response.init_point;
        } else {
            document.getElementById("turno_msg").innerText =
                "Error creando preferencia de pago.";
        }

    } catch (e) {
        document.getElementById("turno_msg").innerText = "Error creando turno.";
    }
}
