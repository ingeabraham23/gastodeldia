// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import ProductList from './components/Lista'
import DeleteRecord from './components/EliminarRegistro'
import './App.css'

function App() {


  return (

<div>
  <ProductList></ProductList>
  <hr></hr>
  <DeleteRecord></DeleteRecord>
</div>
  )
}

export default App
