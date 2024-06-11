// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
import "./EliminarRegistro.css";

import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const DeleteRecord = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [listas, setListas] = useState([]);
  const [selectedLista, setSelectedLista] = useState();
  const [operaciones, setOperaciones] = useState([]);
  const [selectedOperacion, setSelectedOperacion] = useState();
  const [simples, setSimples] = useState([]);
  const [selectedSimple, setSelectedSimple] = useState();

  useEffect(() => {
    loadRecordsFromDB();
    loadListasFromDB();
    loadOperacionesFromDB();
    loadSimplesFromDB();
  }, []);

  const loadRecordsFromDB = async () => {
    const recordsFromDB = await db.records.toArray();
    setRecords(recordsFromDB);
  };

  const loadListasFromDB = async () => {
    const listasFromDB = await db.listas.toArray();
    setListas(listasFromDB);
  };

  const loadOperacionesFromDB = async () => {
    const operacionesFromDB = await db.operaciones.toArray();
    setOperaciones(operacionesFromDB);
  };

  const loadSimplesFromDB = async () => {
    const simplesFromDB = await db.simple.toArray();
    setSimples(simplesFromDB);
  };

  const handleDeleteRecord = async () => {
    if (selectedRecord) {
      // Eliminar el registro de la base de datos
      await db.records.delete(selectedRecord.id);
      toast.warn("La lista de Productos se ha Eliminado")
      // Recargar la lista de registros desde la base de datos
      loadRecordsFromDB();
    }
  };
  const handleDeleteLista = async () => {
    if (selectedLista) {
      // Eliminar el registro de la base de datos
      await db.listas.delete(selectedLista.id);
      toast.warn("La lista de Personas se ha Eliminado")
      // Recargar la lista de registros desde la base de datos
      loadListasFromDB();
    }
  };

  const handleDeleteOperacion = async () => {
    if (selectedOperacion) {
      // Eliminar el registro de la base de datos
      await db.operaciones.delete(selectedOperacion.id);
      toast.warn("La lista de Operaciones se ha Eliminado")
      // Recargar la lista de registros desde la base de datos
      loadOperacionesFromDB();
    }
  };

  const handleDeleteSimple = async () => {
    if (selectedSimple) {
      // Eliminar el registro de la base de datos
      await db.simple.delete(selectedSimple.id);
      toast.warn("La lista Simple se ha Eliminado")
      // Recargar la lista de registros desde la base de datos
      loadSimplesFromDB();
    }
  };

  return (
    <div>
      <h2>Eliminar Lista de Productos.</h2>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedRecord(
              records.find((record) => record.title === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Lista.</option>
          {records.map((record) => (
            <option key={record.id} value={record.title}>
              {record.title}
            </option>
          ))}
        </select>
        <button className="boton-eliminar" onClick={handleDeleteRecord}>Eliminar Lista</button>
      </div>
      <hr></hr>
      <h2>Eliminar Lista Simple.</h2>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedSimple(
              simples.find((simple) => simple.title === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Lista.</option>
          {simples.map((simple) => (
            <option key={simple.id} value={simple.title}>
              {simple.title}
            </option>
          ))}
        </select>
        <button className="boton-eliminar" onClick={handleDeleteSimple}>Eliminar Lista</button>
      </div>
      <hr></hr>
      <div>
      <h2>Eliminar Lista de Personas.</h2>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedLista(
              listas.find((lista) => lista.title === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Lista.</option>
          {listas.map((lista) => (
            <option key={lista.id} value={lista.title}>
              {lista.title}
            </option>
          ))}
        </select>
        <button className="boton-eliminar" onClick={handleDeleteLista}>Eliminar Lista</button>
      </div>
      <h2>Eliminar Lista de Operaciones.</h2>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedOperacion(
              operaciones.find((operacion) => operacion.titulo === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Lista.</option>
          {operaciones.map((operacion) => (
            <option key={operacion.id} value={operacion.titulo}>
              {operacion.titulo}
            </option>
          ))}
        </select>
        <button className="boton-eliminar" onClick={handleDeleteOperacion}>Eliminar Operacion</button>
      </div>
    </div>
    </div>
    
  );
};

export default DeleteRecord;
