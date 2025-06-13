import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AddReportes from './components/AddReportes.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './utils/fixLeafletIcons.js'
import Mapa from './components/mapa.jsx'
import Buscar from './components/Buscar.jsx'
import Login from './components/login.jsx'
import AddCommerce from './components/AddComerce.jsx'
import ListarReportes from './components/listarReportes.jsx'
import EditarReporte from './components/EditarReportes.jsx'
import EditarComercio from './components/EditarComercio.jsx'
import ListarCommerce from './components/listarCommerce.jsx'
import Encabezado from './components/encabezado.jsx'
import Help from './components/Help.jsx'
import { account } from './firebase-config.js'
import { CustomToaster, showToast } from './components/CustomToast.jsx';
account.get().then(response => {
    console.log('Usuario logueado:', response);
}).catch(error => {
    console.log('No hay sesión activa');
});


window.addEventListener('online', () => {
  console.log('Conexión restaurada');
  showToast('Conexion restaurada', 'success')
  
});

window.addEventListener('offline', () => {
  console.log('Sin conexión');
  showToast('Sin conexion', 'error')
  
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomToaster/>
      <Encabezado/>
      <Routes>
        <Route path="/add-reportes" element={<AddReportes />} />
        <Route path='/' element= {<App />}/>
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mapa/:id?" element={<Mapa />} />
        <Route path="/Search" element={<Buscar />} />
        <Route path="/add-comerce" element={ <AddCommerce/> } />
        <Route path="/list-comerc" element={ <ListarCommerce/>} />
        <Route path="/list-report" element={ <ListarReportes/> } />
        <Route path="/editar-reporte/:id" element={ <EditarReporte/>} />
        <Route path="/editar-comerc/:id" element={<EditarComercio/> } />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)


