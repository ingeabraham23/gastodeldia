// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./ListaSimple.css";
import db from "../db";
import {
  faCamera,
  faFileArrowDown,
  faPersonCirclePlus,
  faSdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { obtenerFechaFormateada } from "./fecha.js";
import EditarSimple from "./EditarSimple.jsx";

const Simple = () => {
  const [tableTitle, setTableTitle] = useState("");
  const [tableComentarios, setTableComentarios] = useState("");
  const [persons, setPersons] = useState([]);
  const [inputValues, setInputValues] = useState({
    nombre: "",
  });
  const [listas, setListas] = useState([]);
  const [selectedLista, setSelectedLista] = useState(null);

  useEffect(() => {
    loadListasFromDB();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleAddPerson = () => {
    // Validar que todos los campos estén llenos antes de agregar la persona
    if (inputValues.nombre) {
      const newPerson = {
        nombre: inputValues.nombre,
      };

      setPersons([...persons, newPerson]);
      setInputValues({
        nombre: "",
      });
      toast.success("Persona agregada.");
    } else {
      toast.warn("Por favor, complete todos los campos.");
    }
  };

  const handleSaveLista = async () => {
    // Verificar si el título está vacío
    if (tableTitle.trim() === "") {
      toast.warn("Por favor, escribe un título para la lista.");
      return;
    }
    // Verificar si el título de la lista ya existe
    const existingLista = listas.find((lista) => lista.titulo === tableTitle);
    if (existingLista) {
      toast.warn("La lista ya existe. Por favor, elige un título diferente o da click en el botón actualizar para actualizar la lista.");
      return;
    }

    try {
      // Guardar registro en IndexedDB
      const lista = {
        comentarios: tableComentarios,
        title: tableTitle,
        persons: persons,
      };

      await db.simple.add(lista);
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
        comentarios: tableComentarios,
        title: tableTitle,
        persons: persons,
      };

      db.simple.update(selectedLista.id, updatedLista)
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
      setTableComentarios(selectedLista.comentarios)
      setTableTitle(selectedLista.title);
      setPersons(selectedLista.persons);
    }
  };

  /* const getTotalSum = () => {
    return persons.reduce((total, person) => {
      const aporte = parseFloat(person.aporte);
      return isNaN(aporte) ? total : total + aporte;
    }, 0);
  }; */

  /* const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }; */

  const loadListasFromDB = async () => {
    const listasFromDB = await db.simple.toArray();
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

  /* const handleSubtractAmount = () => {
    if (amountToSubtract >= 0) {
      const calculatedTotal = getTotalSum() - amountToSubtract;

      // Actualiza el estado de newTotal
      setNewTotal(calculatedTotal);

      // Muestra las filas adicionales
      setShowSubtractRows(true);
    } else {
      toast.warn("Ingrese una cantidad válida para restar.");
    }
  }; */

  const fechaFormateada = obtenerFechaFormateada();

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
        
      </div>
      <div className="container">
        <button onClick={handleAddPerson} className="boton-cargar">
        <FontAwesomeIcon icon={faPersonCirclePlus}></FontAwesomeIcon> Agregar Persona
        </button>
      </div>
      <hr></hr>
      <table ref={tablaRef} className="lista-personas">
        <thead>
          <tr>
            <th colSpan={5} style={{ textAlign: "center" }}>
              {tableTitle}
            </th>
          </tr>
          <tr>
            <th colSpan={5} style={{ textAlign: "center" }}>
              {fechaFormateada}
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person, index) => (
            <tr key={index}>
              <td> {index + 1}</td>
              <td>{person.nombre}</td>
            </tr>
          ))}
        </tbody>
        {tableComentarios !== "" &&(
        <tfoot>
          <tr>
            <td colSpan={5} className="comentarios" >{tableComentarios}</td>
          </tr>
        </tfoot>
        )}
      </table>
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
      <div className="container">
        <textarea
          name="comentarios"
          placeholder="Comentarios"
          value={tableComentarios}
          onChange={(e) => setTableComentarios(e.target.value)}
          rows={4}
        />
      </div>
      <EditarSimple></EditarSimple>
    </div>
  );
};

export default Simple;
