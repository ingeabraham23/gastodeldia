// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import db from "../db";
import "./Lista.css";

const DeleteRecord = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadRecordsFromDB();
  }, []);

  const loadRecordsFromDB = async () => {
    const recordsFromDB = await db.records.toArray();
    setRecords(recordsFromDB);
  };

  const handleDeleteRecord = async () => {
    if (selectedRecord) {
      // Eliminar el registro de la base de datos
      await db.records.delete(selectedRecord.id);

      // Recargar la lista de registros desde la base de datos
      loadRecordsFromDB();
    }
  };

  return (
    <div>
      <h2>Eliminar Registro</h2>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedRecord(
              records.find((record) => record.title === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Registro</option>
          {records.map((record) => (
            <option key={record.id} value={record.title}>
              {record.title}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteRecord}>Eliminar Registro</button>
      </div>
    </div>
  );
};

export default DeleteRecord;
