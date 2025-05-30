import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {databases, storage, account} from "../firebase-config"
import './AddReportes.css';
import { Query } from 'appwrite';
// Constantes para los límites de Cuba
const CUBA_LIMITS = {
    latMin: 19.9,
    latMax: 23.2,
    lngMin: -85.0,
    lngMax: -74.1
};

function AddReport() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        producto: '',
        tipo: 'medicamento',
        precio: '',
        ubicacion: {
            lat: null,
            lng: null
        },
        comercioId: '',
        foto: null
    });
    const [error, setError] = useState('');
    const [comercios, setComercios] = useState([]);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
    if (message) {
        const timer = setTimeout(() => {
            setMessage(""); // Limpia el mensaje después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
    }, [message]);
    
    useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError(""); // Limpia el error después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
    }, [error]);
    useEffect(() => {
        const fetchComercios = async () => {
            
            try {
                const currentUser = await account.get();
                if (!currentUser) {
                    console.error("No hay un usuario logueado");
                    return;
                }

                const response = await databases.listDocuments(
                    '6836a856002abc2c585d', // Reemplaza con tu ID de base de datos
                    '6836a924002f72431f73', // ID de la colección de comercios
                    [
                        Query.equal('userId', currentUser.$id)
                    ]
                );
                
                const comerciosData = response.documents;
                setComercios(comerciosData);
                
            } catch (error) {
                console.error("Error al obtener los comercios:", error);
                setComercios([]);
            }
        };

        fetchComercios();
    }, []);
    

    const validateCoordinates = (lat, lng) => {
        if (lat < CUBA_LIMITS.latMin || lat > CUBA_LIMITS.latMax) {
            throw new Error(`La latitud debe estar entre ${CUBA_LIMITS.latMin}° y ${CUBA_LIMITS.latMax}°`);
        }
        if (lng < CUBA_LIMITS.lngMin || lng > CUBA_LIMITS.lngMax) {
            throw new Error(`La longitud debe estar entre ${CUBA_LIMITS.lngMin}° y ${CUBA_LIMITS.lngMax}°`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "lat" || name === "lng") {
            // Permitir números, punto decimal y signo negativo
            if (!/^-?\d*\.?\d*$/.test(value) && value !== '') {
                return;
            }

            // Actualizar el estado con el valor actual
            setForm({
                ...form,
                ubicacion: {
                    ...form.ubicacion,
                    [name]: value
                }
            });

            // Solo validar si hay un valor completo
            if (value !== '') {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                    try {
                        validateCoordinates(
                            name === "lat" ? numValue : form.ubicacion.lat,
                            name === "lng" ? numValue : form.ubicacion.lng
                        );
                    } catch (error) {
                        setError(error.message);
                    }
                }
            }
        } else if (name === "precio") {
            setForm({
                ...form,
                [name]: value
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
            setError("Tu navegador no soporta geolocalización");
            return;
        }

        setError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                try {
                    validateCoordinates(position.coords.latitude, position.coords.longitude);
                    setForm({
                        ...form,
                        ubicacion: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                } catch (error) {
                    setError(error.message);
                }
            },
            (err) => {
                setError("No se pudo obtener tu ubicación: " + err.message);
            }
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let fotoUrl = null;
            
            // Si hay una foto, súbela primero
             if (form.foto) {
                const fileId = ID.unique();
                const response = await storage.createFile(
                    'dondehaycuba', // Bucket ID
                    fileId,
                    form.foto
                );
                
                fotoUrl = `https://cloud.appwrite.io/v1/storage/buckets/reportes/files/${fileId}/view?project=tu-project-id`;
            }

            // Validar coordenadas antes de enviar
            validateCoordinates(form.ubicacion.lat, form.ubicacion.lng);

            // Crear documento en Appwrite
            await databases.createDocument(
                'tu-database-id', // Database ID
                'reportes', // Collection ID
                ID.unique(), // Document ID (auto-generado)
                {
                    producto: form.producto.trim(),
                    tipo: form.tipo,
                    precio: Number(form.precio),
                    ubicacion: {
                        lat: parseFloat(form.ubicacion.lat),
                        lng: parseFloat(form.ubicacion.lng)
                    },
                    fecha: new Date().toISOString(),
                    userId: (await account.get()).$id,
                    comercioId: form.comercioId,
                    esComercioVerificado: true,
                    fotoUrl: fotoUrl
                }
            );

            setMessage("Reporte agregado");
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error("Error al agregar el reporte", error);
            setError(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="add-report-container">
            
        <h1 className="add-report-title">Añadir Reporte</h1>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }} className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="add-report-form">
            <div className="form-group">
            <label className="form-label">
                Producto:
                <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Paracetamol 500mg"
                />
            </label>
            </div>

            <div className="form-group">
            <label className="form-label">
                Tipo:
                <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="form-select"
                >
                <option value="medicamento">Medicamento</option>
                <option value="alimento">Alimento</option>
                </select>
            </label>
            </div>

            <div className="form-group">
            <label className="form-label">
                Precio (CUP):
                <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: 10"
                min="0"
                step="0.01"
                />
            </label>
            </div>
            <div className="form-group">
            <label className="form-label">
                Comercio:
                <select
                    name="comercioId"
                    value={form.comercioId}
                    onChange={handleChange}
                    className="form-select"
                    required
                >
                    <option value="">Seleccionar comercio</option>
                    {comercios.length === 0 ? (
                    <option value="">Cree un Comercio</option>
                ) : (
                    comercios.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))
                )}
                </select>
                <Link to="/add-comerce">
                    <button className='btn_commerce'> 
                        Crear Comercio
                    </button>
                </Link>
            </label>
            </div>
            <div className="form-group">
            <label className="form-label">
                Ubicación:
                <div className="location-container">
                <input
                    type="text"
                    inputMode="decimal"
                    name="lat"
                    value={form.ubicacion.lat || ''}
                    onChange={handleChange}
                    className="coord-input"
                    placeholder="Latitud (19.9° - 23.2°)"
                />
                <input
                    type="text"
                    inputMode="decimal"
                    name="lng"
                    value={form.ubicacion.lng || ''}
                    onChange={handleChange}
                    className="coord-input"
                    placeholder="Longitud (-85.0° - -74.1°)"
                />
                <button 
                    type="button" 
                    onClick={handleGeolocation}
                    className="geo-button"
                >
                    Usar mi ubicación
                </button>
                </div>
            </label>
            </div>

            <div className="button-group">
            <button 
                type="submit" 
                className="submit-button"
                disabled={!form.producto || !form.precio || !form.ubicacion.lat || !form.ubicacion.lng || isUploading}
            >
                {isUploading ? 'Subiendo...' : 'Enviar Reporte'}
            </button>
            <button 
                type="button" 
                onClick={() => navigate('/')}
                className="cancel-button"
            >
                Cancelar
            </button>
            </div>
        </form>
        </div>
    );
}

export default AddReport;