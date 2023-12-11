// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
//import "./EditarLista.css";

const EditarPersonas = () => {
  const [listas, setListas] = useState([]);
  const [selectedLista, setSelectedLista] = useState(null);
  const [editedLista, setEditedLista] = useState({
    title: "",
    persons: [],
  });

  useEffect(() => {
    loadListasFromDB();
  }, []);

  const loadListasFromDB = async () => {
    const listasFromDB = await db.listas.toArray();
    setListas(listasFromDB);
  };

  const handleSelectLista = (lista) => {
    setSelectedLista(lista);
    setEditedLista({ ...lista });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Verificar si el campo es "aporte" y parsear el valor a un número
    const parsedValue = name === "aporte" ? parseFloat(value) : value;
  
    setEditedLista((prevLista) => ({
      ...prevLista,
      [name]: parsedValue,
    }));
  };

  const handleEditPerson = (index, field, value) => {
    setEditedLista((prevLista) => {
      const personsUpdated = [...prevLista.persons];
      personsUpdated[index][field] = value;
      return {
        ...prevLista,
        persons: personsUpdated,
      };
    });
  };

  const handleDeletePerson = (index) => {
    setEditedLista((prevLista) => {
      const personsUpdated = [...prevLista.persons];
      personsUpdated.splice(index, 1);
      return {
        ...prevLista,
        persons: personsUpdated,
      };
    });
  };

  const handleUpdateLista = async () => {
    if (selectedLista) {
      // Validar datos aquí...

      await db.listas.update(selectedLista.id, editedLista);
      loadListasFromDB();
      alert("Lista actualizada exitosamente.");
    }
  };

  return (
    <div>
      <hr></hr>
      <div className="container">
        <h2>Editar Listas Guardadas</h2>
        <select
          onChange={(e) =>
            handleSelectLista(JSON.parse(e.target.value))
          }
          className="select-editar"
        >
          <option value="">Seleccionar Lista</option>
          {listas.map((lista) => (
            <option key={lista.id} value={JSON.stringify(lista)}>
              {lista.title}
            </option>
          ))}
        </select>
        {selectedLista && (
          <div className="formulario-edicion">
            <input
              type="text"
              name="title"
              value={editedLista.title}
              onChange={handleInputChange}
            />
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre</th>
                  <th>Aporte</th>
                  <th>❌</th>
                </tr>
              </thead>
              <tbody>
                {editedLista.persons.map((person, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={person.nombre}
                        onChange={(e) =>
                          handleEditPerson(index, "nombre", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={person.aporte}
                        onChange={(e) =>
                          handleEditPerson(index, "aporte", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeletePerson(index)}
                        className="boton-eliminar-persona"
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
                onClick={handleUpdateLista}
                className="boton-actualizar-editar"
              >
                Actualizar Lista
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarPersonas;
