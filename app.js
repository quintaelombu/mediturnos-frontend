// =======================
// CONFIGURACIÓN
// =======================
const API = "https://mediturnos-backend-production.up.railway.app";

const $ = (id) => document.getElementById(id);

function msg(texto) {
    $("mensaje").textContent = texto;
    $("error").textContent = "";
}

function err(texto) {
    $("error").textContent = texto;
    $("mensaje").textContent = "";
}

// =======================
// CREAR DOCTOR
// =======================
async function crearDoctor() {
    const nombre = $("docNombre").value;
    const especialidad = $("docEsp").value;

    if (!nombre || !especialidad) return err("Complete todos los campos.");

    try {
        const res = await fetch(API + "/doctores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombre,
                especialidad: especialidad
            })
        });

        const data = await res.json();
        if (res.ok) msg("Doctor creado con ID: " + data.id);
        else err(JSON.stringify(data));
    }
    catch {
        err("Error conectando al backend.");
    }
}

// =======================
// CREAR TURNO
// =======================
async function crearTurno() {
    const doctor_id = $("turDocId").value;
    const paciente_nombre = $("turNombre").value;
    const paciente_email = $("turEmail").value;

    if (!doctor_id || !paciente_nombre || !paciente_email)
        return err("Complete todos los campos.");

    try {
        const res = await fetch(API + "/turnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                doctor_id: parseInt(doctor_id),
                paciente_nombre: paciente_nombre,
                paciente_email: paciente_email
            })
        });

        const data = await res.json();
        if (res.ok) msg("Turno creado con ID: " + data.id);
        else err(JSON.stringify(data));
    }
    catch {
        err("Error conectando al backend.");
    }
}
