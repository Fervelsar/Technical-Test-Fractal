import { useEffect, useState } from "react";
import { cambiarEstadoOrden } from "../api";
import { useNavigate } from "react-router-dom";
import { obtenerOrdenes, eliminarOrden } from "../api";


export default function MyOrders() {
  const [ordenes, setOrdenes] = useState([]);
  const [confirmarId, setConfirmarId] = useState(null);
  const navigate = useNavigate();
  const [cambiarEstado, setCambiarEstado] = useState(null);


  async function cargar() {
    const data = await obtenerOrdenes();
    setOrdenes(data);
  }

  useEffect(() => { cargar(); }, []);

  async function confirmarEliminar() {
    await eliminarOrden(confirmarId);
    setConfirmarId(null);
    cargar();
  }

  async function confirmarCambioEstado() {
    await cambiarEstadoOrden(cambiarEstado.id, cambiarEstado.estado);
    setCambiarEstado(null);
    cargar();
    }

  return (
    <div style={{ padding: 16 }}>
      <h1>Mis Ordenes</h1>

      <button onClick={() => navigate("/add-order")}>Agregar una nueva orden</button>

      <table border="1" cellPadding="8" style={{ marginTop: 16, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Orden #</th>
            <th>Fecha</th>
            <th># Productos</th>
            <th>Precio Final</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.numero_orden}</td>
              <td>{o.fecha}</td>
              <td>{o.cantidad_productos}</td>
              <td>{Number(o.precio_final).toFixed(2)}</td>
              <td>{o.estado || "Pendiente"}</td>
              <td>
                <button onClick={() => navigate(`/add-order/${o.id}`)}>Editar</button>{" "}
                <button onClick={() => setConfirmarId(o.id)}>Eliminar</button>
                <button onClick={() => setCambiarEstado({ id: o.id, estado: o.estado || "Pendiente" })}>Cambiar Estado</button>
              </td>
            </tr>
          ))}
          {ordenes.length === 0 && (
            <tr><td colSpan="6" align="center">No orders yet</td></tr>
          )}
        </tbody>
      </table>

      {confirmarId !== null && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Confirmación</h3>
            <p>¿Eliminar la orden #{confirmarId}?</p>
            <button onClick={confirmarEliminar}>Sí, eliminar</button>{" "}
            <button onClick={() => setConfirmarId(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {cambiarEstado && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Cambiar estado</h3>
            
            <select
              value={cambiarEstado.estado}
              onChange={(e) =>
                setCambiarEstado({ ...cambiarEstado, estado: e.target.value })
              }
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En progreso</option>
              <option value="Completado">Completado</option>
            </select>
          
            <div style={{ marginTop: 12 }}>
              <button onClick={confirmarCambioEstado}>Confirmar</button>{" "}
              <button onClick={() => setCambiarEstado(null)}>Cancelar</button>
            </div>
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

const modal = { background: "grey", padding: 16, borderRadius: 8, width: 320 };
