// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
  faCalculator,
  faCamera,
  faCartPlus,
  faFileArrowDown,
  faSdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Lista.css";
import db from "../db";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [tableTitle, setTableTitle] = useState("");
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

  useEffect(() => {
    loadRecordsFromDB();
  }, []);

  const handleNumPersonsChange = (e) => {
    const value = e.target.value;
    setNumPersons(value === "" ? value : Math.max(parseInt(value, 10), 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleAddProduct = () => {
    // Validar que todos los campos estén llenos antes de agregar el producto
    if (
      inputValues.cantidad &&
      inputValues.descripcion &&
      inputValues.precioUnitario
    ) {
      const newProduct = {
        cantidad: inputValues.cantidad,
        descripcion: inputValues.descripcion,
        precioUnitario: inputValues.precioUnitario,
        total: inputValues.cantidad * inputValues.precioUnitario,
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
      toast.warn("Por favor, complete todos los campos.");
    }
  };

  const handleSaveRecord = async () => {
    // Guardar registro en IndexedDB
    const record = {
      title: tableTitle,
      products: products,
    };

    await db.records.add(record);
    // Recargar registros desde IndexedDB al estado
    toast.success("Lista Guardada.");
    loadRecordsFromDB();
  };

  const handleLoadRecord = () => {
    // Cargar productos del registro seleccionado
    if (selectedRecord) {
      setTableTitle(selectedRecord.title);
      setProducts(selectedRecord.products);
    }
  };

  const getTotalSum = () => {
    return products.reduce((total, product) => total + product.total, 0);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const loadRecordsFromDB = async () => {
    const recordsFromDB = await db.records.toArray();
    setRecords(recordsFromDB);
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

  const handleCalculateSplit = () => {
    if (numPersons > 0) {
      const totalDividedValue = (getTotalSum() / numPersons).toFixed(2);
      setTotalDivided(totalDividedValue);
      setShowDividerRow(true);
    } else {
      toast.warn("Ingrese un número válido de personas.");
    }
  };

  return (
    <div>
      <br></br>
      <div className="container">
        <select
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
        <button onClick={handleLoadRecord} className="boton-cargar" >
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
          onChange={handleInputChange}
        />
        <textarea
          placeholder="Descripción"
          name="descripcion"
          value={inputValues.descripcion}
          onChange={handleInputChange}
          rows={4} // Puedes ajustar el número de filas según tus necesidades
        />
        <input
          type="number"
          name="precioUnitario"
          placeholder="Precio Unitario"
          value={inputValues.precioUnitario}
          onChange={handleInputChange}
        />
      </div>
      <div className="container">
        <button onClick={handleAddProduct} className="boton-cargar" >
          <FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon> Agregar Producto
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
            <th>Cant.</th>
            <th>Descripción</th>
            <th>Precio U.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td> {index + 1}</td>
              <td style={{textAlign:"center"}} >{product.cantidad}</td>
              <td>{product.descripcion}</td>
              <td>$ {product.precioUnitario}.00</td>
              <td>$ {product.total}.00</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ textAlign: "right", fontSize: "25px" }}>
              Total: $ {formatNumberWithCommas(getTotalSum())}.00
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
        <button
          className="boton-calcular"
          onClick={handleCalculateSplit}
        >
          <FontAwesomeIcon icon={faCalculator}></FontAwesomeIcon> Calcular
          División
        </button>
      </div>
      <hr></hr>
      <div className="container">
        <button onClick={handleSaveRecord} className="boton-guardar" >
          <FontAwesomeIcon icon={faSdCard}></FontAwesomeIcon> Guardar
          Lista
        </button>
      </div>
      <div className="container">
        <button onClick={() => capturarTabla(tablaRef.current)} className="boton-capturar" >
          <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon> Capturar Lista
        </button>
      </div>
      
    </div>
  );
};

export default ProductList;
