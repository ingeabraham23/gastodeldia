// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditarOperaciones = () => {
  const [operaciones, setOperaciones] = useState([]);
  const [selectedOperacion, setSelectedOperacion] = useState(null);
  const [editedOperacion, setEditedOperacion] = useState({
    titulo: "",
    operaciones: [],
  });

  useEffect(() => {
    loadOperacionesFromDB();
  }, []);

  const loadOperacionesFromDB = async () => {
    const operacionesFromDB = await db.operaciones.toArray();
    setOperaciones(operacionesFromDB);
  };

  const handleSelectOperacion = (operacion) => {
    setSelectedOperacion(operacion);
    setEditedOperacion({ ...operacion });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOperacion((prevOperacion) => ({
      ...prevOperacion,
      [name]: value,
    }));
  };

  const handleEditOperacionItem = (index, field, value) => {
    setEditedOperacion((prevOperacion) => {
      const operacionesUpdated = [...prevOperacion.operaciones];
      operacionesUpdated[index][field] = value;
      return {
        ...prevOperacion,
        operaciones: operacionesUpdated,
      };
    });
  };

  const handleDeleteOperacionItem = (index) => {
    setEditedOperacion((prevOperacion) => {
      const operacionesUpdated = [...prevOperacion.operaciones];
      operacionesUpdated.splice(index, 1);
      return {
        ...prevOperacion,
        operaciones: operacionesUpdated,
      };
    });
  };

  const handleUpdateOperacion = async () => {
    if (selectedOperacion) {
      // Validar datos aquí...

      await db.operaciones.update(selectedOperacion.id, editedOperacion);
      loadOperacionesFromDB();
      toast.success("Operación actualizada exitosamente.");
    }
  };

  return (
    <div>
      <hr />
      <div className="container">
        <h2>Editar Operaciones Guardadas</h2>
        <select
          onChange={(e) =>
            handleSelectOperacion(JSON.parse(e.target.value))
          }
          className="select-editar"
        >
          <option value="">Seleccionar Operación</option>
          {operaciones.map((operacion) => (
            <option key={operacion.id} value={JSON.stringify(operacion)}>
              {operacion.titulo}
            </option>
          ))}
        </select>
        {selectedOperacion && (
          <div className="formulario-edicion">
            <input
              type="text"
              name="titulo"
              value={editedOperacion.titulo}
              onChange={handleInputChange}
            />
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>❌</th>
                </tr>
              </thead>
              <tbody>
                {editedOperacion.operaciones.map((operacionItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={operacionItem.descripcion}
                        onChange={(e) =>
                          handleEditOperacionItem(index, "descripcion", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={operacionItem.cantidad}
                        onChange={(e) =>
                          handleEditOperacionItem(index, "cantidad", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteOperacionItem(index)}
                        className="boton-eliminar-operacion"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleUpdateOperacion}
                className="boton-actualizar-editar"
              >
                Actualizar Operación
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarOperaciones;
