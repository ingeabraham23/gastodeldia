// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./Lista.css";
import db from "../db";

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

  useEffect(() => {
    loadRecordsFromDB();
  }, []);

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
    } else {
      alert("Por favor, complete todos los campos.");
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
          <option value="">Seleccionar Registro</option>
          {records.map((record) => (
            <option key={record.id} value={record.title}>
              {record.title}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <button onClick={handleLoadRecord}>Cargar Registro</button>
      </div>
      <hr></hr>
      <div>
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
      <div>
        <button onClick={handleAddProduct}>Agregar Producto</button>
      </div>
      
      <table ref={tablaRef}>
        <thead>
          <tr>
            <th colSpan={5} style={{textAlign:"center"}}>{tableTitle}</th>
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
              <td>{product.cantidad}</td>
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
        </tbody>
      </table>
      <div>
          <button onClick={() => capturarTabla(tablaRef.current)}>
            Capturar
          </button>
        </div>
      <div className="container">
        <button onClick={handleSaveRecord}>Guardar Registro</button>
      </div>
    </div>
  );
};

export default ProductList;
