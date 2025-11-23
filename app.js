// ==============================
// CONFIGURACIÓN
// ==============================

// URL del backend en Railway
const API_BASE = "https://mediturnos-backend-production.up.railway.app";

// Helpers rápidos
const $ = (id) => document.getElementById(id);

function mostrarOk(texto) {
  $("mensajeOk").textContent = texto;
  $("mensajeError").textContent = "";
}

function mostrarError(err) {
  console.error(err);
  let msg = "Error inesperado";
  if (typeof err === "string") msg = err;
  else if (err && err.message) msg = err.message;
  $("mensajeError").textContent = msg;
  $("mensajeOk").textContent = "";
}

// ==============================
// CARGAR LISTA DE DOCTORES
// ==============================
async function cargarDoctores() {
  try {
    const resp = await fetch(`${API_BASE}/doctores`);
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Error al cargar doctores (${resp.status}): ${txt}`);
    }
    const data = await resp.json();

    const tbody = $("tablaDoctores");
    tbody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "No hay doctores cargados.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    for (const doc of data) {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = doc.id ?? "";
      tr.appendChild(tdId);

      const tdNombre = document.createElement("td");
      tdNombre.textContent = doc.nombre ?? "";
      tr.appendChild(tdNombre);

      const tdEsp = document.createElement("td");
      tdEsp.textContent = doc.especialidad ?? "";
      tr.appendChild(tdEsp);

      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = doc.precio ?? "";
      tr.appendChild(tdPrecio);

      const tdDur = document.createElement("td");
      tdDur.textContent = doc.duracion_minutos ?? "";
      tr.appendChild(tdDur);

      tbody.appendChild(tr);
    }
  } catch (e) {
    mostrarError(e);
  }
}

// ==============================
// CREAR DOCTOR
// ==============================
async function crearDoctor() {
  const btn = $("btnCrearDoctor");
  btn.disabled = true;

  try {
    const nombre = $("docNombre").value.trim();
    const especialidad = $("docEspecialidad").value.trim();
    const precio = $("docPrecio").value.trim();
    const duracion = $("docDuracion").value.trim();

    if (!nombre || !especialidad || !precio || !duracion) {
      throw new Error("Completa todos los campos del doctor.");
    }

    const payload = {
      nombre,
      especialidad,
      precio: Number(precio),
      duracion_minutos: Number(duracion),
    };

    const resp = await fetch(`${API_BASE}/doctores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const texto = await resp.text();
    let data;

    try {
      data = JSON.parse(texto);
    } catch {
      data = texto;
    }

    if (!resp.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : JSON.stringify(data, null, 2)
      );
    }

    mostrarOk(`Doctor creado (ID ${data.id}).`);
    $("formDoctor").reset();
    cargarDoctores();
  } catch (e) {
    mostrarError(e);
  } finally {
    btn.disabled = false;
  }
}

// ==============================
// CREAR TURNO
// ==============================
async function crearTurno() {
  const btn = $("btnCrearTurno");
  btn.disabled = true;

  try {
    const doctorId = $("turnoDoctorId").value.trim();
    const nombrePaciente = $("turnoNombrePaciente").value.trim();
    const emailPaciente = $("turnoEmailPaciente").value.trim();

    if (!doctorId || !nombrePaciente || !emailPaciente) {
      throw new Error("Completa todos los campos del turno.");
    }

    const payload = {
      doctor_id: Number(doctorId),
      paciente_nombre: nombrePaciente,
      paciente_email: emailPaciente,
    };

    const resp = await fetch(`${API_BASE}/turnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const texto = await resp.text();
    let data;
    try {
      data = JSON.parse(texto);
    } catch {
      data = texto;
    }

    if (!resp.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : JSON.stringify(data, null, 2)
      );
    }

    mostrarOk(`Turno creado correctamente (ID ${data.id ?? "?"}).`);
    $("formTurno").reset();
  } catch (e) {
    mostrarError(e);
  } finally {
    btn.disabled = false;
  }
}

// ==============================
// EVENTOS Y ARRANQUE
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  // Botones
  $("btnCrearDoctor").addEventListener("click", crearDoctor);
  $("btnCrearTurno").addEventListener("click", crearTurno);

  // Cargar doctores al inicio
  cargarDoctores();
});
