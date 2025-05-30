import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {databases, account} from '../firebase-config'
import { ID } from "appwrite";
import './AddReportes.css'
import { Query } from 'appwrite';

function AddCommerce(){
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        direccion: '', 
        nombre: '', 
        ubicacion: {
            lat: null,
            lng: null
        },
        userId: '', 
        verificada: false 
    })
    const [error, setError] = useState('');
    useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError(""); // Limpia el error después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
    }, [error]);

    useEffect(() => {
    if (message) {
        const timer = setTimeout(() => {
            setMessage(""); // Limpia el mensaje después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
    }, [message]);
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si el campo pertenece a "ubicacion", actualiza esa parte del estado
        if (name === "lat" || name === "lng") {
            setForm({
                ...form,
                ubicacion: {
                    ...form.ubicacion,
                    [name]: value // Actualiza lat o lng
                }
            });
        } else {
            // Para otros campos, actualiza directamente
            setForm({
                ...form,
                [name]: value
            });
        }
    };
    
    const handleGeolocation = () => {
        if (!navigator.geolocation) {
        setError("Tu navegador no soporta geolocalización");
        return;
        }

        setError('');
        navigator.geolocation.getCurrentPosition(
        (position) => {
            setForm({
            ...form,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
            });
        },
        (err) => {
            setError("No se pudo obtener tu ubicación: " + err.message);
        }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.direccion.trim()) {
            setError("Debes introducir una direccion");
            console.log("Error: Dirección vacía");
            return;
        }

        if (!form.nombre.trim()) {
            setError("Debes introducir un nombre");
            console.log("Error: Nombre vacío");
            return;
        }

        if (!form.ubicacion.lat || !form.ubicacion.lng) {
            setError("Debes proporcionar una ubicación");
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
                    ubicacion: {
                        lat: parseFloat(form.ubicacion.lat),
                        lng: parseFloat(form.ubicacion.lng)
                    },
                    userId: currentUser.$id,
                    verificada: form.verificada
                }
            );

            setMessage("Comercio añadido correctamente!");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            console.error("Error al guardar:", error);
            setError("Error al guardar el comercio: " + error.message);
        }
    };
    
    return (
        <div className="add-report-container">
            <h1 className="add-report-title">
                Agregar Comercio
            </h1>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }} className="error-text">{error}</p>}
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
                            <input   type="number" name="lat" value={form.ubicacion.lat || ''}  onChange={handleChange}  className="coord-input" placeholder="Latitud" step="any" required/>
                            <input   type="number" name="lng" value={form.ubicacion.lng || ''}  onChange={handleChange}  className="coord-input"  placeholder="Longitud"  step="any" required/>
                            <button  className="geo-button" type="button" onClick={handleGeolocation}> Usar mi ubicación  </button>
                        </div>
                    </label>
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button"  disabled={!form.direccion || !form.nombre || !form.ubicacion.lat || !form.ubicacion.lng }>  Enviar Comercio </button>
                    <button type="button"  onClick={() => navigate('/')}  className="cancel-button">Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export default AddCommerce