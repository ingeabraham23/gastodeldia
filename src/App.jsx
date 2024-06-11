// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import { HashRouter, Routes, Route } from "react-router-dom";
import ProductList from './components/Lista'
import DeleteRecord from './components/EliminarRegistro'
import './App.css'
import PersonList from './components/ListaDePersonas'
import Navbar from "./components/Navbar";
import Operaciones from './components/Operaciones';
import Simple from './components/ListaSimple';

function App() {


  return (
    <HashRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/simple" element={<Simple />} />
            <Route path="/listapersonas" element={<PersonList />} />
            <Route path="/operaciones" element={<Operaciones />} />
            <Route path="/eliminar" element={<DeleteRecord />} />
          </Routes>
        </div>
    </HashRouter>
  )
}

export default App
