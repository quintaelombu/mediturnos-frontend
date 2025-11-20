// URL base del backend en Railway
const API_BASE = "https://mediturnos-backend-production.up.railway.app";

// Estado en memoria de los médicos cargados
let medicos = [];

// Utilidad: mostrar mensajes en la barra roja/verde
function mostrarMensaje(texto, tipo = "error") {
  const barra = document.getElementById("barra-mensaje");
  if (!barra) return;

  barra.textContent = texto;
  barra.className = "";
  barra.style.display = texto ? "block" : "none";

  if (texto) {
    barra.classList.add(tipo === "ok" ? "ok" : "error");
  }
}

// Carga inicial de médicos desde el backend
async function cargarMedicos() {
  try {
    const res = await fetch(`${API_BASE}/api/medicos`);
    if (!res.ok) throw new Error("No se pudieron cargar los médicos");

    medicos = await res.json();

    const selEspecialidad = document.getElementById("especialidad");
    const selMedico = document.getElementById("medico");

    // Limpiar selects
    selEspecialidad.innerHTML =
      '<option value="">Elegí una opción…</option>';
    selMedico.innerHTML = '<option value="">Elegí un médico…</option>';

    // Armar lista única de especialidades
    const especialidades = [
      ...new Set(medicos.map((m) => m.especialidad)),
    ].sort();

    especialidades.forEach((esp) => {
      const opt = document.createElement("option");
      opt.value = esp;
      opt.textContent = esp;
      selEspecialidad.appendChild(opt);
    });

    // Llenar médicos completos de entrada
    actualizarSelectMedicos();

    // Mostrar info por defecto
    actualizarInfoDoctor();
  } catch (err) {
    console.error(err);
    mostrarMensaje(
      "No se pudieron cargar los médicos. Probá más tarde.",
      "error"
    );
  }
}

// Actualiza el <select> de médicos según la especialidad elegida
function actualizarSelectMedicos() {
  const selEspecialidad = document.getElementById("especialidad");
  const selMedico = document.getElementById("medico");

  const especialidadSeleccionada = selEspecialidad.value;

  selMedico.innerHTML = '<option value="">Elegí un médico…</option>';

  const filtrados = especialidadSeleccionada
    ? medicos.filter((m) => m.especialidad === especialidadSeleccionada)
    : medicos;

  filtrados.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id; // se envía el ID al backend
    opt.textContent = `${m.nombre} · ${m.especialidad}`;
    selMedico.appendChild(opt);
  });
}

// Actualiza cartelitos de precio/duración con el médico seleccionado
function actualizarInfoDoctor() {
  const selMedico = document.getElementById("medico");
  const infoPrecio = document.getElementById("info-precio");
  const infoDuracion = document.getElementById("info-duracion");
  const docNombre = document.getElementById("doctor-ejemplo-nombre");
  const docEsp = document.getElementById("doctor-ejemplo-especialidad");
  const docPrecio = document.getElementById("doctor-ejemplo-precio");
  const docDuracion = document.getElementById("doctor-ejemplo-duracion");

  const id = parseInt(selMedico.value, 10);
  const medico = medicos.find((m) => m.id === id);

  if (!medico) {
    infoPrecio.querySelector("strong").textContent = "$—";
    infoDuracion.textContent = "— min";
    docNombre.textContent = "Seleccioná un médico";
    docEsp.textContent = "Online";
    docPrecio.textContent = "$ —";
    docDuracion.textContent = "— min";
    return;
  }

  infoPrecio.querySelector("strong").textContent = `$${medico.precio}`;
  infoDuracion.textContent = `${medico.duracion_min} min`;

  docNombre.textContent = medico.nombre;
  docEsp.textContent = medico.especialidad;
  docPrecio.textContent = `$${medico.precio}`;
  docDuracion.textContent = `${medico.duracion_min} min`;
}

// Enviar solicitud al backend y redirigir a Mercado Pago
async function solicitarTurno() {
  mostrarMensaje("");
  const btn = document.getElementById("btn-enviar");
  const form = document.getElementById("form-turno");

  if (!form.reportValidity()) return;

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const medicoId = document.getElementById("medico").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value.trim();

  if (!medicoId) {
    mostrarMensaje("Elegí un médico para continuar.", "error");
    return;
  }

  const payload = {
    nombre,
    email,
    especialidad,
    medico_id: parseInt(medicoId, 10),
    fecha,
    hora,
    motivo,
  };

  try {
    btn.disabled = true;
    btn.textContent = "Generando pago…";

    const res = await fetch(`${API_BASE}/api/crear-preferencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        data?.detail ||
        data?.error ||
        "No se pudo crear la preferencia de pago.";
      throw new Error(msg);
    }

    if (data.init_point) {
      // Redirige a Mercado Pago
      window.location.href = data.init_point;
    } else {
      mostrarMensaje(
        "El backend respondió sin enlace de pago (init_point).",
        "error"
      );
    }
  } catch (err) {
    console.error(err);
    mostrarMensaje(err.message || "Ocurrió un error inesperado.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Solicitar turno y pagar";
  }
}

// --- Inicialización de eventos ---
document.addEventListener("DOMContentLoaded", () => {
  const selEspecialidad = document.getElementById("especialidad");
  const selMedico = document.getElementById("medico");
  const btn = document.getElementById("btn-enviar");

  selEspecialidad.addEventListener("change", () => {
    actualizarSelectMedicos();
    actualizarInfoDoctor();
  });

  selMedico.addEventListener("change", actualizarInfoDoctor);
  btn.addEventListener("click", solicitarTurno);

  cargarMedicos();
});
