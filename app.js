// URL del backend en Railway
const API_BASE = "https://mediturnos-backend-production.up.railway.app";

const listaDoctores = document.getElementById("lista-doctores");
const formDoctor = document.getElementById("form-doctor");
const formTurno = document.getElementById("form-turno");
const mensaje = document.getElementById("mensaje");

// Cargar doctores al iniciar
window.addEventListener("DOMContentLoaded", () => {
  console.log("Frontend cargado. Usando backend:", API_BASE);
  cargarDoctores();
});

// ---------- DOCTORES ----------

async function cargarDoctores() {
  listaDoctores.innerHTML = "<li>Cargando doctores...</li>";

  try {
    const res = await fetch(`${API_BASE}/doctores`);
    if (!res.ok) {
      throw new Error("Error al obtener doctores");
    }
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      listaDoctores.innerHTML = "<li>Sin doctores cargados.</li>";
      return;
    }

    listaDoctores.innerHTML = "";
    data.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = `ID ${doc.id} — ${doc.nombre} (${doc.especialidad})`;
      listaDoctores.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    listaDoctores.innerHTML = "<li>Error al cargar doctores</li>";
  }
}

formDoctor.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  const nombre = document.getElementById("doctor-nombre").value.trim();
  const especialidad = document.getElementById("doctor-especialidad").value.trim();

  if (!nombre || !especialidad) return;

  try {
    const res = await fetch(`${API_BASE}/doctores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, especialidad })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error("Error al crear doctor: " + txt);
    }

    const creado = await res.json();
    console.log("Doctor creado:", creado);

    mensaje.style.color = "green";
    mensaje.textContent = `Doctor creado: ID ${creado.id} — ${creado.nombre}`;

    formDoctor.reset();
    cargarDoctores();
  } catch (err) {
    console.error(err);
    mensaje.style.color = "red";
    mensaje.textContent = "No se pudo crear el doctor.";
  }
});

// ---------- TURNOS ----------

formTurno.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  const doctor_id = Number(document.getElementById("turno-doctor-id").value);
  const paciente_nombre = document
    .getElementById("turno-paciente-nombre")
    .value.trim();
  const paciente_email = document
    .getElementById("turno-paciente-email")
    .value.trim();

  if (!doctor_id || !paciente_nombre || !paciente_email) return;

  try {
    const res = await fetch(`${API_BASE}/turnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id, paciente_nombre, paciente_email })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error("Error al crear turno: " + txt);
    }

    const creado = await res.json();
    console.log("Turno creado:", creado);

    mensaje.style.color = "green";
    mensaje.textContent = `Turno creado para ${creado.paciente_nombre}`;

    formTurno.reset();
  } catch (err) {
    console.error(err);
    mensaje.style.color = "red";
    mensaje.textContent = "No se pudo crear el turno.";
  }
});
