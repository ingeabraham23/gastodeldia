// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
  faCamera,
  faSave,
  faPlus,
  faMinus,
  faFileArrowDown,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import db from "../db";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Operaciones.css";
import EditarOperaciones from "./EditarOperaciones";
import { obtenerFechaFormateada } from "./fecha.js";

const Operaciones = () => {
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tituloOperacion, setTituloOperacion] = useState("");
  const [operaciones, setOperaciones] = useState([]);
  const [operacionesDB, setOperacionesDB] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const cargarOperacionesDesdeDB = async () => {
    const operacionesDesdeDB = await db.operaciones.toArray();
    setOperacionesDB(operacionesDesdeDB);
  };

  useEffect(() => {
    const cargarOperacionesDesdeDB = async () => {
      const operacionesDesdeDB = await db.operaciones.toArray();
      setOperacionesDB(operacionesDesdeDB);
    };

    cargarOperacionesDesdeDB();
  }, []); // Solo se ejecuta una vez al montar el componente

  const manejarCambioDeDescripcion = (e) => {
    const value = e.target.value;
    setDescripcion(value);
  };

  const manejarCambioDeCantidad = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setCantidad(value);
    }
  };

  const manejarCambioDeTitulo = (e) => {
    const value = e.target.value;
    setTituloOperacion(value);
  };

  const handleAddOperation = (tipoOperacion) => {
    if (descripcion && cantidad) {
      const cantidadOperacion =
        parseFloat(cantidad) * (tipoOperacion === "sumar" ? 1 : -1);
      const nuevaOperacion = {
        descripcion,
        cantidad: cantidadOperacion,
        total: total + cantidadOperacion,
      };

      setOperaciones([...operaciones, nuevaOperacion]);
      setDescripcion("");
      setCantidad("");
      calcularTotal([...operaciones, nuevaOperacion]);
      toast.success("Operación Agregada.");
    } else {
      toast.warn("Por favor, complete todos los campos.");
    }
  };

  const calcularTotal = (operacionesActualizadas) => {
    const totalCantidad = operacionesActualizadas.reduce(
      (acc, operacion) => acc + operacion.cantidad,
      0
    );
    setTotal(totalCantidad);
  };

  const manejarGuardarOperacion = async () => {
    const existingOperacion = operacionesDB.find(
      (operacion) => operacion.titulo === tituloOperacion
    );
    if (existingOperacion) {
      toast.warn(
        "La lista ya existe. Por favor, elige un título diferente o da click en el botón actualizar para actualizar la lista."
      );
      return;
    }
    try {
      // Guardar operaciones en IndexedDB
      const registroOperacion = {
        titulo: tituloOperacion,
        operaciones: operaciones,
      };

      await db.operaciones.add(registroOperacion);
      // Recargar operaciones desde IndexedDB al estado
      cargarOperacionesDesdeDB();
      // Limpiar el título y las operaciones después de guardar la operación
      setTituloOperacion("");
      setOperacionesDB([]);
      toast.success("La operación se ha guardado.");
    } catch (error) {
      console.error("Error al guardar la operación:", error);
      toast.error(
        "Hubo un error al guardar la operación. Consulta la consola para más detalles."
      );
    }
  };

  const manejarCargarOperacion = () => {
    if (selectedOperation) {
      setOperaciones(selectedOperation.operaciones);
      setTituloOperacion(selectedOperation.titulo);
      calcularTotal(selectedOperation.operaciones);
    }
  };

  const handleUpdateOperacion = () => {
    // Verificar si hay una lista seleccionada para actualizar
    if (selectedOperation) {
      // Actualizar la lista en IndexedDB con los cambios
      const updatedOperacion = {
        ...selectedOperation,
        title: tituloOperacion,
        operaciones: operaciones,
      };

      db.operaciones
        .update(selectedOperation.id, updatedOperacion)
        .then(() => {
          toast.success("Lista Actualizada.");
          // Recargar listas desde IndexedDB al estado
          cargarOperacionesDesdeDB();
        })
        .catch((error) => {
          console.error("Error al actualizar lista:", error);
          toast.error(
            "Error al actualizar lista. Consulta la consola para más detalles."
          );
        });
    } else {
      toast.warn(
        "Por favor, selecciona una lista antes de intentar actualizar."
      );
    }
  };

  const tablaRef = useRef(null);

  function capturarTabla(tabla) {
    html2canvas(tabla).then(function (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "Operaciones.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fechaFormateada = obtenerFechaFormateada();

  return (
    <div>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedOperation(
              operacionesDB.find(
                (operacion) => operacion.titulo === e.target.value
              )
            )
          }
        >
          <option value="">Seleccionar Operación</option>
          {operacionesDB.map((operacion, index) => (
            <option key={index} value={operacion.titulo}>
              {operacion.titulo}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <button onClick={manejarCargarOperacion} className="boton-cargar">
          <FontAwesomeIcon icon={faFileArrowDown}></FontAwesomeIcon> Cargar
          Operación
        </button>
      </div>
      <hr />
      <div className="container">
        <input
          type="text"
          placeholder="Título"
          value={tituloOperacion}
          onChange={(e) => manejarCambioDeTitulo(e)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => manejarCambioDeDescripcion(e)}
        />
        <input
          type="text"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => manejarCambioDeCantidad(e)}
        />
        <div className="div-botones">
          <button
            onClick={() => handleAddOperation("sumar")}
            className="boton-sumar"
          >
            <FontAwesomeIcon icon={faPlus} /> Sumar
          </button>
          <button
            onClick={() => handleAddOperation("restar")}
            className="boton-restar"
          >
            <FontAwesomeIcon icon={faMinus} /> Restar
          </button>
        </div>
      </div>
      <hr />
      <table ref={tablaRef} className="tabla-operaciones">
        <thead>
          <tr>
            <th colSpan={3} style={{ textAlign: "center" }}>
              {tituloOperacion}
            </th>
          </tr>
          <tr>
            <th colSpan={3} style={{ textAlign: "center" }}>
              {fechaFormateada}
            </th>
          </tr>
          <tr>
            <th>#</th>
            <th>Descripción</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {operaciones.map((operacion, index) => (
            <>
              <tr
                key={index}
                style={{
                  backgroundColor: operacion.cantidad < 0 ? "#E54040" : "#A6FF00",
                  // Agrega otros estilos según sea necesario
                }}
              >
                <td>{index + 1}</td>
                <td>{operacion.descripcion}</td>
                <td>
                  $ {formatNumberWithCommas(operacion.cantidad.toFixed(2))}
                </td>
              </tr>
              <tr className="celda-total-parcial">
                <td></td>
                <td className="celda-total-parcial">Total parcial</td>
                <td className="celda-total-parcial">$ {formatNumberWithCommas(operacion.total.toFixed(2))}</td>
              </tr>
            </>
          ))}

          <tr>
            <td
              colSpan={3}
              style={{
                textAlign: "right",
                fontSize: "30px",
                backgroundColor: "#00AEFF",
              }}
            >
              Total: $ {formatNumberWithCommas(total.toFixed(2))}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="container">
        <div className="div-botones">
          <button onClick={manejarGuardarOperacion} className="boton-guardar">
            <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
          <button onClick={handleUpdateOperacion} className="boton-actualizar">
            <FontAwesomeIcon icon={faRefresh} /> Actualizar
          </button>
          <button
            onClick={() => capturarTabla(tablaRef.current)}
            className="boton-capturar"
          >
            <FontAwesomeIcon icon={faCamera} /> Capturar
          </button>
        </div>
      </div>
      <EditarOperaciones></EditarOperaciones>
    </div>
  );
};

export default Operaciones;
