import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {databases, account} from '../firebase-config'
import { ID } from "appwrite";
import './AddReportes.css'
import { CustomToaster, showToast } from './CustomToast';
//import {ToastContainer, toast } from 'react-toastify';

function AddCommerce(){
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        direccion: '', 
        nombre: '', 
        ubicacion: ["", ""],
        userId: '', 
        verificada: false 
    })
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "lat") {
            setForm({
                ...form,
                ubicacion: [value, form.ubicacion[1]] 
            });
        } else if (name === "lng") {
            setForm({
                ...form,
                ubicacion: [form.ubicacion[0], value] 
            });
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };
    
    const handleGeolocation = () => {
        if (!navigator.geolocation) {
         showToast('Su dispositivo no soporta geolocalización', 'error')
        return;
        }

        setError('');
        navigator.geolocation.getCurrentPosition(
        (position) => {
            setForm({
            ...form,
            ubicacion: [
                        position.coords.latitude.toString(),
                        position.coords.longitude.toString()
                    ]
            });
        },
        (err) => {
             showToast('No se pudo obtener su ubicación', 'error')
        }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.direccion.trim()) {
            showToast('Debes introducir una direccion', 'error')
            console.log("Error: Dirección vacía");
            return;
        }

        if (!form.nombre.trim()) {
             showToast('Debes intrudicir un nombre', 'error')
            console.log("Error: Nombre vacío");
            return;
        }

        if (!form.ubicacion[0] || !form.ubicacion[1]) {
             showToast('Debes proporcionar una ubicacion', 'error')
            console.log("Error: Ubicación faltante");
            return;
        }

        try {
            const currentUser = await account.get();
            
            await databases.createDocument(
                '6836a856002abc2c585d', // Database ID
                '6836a924002f72431f73', // Collection ID
                ID.unique(), // Document ID
                {
                    direccion: form.direccion,
                    nombre: form.nombre,
                    ubicacion: [parseFloat(form.ubicacion[0]), parseFloat(form.ubicacion[1])],
                    userId: currentUser.$id,
                    verificada: form.verificada
                }
            );

            showToast('Comercio añadido corectamente', 'success')
            setTimeout(() => navigate("/list-comerc"), 2000);
        } catch (error) {
            console.error("Error al guardar:", error);
            showToast('Error al guardar el comercio'+error.message, 'error')
        }
    };
    
    return (
        <div className="add-report-container">
            <CustomToaster/> 
            <h1 className="add-report-title">
                Agregar Comercio
            </h1>
            <form action="" onSubmit={handleSubmit} className="add-report-form">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Direccion: </label>
                    <input className="form-input" type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ej: Calle 23 /E y F, Vedado" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="" className="form-label">Nombre: </label>
                    <input className="form-input" type="text" placeholder="Nombre del Comercio" name="nombre" value={form.nombre}  onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="" className="form-label">Ubicacion
                        <div className="location-container">
                            <input   type="number" name="lat" value={form.ubicacion[0]}  onChange={handleChange}  className="coord-input" placeholder="Latitud" step="any" required/>
                            <input   type="number" name="lng" value={form.ubicacion[1]}  onChange={handleChange}  className="coord-input"  placeholder="Longitud"  step="any" required/>
                            <button  className="geo-button" type="button" onClick={handleGeolocation}> Usar mi ubicación  </button>
                        </div>
                    </label>
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button"  >  Enviar Comercio </button>
                    <button type="button"  onClick={() => navigate('/')}  className="cancel-button">Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export default AddCommerce;