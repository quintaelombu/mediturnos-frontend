const API = "https://mediturnos-backend-production.up.railway.app";

// ------------------------
// CREAR DOCTOR
// ------------------------
async function crearDoctor() {
    const data = {
        nombre: document.getElementById("doc_nombre").value,
        especialidad: document.getElementById("doc_especialidad").value,
        precio: Number(document.getElementById("doc_precio").value)
    };

    const res = await fetch(`${API}/doctores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Doctor creado");
    listarDoctores();
}

// ------------------------
// LISTAR DOCTORES
// ------------------------
async function listarDoctores() {
    const res = await fetch(`${API}/doctores`);
    const doctores = await res.json();

    const lista = document.getElementById("lista_doctores");
    const select = document.getElementById("turno_doctor");

    lista.innerHTML = "";
    select.innerHTML = `<option value="">Seleccione un doctor</option>`;

    doctores.forEach(d => {
        lista.innerHTML += `<li>${d.id} - ${d.nombre} (${d.especialidad}) - $${d.precio}</li>`;
        select.innerHTML += `<option value="${d.id}">${d.nombre} (${d.especialidad})</option>`;
    });
}

// ------------------------
// CREAR TURNO
// ------------------------
async function crearTurno() {
    const data = {
        doctor_id: Number(document.getElementById("turno_doctor").value),
        paciente_nombre: document.getElementById("paciente_nombre").value,
        paciente_email: document.getElementById("paciente_email").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value
    };

    const res = await fetch(`${API}/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Turno creado");
}

// ------------------------
// CREAR PREFERENCIA MP
// ------------------------
async function crearPreferencia() {
    const data = {
        doctor_id: Number(document.getElementById("turno_doctor").value),
        paciente_nombre: document.getElementById("paciente_nombre").value,
        paciente_email: document.getElementById("paciente_email").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value
    };

    const res = await fetch(`${API}/mp/preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();

    document.getElementById("mp_result").innerHTML =
        `<a href="${json.response.init_point}" target="_blank">Pagar Ahora</a>`;
}
