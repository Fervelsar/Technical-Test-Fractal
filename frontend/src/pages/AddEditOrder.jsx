import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerProductos,
  obtenerOrdenPorId,
  crearOrden,
  actualizarOrden,
} from "../api";

function hoy() {
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();
  const dia = hoy.getDate();
  return `${anio}-${mes}-${dia}`;
}

export default function AddEditOrder() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [numeroOrden, setNumeroOrden] = useState("");
  const [fecha] = useState(hoy());
  const [detalles, setDetalles] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [indiceEditando, setIndiceEditando] = useState(null);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [indiceRemover, setIndiceRemover] = useState(null);

  const cantidadProductos = detalles.length;
  const precioFinal = useMemo(
    () => detalles.reduce((sum, d) => sum + Number(d.precio_total), 0),
    [detalles]
  );

  useEffect(() => {
    (async () => {
      const p = await obtenerProductos();
      setProductos(p);
      if (p.length > 0) setProductoId(String(p[0].id));
    })();
  }, []);

  useEffect(() => {
    if (!esEdicion) return;
    (async () => {
      const data = await obtenerOrdenPorId(id);
      setNumeroOrden(data.orden.numero_orden);

      const mapped = data.detalles.map((d) => ({
        producto_id: Number(d.producto_id),
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        precio_total: Number(d.precio_total),
      }));
      setDetalles(mapped);
    })();
  }, [id, esEdicion]);

  function abrirModalAgregar() {
    setIndiceEditando(null);
    setCantidad(1);
    if (productos.length > 0) setProductoId(String(productos[0].id));
    setModalAbierto(true);
  }

  function abrirModalEditar(index) {
    const d = detalles[index];
    setIndiceEditando(index);
    setProductoId(String(d.producto_id));
    setCantidad(d.cantidad);
    setModalAbierto(true);
  }

  function guardarProductoEnOrden() {
    const qty = Number(cantidad);
    if (!productoId) return alert("Selecciona un producto");
    if (!qty || qty < 1) return alert("La cantidad debe ser >= 1");

    const prod = productos.find((p) => String(p.id) === String(productoId));
    if (!prod) return alert("Producto no encontrado");

    const unit = Number(prod.precio_unitario);
    const total = unit * qty;

    const nuevo = {
      producto_id: Number(prod.id),
      cantidad: qty,
      precio_unitario: unit,
      precio_total: total,
    };

    if (indiceEditando === null) {
      setDetalles((prev) => [...prev, nuevo]);
    } else {
      setDetalles((prev) => prev.map((x, i) => (i === indiceEditando ? nuevo : x)));
    }

    setModalAbierto(false);
  }

  function removerConfirmado() {
    setDetalles((prev) => prev.filter((_, i) => i !== indiceRemover));
    setIndiceRemover(null);
  }

  async function guardarOrden() {
    if (!numeroOrden.trim()) return alert("Order # es requerido");
    if (detalles.length === 0) return alert("Agrega al menos 1 producto");

    const payload = {
      numero_orden: numeroOrden,
      fecha,
      detalles,
    };

    if (!esEdicion) await crearOrden(payload);
    else await actualizarOrden(id, payload);

    navigate("/my-orders");
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>{esEdicion ? "Edit Order" : "Añadir Orden"}</h1>

      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          Orden #<br />
          <input value={numeroOrden} onChange={(e) => setNumeroOrden(e.target.value)} />
        </label>

        <label>
          Fecha<br />
          <input value={fecha} disabled />
        </label>

        <label>
          # Productos<br />
          <input value={cantidadProductos} disabled />
        </label>

        <label>
          Precio Final<br />
          <input value={precioFinal.toFixed(2)} disabled />
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={abrirModalAgregar}>Añadir Producto</button>{" "}
        <button onClick={() => navigate("/my-orders")}>Regresar</button>
      </div>

      <table border="1" cellPadding="8" style={{ marginTop: 16, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nomnbre</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Total precio</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, index) => {
            const prod = productos.find((p) => p.id === d.producto_id);
            return (
              <tr key={index}>
                <td>{d.producto_id}</td>
                <td>{prod ? prod.nombre : "Producto"}</td>
                <td>{Number(d.precio_unitario).toFixed(2)}</td>
                <td>{d.cantidad}</td>
                <td>{Number(d.precio_total).toFixed(2)}</td>
                <td>
                  <button onClick={() => abrirModalEditar(index)}>Editar Producto</button>{" "}
                  <button onClick={() => setIndiceRemover(index)}>Remover Producto</button>
                </td>
              </tr>
            );
          })}
          {detalles.length === 0 && (
            <tr>
              <td colSpan="6" align="center">
                No productos añadidos
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 16 }}>
        <button onClick={guardarOrden}>Guardar Orden</button>
      </div>

      {modalAbierto && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{indiceEditando === null ? "Agregar producto" : "Editar producto"}</h3>

            <label>
              Producto<br />
              <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - {Number(p.precio_unitario).toFixed(2)}
                  </option>
                ))}
              </select>
            </label>

            <br /><br />

            <label>
              Cantidad<br />
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </label>

            <div style={{ marginTop: 12 }}>
              <button onClick={guardarProductoEnOrden}>Confirmar</button>{" "}
              <button onClick={() => setModalAbierto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {indiceRemover !== null && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmación</h3>
            <p>¿Remover este producto de la orden?</p>
            <button onClick={removerConfirmado}>Sí, remover</button>{" "}
            <button onClick={() => setIndiceRemover(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = { background: "grey", padding: 16, borderRadius: 8, width: 360 };
