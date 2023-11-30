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

    // Actualiza el valor solo si es un número o está vacío
    if (/^\d*$/.test(value) || value === "") {
      setInputValues({ ...inputValues, [name]: value });
    } else if (/^0+$/.test(value)) {
      // Permite que el usuario borre el 0
      setInputValues({ ...inputValues, [name]: "" });
    }
  };

  const handleAddPerson = () => {
    // Validar que todos los campos estén llenos antes de agregar el producto
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

  const handleLoadLista = () => {
    // Cargar productos del registro seleccionado
    if (selectedLista) {
      setTableTitle(selectedLista.title);
      setPersons(selectedLista.persons);
    }
  };

  const getTotalSum = () => {
    return persons.reduce((total, person) => total + person.aporte, 0);
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
          <option value="">Seleccionar Registro</option>
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
              <td>$ {person.aporte}.00</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={{ textAlign: "right", fontSize: "25px" }}>
              Total: $ {formatNumberWithCommas(getTotalSum())}.00
            </td>
          </tr>
          {showSubtractRows && (
            <>
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "right", fontSize: "25px" }}
                >
                  - $ {formatNumberWithCommas(amountToSubtract)}.00
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "right", fontSize: "25px" }}
                >
                  Total $ {formatNumberWithCommas(newTotal)}.00
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <div className="contenedor-dividir">
        <label>Restar: </label>
        <input
          className="input-restar"
          type="number"
          value={amountToSubtract}
          placeholder="Cantidad"
          onChange={(e) =>
            setAmountToSubtract(parseInt(e.target.value, 10) || 0)
          }
        />
        <button onClick={handleSubtractAmount} className="boton-calcular">
        <FontAwesomeIcon icon={faMinusCircle}></FontAwesomeIcon> Restar Cantidad
        </button>
      </div>
      <hr></hr>
      <div className="container">
        <button onClick={handleSaveLista} className="boton-guardar">
        <FontAwesomeIcon icon={faSdCard}></FontAwesomeIcon> Guardar Lista
        </button>
      </div>
      <div className="container">
        <button
          onClick={() => capturarTabla(tablaRef.current)}
          className="boton-capturar"
        >
          <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon> Capturar
        </button>
      </div>
    </div>
  );
};

export default PersonList;
