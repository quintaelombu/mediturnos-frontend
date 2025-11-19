const API_BASE = "https://mediturnos-backend-production.up.railway.app"; // URL de tu backend

document.getElementById("form-turno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const especialidad = document.getElementById("especialidad").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value.trim();

  try {
    const resp = await fetch(`${API_BASE}/api/crear-preferencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, especialidad, fecha, hora, motivo }),
    });

    if (!resp.ok) throw new Error("Error al crear preferencia");

    const data = await resp.json();

    if (data.init_point) {
      // Redirige directamente a Mercado Pago
      window.location.href = data.init_point;
    } else {
      alert("No se pudo iniciar el pago. Intente nuevamente.");
    }
  } catch (err) {
    console.error(err);
    alert("Error al conectar con el servidor. Ver consola.");
  }
});
