const API = "http://localhost:3001";

export async function obtenerProductos() {
  const res = await fetch(`${API}/productos`);
  return res.json();
}

export async function obtenerOrdenes() {
  const res = await fetch(`${API}/ordenes`);
  return res.json();
}

export async function obtenerOrdenPorId(id) {
  const res = await fetch(`${API}/ordenes/${id}`);
  return res.json();
}

export async function crearOrden(payload) {
  const res = await fetch(`${API}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function actualizarOrden(id, payload) {
  const res = await fetch(`${API}/ordenes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function eliminarOrden(id) {
  const res = await fetch(`${API}/ordenes/${id}`, { method: "DELETE" });
  return res.json();
}

export async function cambiarEstadoOrden(id, estado) {
  const res = await fetch(`${API}/ordenes/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  return res.json();
}