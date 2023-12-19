// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
import "./EditarLista.css";
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const EditarLista = () => {
  const [registros, setRegistros] = useState([]);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [registroEditado, setRegistroEditado] = useState({
    title: "",
    products: [],
  });

  useEffect(() => {
    cargarRegistrosDesdeDB();
  }, []);

  const cargarRegistrosDesdeDB = async () => {
    const registrosDesdeDB = await db.records.toArray();
    setRegistros(registrosDesdeDB);
  };

  const manejarSeleccionDeRegistro = (registro) => {
    setRegistroSeleccionado(registro);
    setRegistroEditado({ ...registro });
  };

  const manejarCambioDeEntrada = (e) => {
    const { name, value } = e.target;
    setRegistroEditado((registroPrevio) => ({
      ...registroPrevio,
      [name]: value,
    }));
  };

  const manejarEdicionDeProducto = (index, campo, valor) => {
    setRegistroEditado((registroPrevio) => {
      const productosActualizados = [...registroPrevio.products];
      productosActualizados[index][campo] = valor;
      // Recalcular el total al editar la cantidad o el precio unitario
      productosActualizados[index].total =
        (productosActualizados[index].cantidad *
        productosActualizados[index].precioUnitario).toFixed(2);
      return {
        ...registroPrevio,
        products: productosActualizados,
      };
    });
  };

  const manejarEliminarProducto = (index) => {
    setRegistroEditado((registroPrevio) => {
      const productosActualizados = [...registroPrevio.products];
      productosActualizados.splice(index, 1);
      return {
        ...registroPrevio,
        products: productosActualizados,
      };
    });
  };

  const manejarActualizacionDeRegistro = async () => {
    if (registroSeleccionado) {
      // Validar datos aquí...

      await db.records.update(registroSeleccionado.id, registroEditado);
      cargarRegistrosDesdeDB();
      toast.success("Registro actualizado exitosamente.");
    }
  };

  return (
    <div>
      <hr></hr>
      <div className="container">
        <h2>Editar Registros Guardados</h2>
        <select
          onChange={(e) =>
            manejarSeleccionDeRegistro(JSON.parse(e.target.value))
          }
          className="select-editar"
        >
          <option value="">Seleccionar Registro</option>
          {registros.map((registro) => (
            <option key={registro.id} value={JSON.stringify(registro)}>
              {registro.title}
            </option>
          ))}
        </select>
        {registroSeleccionado && (
          <div className="formulario-edicion">
            <input
              type="text"
              name="title"
              value={registroEditado.title}
              onChange={manejarCambioDeEntrada}
            />
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Cant.</th>
                  <th>Descripción</th>
                  <th>Precio U.</th>
                  <th>Total</th>
                  <th>❌</th>
                </tr>
              </thead>
              <tbody>
                {registroEditado.products.map((producto, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        className="input-cantidad"
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) =>
                          manejarEdicionDeProducto(
                            index,
                            "cantidad",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={producto.descripcion}
                        onChange={(e) =>
                          manejarEdicionDeProducto(
                            index,
                            "descripcion",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input-precio-unitario"
                        type="number"
                        value={producto.precioUnitario}
                        onChange={(e) =>
                          manejarEdicionDeProducto(
                            index,
                            "precioUnitario",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>$ {producto.total}</td>
                    <td>
                      <button
                        onClick={() => manejarEliminarProducto(index)}
                        className="boton-eliminar-producto"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{display: "flex", justifyContent:"center"}}>
            <button
              onClick={manejarActualizacionDeRegistro}
              className="boton-actualizar-editar"
            >
              Actualizar Registro
            </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarLista;
