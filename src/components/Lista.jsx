// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
  faCalculator,
  faCamera,
  faCartPlus,
  faFileArrowDown,
  faFileDownload,
  faRefresh,
  faSdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Lista.css";
import db from "../db";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditarLista from "./EditarLista";
import { obtenerFechaFormateada } from "./fecha.js";

const ProductList = () => {
  const [tableTitle, setTableTitle] = useState("");
  const [tableComentarios, setTableComentarios] = useState("");
  const [products, setProducts] = useState([]);
  const [inputValues, setInputValues] = useState({
    cantidad: "",
    descripcion: "",
    precioUnitario: "",
    total: "",
  });
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [numPersons, setNumPersons] = useState("");
  const [totalDivided, setTotalDivided] = useState(0);
  const [showDividerRow, setShowDividerRow] = useState(false);

  const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);

useEffect(() => {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Evita que el mini-infobar aparezca en el móvil.
    event.preventDefault();
    console.log("👍", "beforeinstallprompt", event);
    // Guarde el evento para que pueda activarse más tarde.
    window.deferredPrompt = event;
    // Elimine la clase 'oculta' del contenedor del botón de instalación.
    setIsReadyForInstall(true);
  });
}, []);

async function downloadApp() {
  console.log("👍", "butInstall-clicked");
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // El mensaje diferido no está disponible.
     console.log("Ups, no se guardó ningún evento de aviso en window");
    return;
  }
  // Muestra el mensaje de instalación.
  promptEvent.prompt();
  // Registra el resultado
  const result = await promptEvent.userChoice;
  console.log("👍", "userChoice", result);
  // Restablezca la variable de solicitud diferida, ya que
  //Prompt() solo se puede llamar una vez.
  window.deferredPrompt = null;
  // Oculta el botón de instalación.
  setIsReadyForInstall(false);
}

  useEffect(() => {
    loadRecordsFromDB();
  }, []);

  const handleNumPersonsChange = (e) => {
    const value = e.target.value;
    setNumPersons(value === "" ? value : Math.max(parseInt(value, 10), 1));
  };

  const handleCantidadChange = (e) => {
    const value = e.target.value;

    // Verificar si el valor ingresado es un número entero antes de actualizar el estado

    setInputValues({ ...inputValues, cantidad: value });
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    setInputValues({ ...inputValues, descripcion: value });
  };

  const handlePrecioUnitarioChange = (e) => {
    const value = e.target.value;

    // Verificar si el valor ingresado es un número antes de actualizar el estado

    setInputValues({ ...inputValues, precioUnitario: value });
  };

  const handleAddProduct = () => {
    // Validar que todos los campos estén llenos y sean números antes de agregar el producto
    if (
      !isNaN(inputValues.cantidad) &&
      !isNaN(inputValues.precioUnitario) &&
      inputValues.descripcion.trim() !== ""
    ) {
      const newProduct = {
        cantidad: parseInt(inputValues.cantidad, 10),
        descripcion: inputValues.descripcion,
        precioUnitario: parseFloat(inputValues.precioUnitario).toFixed(2),
        total: (
          parseFloat(inputValues.cantidad) *
          parseFloat(inputValues.precioUnitario)
        ).toFixed(2),
      };

      setProducts([...products, newProduct]);
      setInputValues({
        cantidad: "",
        descripcion: "",
        precioUnitario: "",
        total: "",
      });
      toast.success("Producto Añadido.");
    } else {
      toast.warn(
        "Por favor, complete todos los campos y asegúrese de que las cantidades sean números válidos."
      );
    }
  };

  const handleSaveRecord = async () => {
    // Verificar si el título está vacío
    if (tableTitle.trim() === "") {
      toast.warn("Por favor, escribe un título para la lista.");
      return;
    }
    // Verificar si el título de la lista ya existe
    const existingRecord = records.find(
      (record) => record.title === tableTitle
    );
    if (existingRecord) {
      toast.warn(
        "La lista ya existe. Por favor, elige un título diferente o da click en el boton actualizar para actualizar la lista."
      );
      return;
    }

    // Guardar registro en IndexedDB
    const record = {
      comentarios: tableComentarios,
      title: tableTitle,
      products: products,
    };

    await db.records.add(record);
    // Recargar registros desde IndexedDB al estado
    toast.success("Lista Guardada.");
    setTableComentarios("");
    setTableTitle("");
    setProducts([]);
    loadRecordsFromDB();
    // Restablecer el valor del select a su opción predeterminada
    if (selectRef.current) {
      selectRef.current.value = "";
    }
    // Desplazar la página hacia arriba
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Opcional, para un desplazamiento suave
    });
  };

  const handleUpdateList = () => {
    // Verificar si hay un registro seleccionado para actualizar
    if (selectedRecord) {
      // Actualizar el registro en IndexedDB con los cambios
      const updatedRecord = {
        ...selectedRecord,
        comentarios: tableComentarios,
        title: tableTitle,
        products: products,
      };

      db.records
        .update(selectedRecord.id, updatedRecord)
        .then(() => {
          toast.success("Lista Actualizada.");
          // Recargar registros desde IndexedDB al estado
          loadRecordsFromDB();
        })
        .catch((error) => {
          console.error("Error al actualizar lista:", error);
          toast.error(
            "Error al actualizar lista. Consulta la consola para más detalles."
          );
        });
      setTableComentarios("");
      setTableTitle("");
      setProducts([]);
      loadRecordsFromDB();
      // Restablecer el valor del select a su opción predeterminada
    if (selectRef.current) {
      selectRef.current.value = "";
    }
      // Desplazar la página hacia arriba
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Opcional, para un desplazamiento suave
      });
    } else {
      toast.warn(
        "Por favor, selecciona una lista antes de intentar actualizar."
      );
    }
  };

  const handleLoadRecord = () => {
    // Cargar productos del registro seleccionado
    if (selectedRecord) {
      setTableComentarios(selectedRecord.comentarios);
      setTableTitle(selectedRecord.title);
      setProducts(selectedRecord.products);
    }
  };

  const getTotalSum = () => {
    return products
      .reduce((total, product) => {
        // Utilizar parseInt para convertir la cantidad a número entero antes de la multiplicación
        const cantidad = parseInt(product.cantidad, 10);
        const subtotal = cantidad * parseFloat(product.precioUnitario);
        return total + subtotal;
      }, 0)
      .toFixed(2);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const loadRecordsFromDB = async () => {
    const recordsFromDB = await db.records.toArray();
    setRecords(recordsFromDB);
  };

  const tablaRef = useRef(null);
  // Crea una referencia para el elemento select
  const selectRef = useRef(null);

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

  const handleCalculateSplit = () => {
    if (numPersons > 0) {
      const totalDividedValue = (getTotalSum() / numPersons).toFixed(2);
      setTotalDivided(totalDividedValue);
      setShowDividerRow(true);
    } else {
      toast.warn("Ingrese un número válido de personas.");
    }
  };

  const fechaFormateada = obtenerFechaFormateada();

  return (
    <div>
      {isReadyForInstall && (
        <button className="button-app" onClick={downloadApp}>Instalar App <FontAwesomeIcon icon={faFileDownload} /> </button>
      )}
      <br></br>
      <div className="container">
        <select ref={selectRef} id="tuSelectId"
          onChange={(e) =>
            setSelectedRecord(
              records.find((record) => record.title === e.target.value)
            )
          }
        >
          <option value="">Seleccionar Lista</option>
          {records.map((record) => (
            <option key={record.id} value={record.title}>
              {record.title}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <button onClick={handleLoadRecord} className="boton-cargar">
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
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={inputValues.cantidad}
          onChange={handleCantidadChange}
        />
        <textarea
          placeholder="Descripción"
          name="descripcion"
          value={inputValues.descripcion}
          onChange={handleDescripcionChange}
          rows={4} // Puedes ajustar el número de filas según tus necesidades
        />
        <input
          type="number"
          name="precioUnitario"
          placeholder="Precio Unitario"
          value={inputValues.precioUnitario}
          onChange={handlePrecioUnitarioChange}
        />
      </div>
      <div className="container">
        <button onClick={handleAddProduct} className="boton-cargar">
          <FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon> Agregar Producto
        </button>
      </div>
      <hr></hr>
      <table ref={tablaRef} className="tabla-productos">
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
            <th>Cant.</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td> {index + 1}</td>
              <td style={{ textAlign: "center" }}>{product.cantidad}</td>
              <td>{product.descripcion}</td>
              <td>$ {product.precioUnitario}</td>
              <td>$ {product.total}</td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={5}
              style={{
                textAlign: "right",
                fontSize: "25px",
                backgroundColor: "#00AEFF",
              }}
            >
              Total: $ {formatNumberWithCommas(getTotalSum())}
            </td>
          </tr>
          {numPersons > 0 && showDividerRow && (
            <tr>
              <td colSpan={5} style={{ textAlign: "right", fontSize: "25px" }}>
                Entre {numPersons}: $ {formatNumberWithCommas(totalDivided)}
              </td>
            </tr>
          )}
        </tbody>
        {tableComentarios !== "" && (
          <tfoot>
            <tr>
              <td colSpan={5} className="comentarios">
                {tableComentarios}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      <div className="contenedor-dividir">
        <label>Entre: </label>
        <input
          className="input-numero-personas"
          type="number"
          value={numPersons}
          placeholder="Número"
          onChange={handleNumPersonsChange}
        />
        <button className="boton-calcular" onClick={handleCalculateSplit}>
          <FontAwesomeIcon icon={faCalculator}></FontAwesomeIcon> Calcular
          División
        </button>
      </div>
      <hr></hr>
      <div className="container-botones">
        <button onClick={handleSaveRecord} className="boton-guardar">
          <FontAwesomeIcon icon={faSdCard}></FontAwesomeIcon> Guardar Lista
        </button>
        <button onClick={handleUpdateList} className="boton-actualizar">
          <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon> Actualizar Lista
        </button>
      </div>
      <div className="container">
        <button
          onClick={() => capturarTabla(tablaRef.current)}
          className="boton-capturar"
        >
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
      <EditarLista></EditarLista>
    </div>
  );
};

export default ProductList;
