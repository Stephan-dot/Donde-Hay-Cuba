import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {databases, storage, account} from "../firebase-config"
import './AddReportes.css';
//import { toast } from 'react-toastify'; 
//import 'react-toastify/dist/ReactToastify.css';
import { Query, ID } from 'appwrite';
import { CustomToaster, showToast } from './CustomToast';


function AddReport() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        producto: '',
        tipo: 'medicamento',
        precio: '',
        ubicacion: ["",""],
        comercioId: '',
        foto: null
    });
    const [comercios, setComercios] = useState([]);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const CUBA_LIMITS = {
        latMin: 19.9, 
        latMax: 23.2, 
        lngMin: -85, 
        lngMax: -74.1
    }
    useEffect(() => {
        const fetchComercios = async () => {
            
            try {
                const currentUser = await account.get();
                if (!currentUser) {
                    console.error("No hay un usuario logueado");
                    showToast('Debes Iniciar Sesión', 'error')
                    return;
                }

                const response = await databases.listDocuments(
                    '6836a856002abc2c585d', 
                    '6836a924002f72431f73', 
                    [
                        Query.equal('userId', currentUser.$id)
                    ]
                );
                
                const comerciosData = response.documents;
                setComercios(comerciosData);
                
            } catch (error) {
                console.error("Error al obtener los comercios:", error);
                showToast('No se han encontrado comercios', 'error')
                setComercios([]);
            }
        };

        fetchComercios();
    }, []);
    

    const validateCoordinates = (lat, lng) => {
        if (lat < CUBA_LIMITS.latMin || lat > CUBA_LIMITS.latMax) {
            //throw new Error(`La latitud debe estar entre ${CUBA_LIMITS.latMin}° y ${CUBA_LIMITS.latMax}°`);
            showToast('La latitud debe estar entre 19.9° y 23.2°', 'error')
        }
        if (lng < CUBA_LIMITS.lngMin || lng > CUBA_LIMITS.lngMax) {
           // throw new Error(`La longitud debe estar entre ${CUBA_LIMITS.lngMin}° y ${CUBA_LIMITS.lngMax}°`);
           showToast('La longitud debe estar entre -74.1 y -85.0', 'error')
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

         if (name === "lat" || name === "lng") {
       
        if (!/^-?\d*\.?\d*$/.test(value) && value !== '') {
            return;
        }

       
        const newUbicacion = [...form.ubicacion];
        if (name === "lat") {
            newUbicacion[0] = value;
        } else {
            newUbicacion[1] = value;
        }

        setForm({
            ...form,
            ubicacion: newUbicacion
        });

        
        if (newUbicacion[0] && newUbicacion[1]) {
            try {
                validateCoordinates(
                    Number(newUbicacion[0]),
                    Number(newUbicacion[1])
                );
            } catch (error) {
                showToast(`${error.message}`, 'error')
            }
        }
    }  else if (name === "precio") {
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
    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        if (file) {
            
            if (!file.type.match('image.*')) {
                showToast('Por favor solo se permiten imagenes', 'error')
                return;
            }
            
          
            if (file.size > 2 * 1024 * 1024) {
                showToast('La imagen debe ser menor a 2MB', 'error')
                return;
            }
    
            setForm({
                ...form,
                foto: file
            });
            
           
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleGeolocation = () => {
    if (!navigator.geolocation) {
        showToast('Su dispositivo no soporta geolocalización', 'error')
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            try {
                validateCoordinates(position.coords.latitude, position.coords.longitude);
                setForm({
                    ...form,
                    ubicacion: [
                        position.coords.latitude.toString(),
                        position.coords.longitude.toString()
                    ]
                });
            } catch (error) {
                showToast(`${error.message}`, 'error')
            }
        },
        (err) => {
            showToast('No se pudo obtener su ubicación'+err.message, 'error')
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
                    '6836a7d200386f17c01b', // Bucket ID
                    fileId,
                    form.foto
                );
                
                fotoUrl = `https://cloud.appwrite.io/v1/storage/buckets/6836a7d200386f17c01b/files/${fileId}/view?project=6836a79400199dcfe521&mode=admin`
                ;
            }

           
            validateCoordinates(form.ubicacion[0], form.ubicacion[1]);

            // Crear documento en Appwrite
            await databases.createDocument(
                '6836a856002abc2c585d', // Database ID
                '6836a8d000394e3080c3', // Collection ID
                ID.unique(), // Document ID (auto-generado)
                {
                    producto: form.producto,
                    tipo: form.tipo,
                    precio: Number(form.precio),
                    ubicacion: [parseFloat(form.ubicacion[0]), parseFloat(form.ubicacion[1])],
                    fecha: new Date().toISOString(),
                    userId: (await account.get()).$id,
                    comercioId: form.comercioId,
                    esComercioVerificado: true,
                    esDisponible: true, 
                    fotoUrl: fotoUrl
                }
            );

            showToast('Reporte agregado con exito', 'success')
            setTimeout(() => {
            navigate("/list-report");
        }, 2000);
        } catch (error) {
            console.error("Error al agregar el reporte", error);
            showToast('Error al agregar el reporte', 'error')
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="add-report-container">
        <CustomToaster/> 
        <h1 className="add-report-title">Añadir Reporte</h1>

        <form onSubmit={handleSubmit} className="add-report-form">
             
            <div className="form-group">
                <label className="form-lable">
                    Foto del producto(opcional)
                    <input type="file"
                    accept='image/'
                    onChange={handleFileChange}
                    className='form-input-file' style={{background: "transparent", border: 'none', boxShadow: '0px 0px 2px 0px '}}/>
                </label>
                {fotoPreview && (
                    <div className="photo-preview">
                        <img src={fotoPreview} alt="VistaPrevia"
                        className='preview-image' />
                        <button
                        type='button'
                        onClick={()=>{
                            setFotoPreview(null); 
                            setForm({...form, foto: null})
                        }}
                        className='remove-photo-button'>
                            Eliminar foto
                        </button>
                    </div>
                )}
            </div>
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
                key={form.tipo}
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
                    key={form.comercioId}
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
                    value={form.ubicacion[0] || ''}
                    onChange={handleChange}
                    className="coord-input"
                    placeholder="Latitud (19.9° - 23.2°)"
                />
                <input
                    type="text"
                    inputMode="decimal"
                    name="lng"
                    value={form.ubicacion[1] || ''}
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
                disabled={!form.producto || !form.precio || !form.ubicacion[0] || !form.ubicacion[1] || isUploading}
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