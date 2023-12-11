// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./Lista.css";
import db from "../db";
import {
  faCamera,
  faFileArrowDown,
  faMinusCircle,
  faPersonCirclePlus,
  faSdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditarPersonas from "./EditarPersonas";

const PersonList = () => {
  const [tableTitle, setTableTitle] = useState("");
  const [persons, setPersons] = useState([]);
  const [inputValues, setInputValues] = useState({
    nombre: "",
    aporte: "",
  });
  const [listas, setListas] = useState([]);
  const [selectedLista, setSelectedLista] = useState(null);
  const [amountToSubtract, setAmountToSubtract] = useState("");
  const [showSubtractRows, setShowSubtractRows] = useState(false);
  const [newTotal, setNewTotal] = useState(0);

  useEffect(() => {
    loadListasFromDB();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleAddPerson = () => {
    // Validar que todos los campos estén llenos antes de agregar la persona
    if (inputValues.nombre && inputValues.aporte) {
      const newPerson = {
        nombre: inputValues.nombre,
        aporte: parseInt(inputValues.aporte, 10),
      };

      setPersons([...persons, newPerson]);
      setInputValues({
        nombre: "",
        aporte: "",
      });
      toast.success("Persona agregada.");
    } else {
      toast.warn("Por favor, complete todos los campos.");
    }
  };

  const handleSaveLista = async () => {
    // Verificar si el título de la lista ya existe
    const existingLista = listas.find((lista) => lista.title === tableTitle);
    if (existingLista) {
      toast.warn("La lista ya existe. Por favor, elige un título diferente o da click en el botón actualizar para actualizar la lista.");
      return;
    }

    try {
      // Guardar registro en IndexedDB
      const lista = {
        title: tableTitle,
        persons: persons,
      };

      await db.listas.add(lista);
      // Recargar registros desde IndexedDB al estado
      toast.success("La lista de Personas se ha guardado.");
      loadListasFromDB();
    } catch (error) {
      console.error("Error al guardar la lista:", error);
      toast.error("Hubo un error al guardar la lista.");
    }
  };

  const handleUpdateLista = () => {
    // Verificar si hay una lista seleccionada para actualizar
    if (selectedLista) {
      // Actualizar la lista en IndexedDB con los cambios
      const updatedLista = {
        ...selectedLista,
        title: tableTitle,
        persons: persons,
      };

      db.listas.update(selectedLista.id, updatedLista)
        .then(() => {
          toast.success("Lista Actualizada.");
          // Recargar listas desde IndexedDB al estado
          loadListasFromDB();
        })
        .catch((error) => {
          console.error("Error al actualizar lista:", error);
          toast.error("Error al actualizar lista. Consulta la consola para más detalles.");
        });
    } else {
      toast.warn("Por favor, selecciona una lista antes de intentar actualizar.");
    }
  };

  const handleLoadLista = () => {
    // Cargar personas de la lista seleccionada
    if (selectedLista) {
      setTableTitle(selectedLista.title);
      setPersons(selectedLista.persons);
    }
  };

  const getTotalSum = () => {
    return persons.reduce((total, person) => {
      const aporte = parseFloat(person.aporte);
      return isNaN(aporte) ? total : total + aporte;
    }, 0);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const loadListasFromDB = async () => {
    const listasFromDB = await db.listas.toArray();
    setListas(listasFromDB);
  };

  const tablaRef = useRef(null);

  function capturarTabla(tabla) {
    html2canvas(tabla).then(function (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = tableTitle + ".png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  const handleSubtractAmount = () => {
    if (amountToSubtract >= 0) {
      const calculatedTotal = getTotalSum() - amountToSubtract;

      // Actualiza el estado de newTotal
      setNewTotal(calculatedTotal);

      // Muestra las filas adicionales
      setShowSubtractRows(true);
    } else {
      toast.warn("Ingrese una cantidad válida para restar.");
    }
  };

  return (
    <div>
      <br></br>
      <div className="container">
        <select
          onChange={(e) =>
            setSelectedLista(
              listas.find((lista) => lista.title === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Lista</option>
          {listas.map((lista) => (
            <option key={lista.id} value={lista.title}>
              {lista.title}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <button onClick={handleLoadLista} className="boton-cargar">
          <FontAwesomeIcon icon={faFileArrowDown}></FontAwesomeIcon> Cargar
          Lista
        </button>
      </div>
      <hr></hr>
      <div className="container">
        <input
          type="text"
          placeholder="Título"
          value={tableTitle}
          onChange={(e) => setTableTitle(e.target.value)}
        />

        <textarea
          placeholder="Nombre"
          name="nombre"
          value={inputValues.nombre}
          onChange={handleInputChange}
          rows={4} // Puedes ajustar el número de filas según tus necesidades
        />
        <input
          type="number"
          name="aporte"
          placeholder="Aporte"
          value={inputValues.aporte}
          onChange={handleInputChange}
        />
      </div>
      <div className="container">
        <button onClick={handleAddPerson} className="boton-cargar">
        <FontAwesomeIcon icon={faPersonCirclePlus}></FontAwesomeIcon> Agregar Persona
        </button>
      </div>
      <hr></hr>
      <table ref={tablaRef}>
        <thead>
          <tr>
            <th colSpan={5} style={{ textAlign: "center" }}>
              {tableTitle}
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Aporte</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person, index) => (
            <tr key={index}>
              <td> {index + 1}</td>
              <td>{person.nombre}</td>
              <td>${formatNumberWithCommas(person.aporte)}.00</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ textAlign: "right", fontSize: "25px" }}>
              Total: $ {formatNumberWithCommas(getTotalSum().toFixed(2))}
            </td>
          </tr>
          {showSubtractRows && (
            <>
              <tr>
                <td colSpan={5} style={{ textAlign: "right", fontSize: "25px" }}>
                  Restar: $ {formatNumberWithCommas(amountToSubtract)}.00
                </td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "right", fontSize: "25px" }}>
                  Nuevo Total: $ {formatNumberWithCommas(newTotal)}.00
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <div className="container">
        <label>Restar: </label>
        <input
          className="input-amount-to-subtract"
          type="number"
          value={amountToSubtract}
          placeholder="Cantidad"
          onChange={(e) => setAmountToSubtract(e.target.value)}
        />
        <button onClick={handleSubtractAmount} className="boton-restar">
          <FontAwesomeIcon icon={faMinusCircle}></FontAwesomeIcon> Restar
        </button>
      </div>
      <hr></hr>
      <div className="container-botones">
        <button onClick={handleSaveLista} className="boton-guardar">
          <FontAwesomeIcon icon={faSdCard}></FontAwesomeIcon> Guardar Lista
        </button>
        <button onClick={handleUpdateLista} className="boton-actualizar">
          <FontAwesomeIcon icon={faSdCard}></FontAwesomeIcon> Actualizar Lista
        </button>
      </div>
      <div className="container">
        <button onClick={() => capturarTabla(tablaRef.current)} className="boton-capturar" >
          <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon> Capturar Lista
        </button>
      </div>
      <EditarPersonas></EditarPersonas>
    </div>
  );
};

export default PersonList;
