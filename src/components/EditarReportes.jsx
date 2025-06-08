import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { account, databases, storage } from "../firebase-config";
import './EditarReporte.css'
//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ID } from "appwrite";
import { CustomToaster, showToast } from './CustomToast';
function EditarReporte() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        producto: "",
        tipo: "",
        precio: "",
        ubicacion: ["", ""],
        esDisponible: true,
        fotoUrl: ""
    });
    const [error, setError] = useState("");
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(""); 
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    
    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const currentUser = await account.get();
                if (!currentUser) {
                    showToast('No hay usuario logeado', 'error')
                    navigate("/login");
                    return;
                }

                const response = await databases.getDocument(
                    '6836a856002abc2c585d', 
                    '6836a8d000394e3080c3', 
                    id
                );

                if (response) {
                    setForm({
                        producto: response.producto,
                        tipo: response.tipo,
                        precio: response.precio,
                        ubicacion: response.ubicacion,
                        esDisponible: response.esDisponible,
                        fotoUrl: response.fotoUrl
                    });
                } else {
                    setError("No se encontró el reporte.");
                    showToast('No se encontraron reportes', 'error')
                }
            } catch (error) {
                console.error("Error al cargar el reporte:", error);
                setError("Error al cargar el reporte.");
                showToast('Error al cargar el reporte', 'error')
            }
        };

        fetchReporte();
    }, [id, navigate]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "lat" || name === "lng") {
            const index = name === "lat" ? 0 : 1;
            setForm(prev => ({
                ...prev,
                ubicacion: prev.ubicacion.map((coord, i) => i === index ? value : coord)
            }));
        } else if (name === "esDisponible") {
            setForm(prev => ({
                ...prev,
                [name]: e.target.checked
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

     const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNuevaImagen(file);
            
           
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    const extractFileIdFromUrl = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const filesIndex = pathParts.indexOf('files');
            if (filesIndex !== -1 && filesIndex + 1 < pathParts.length) {
                return pathParts[filesIndex + 1];
            }
            return null;
        } catch (e) {
            console.error("Error parsing URL:", e);
            return null;
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const currentUser = await account.get();
        if (!currentUser) {
            showToast('No hay usuario logueado', 'error')
            return;
        }

        let nuevaFotoUrl = form.fotoUrl;
        let fileIdToDelete = null;

        if (nuevaImagen) {
            // Eliminar imagen anterior si existe
            if (form.fotoUrl) {
                fileIdToDelete = extractFileIdFromUrl(form.fotoUrl);
            }

            // Subir nueva imagen
            const fileUploadResponse = await storage.createFile(
                '6836a7d200386f17c01b', 
                ID.unique(),
                nuevaImagen
            );

            // Obtener URL pública (usando el mismo formato que en AddReport)
            nuevaFotoUrl = `https://cloud.appwrite.io/v1/storage/buckets/6836a7d200386f17c01b/files/${fileUploadResponse.$id}/view?project=6836a79400199dcfe521&mode=admin`;
            
            // Actualizar estado inmediatamente
            setForm(prev => ({
                ...prev,
                fotoUrl: nuevaFotoUrl
            }));
        }

        // Actualizar documento
        await databases.updateDocument(
            '6836a856002abc2c585d',
            '6836a8d000394e3080c3',
            id,
            {
                producto: form.producto.trim(),
                tipo: form.tipo,
                precio: Number(form.precio),
                ubicacion: form.ubicacion.map(coord => parseFloat(coord)),
                esDisponible: form.esDisponible,
                fecha: new Date().toISOString(),
                fotoUrl: nuevaFotoUrl
            }
        );

        // Eliminar imagen anterior después de actualizar (solo si todo salió bien)
        if (fileIdToDelete && nuevaImagen) {
            try {
                await storage.deleteFile(
                    '6836a7d200386f17c01b',
                    fileIdToDelete
                );
            } catch (error) {
                console.error("Error eliminando imagen anterior:", error);
                showToast('Error al eliminar la imagen anterior', 'error')
            }
        }

        
        showToast('Reporte actualizado correctamente!', 'success')
        setPreviewUrl("");
        setNuevaImagen(null);

        setTimeout(() => {
            navigate("/list-report");
        }, 2000);
    } catch (error) {
        console.error("Error al actualizar el reporte:", error);
        setError("Error al actualizar el reporte: " + error.message);
        showToast('Error al actualizar el reporte', 'error')
    }
};

    return (
        <div className="editar-reporte-container">
            <CustomToaster/> 
            {message && <p className="editar-reporte-message success">{message}</p>}
            <h1 className="editar-reporte-title">Editar Reporte</h1>
            {error && <p className="editar-reporte-message error">{error}</p>}
            <form className="editar-reporte-form" onSubmit={handleSubmit}>
                <div>
                    <label>Producto:</label>
                    <input
                        type="text"
                        name="producto"
                        value={form.producto}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Tipo:</label>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="medicamento">Medicamento</option>
                        <option value="alimento">Alimento</option>
                    </select>
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Latitud:</label>
                    <input
                        type="number"
                        name="lat"
                        value={form.ubicacion[0] || ""}
                        onChange={(e) => {
                            setForm(prev => ({
                                ...prev,
                                ubicacion: [e.target.value, prev.ubicacion[1]]
                            }));
                        }}
                        required
                        step="any"
                    />
                </div>
                <div>
                    <label>Longitud:</label>
                    <input
                        type="number"
                        name="lng"
                        value={form.ubicacion[1] || ""}
                        onChange={(e) => {
                            setForm(prev => ({
                                ...prev,
                                ubicacion: [prev.ubicacion[0], e.target.value]
                            }));
                        }}
                        required
                        step="any"
                    />
                </div>
                <div>
                    <label>Disponible:</label>
                    <input
                        type="checkbox"
                        name="esDisponible"
                        checked={form.esDisponible}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Imagen:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {(previewUrl || form.fotoUrl) && (
                        <div className="imagen-actual">
                            <p>Vista previa:</p>
                            <img 
                                src={previewUrl || `${form.fotoUrl}&t=${Date.now()}`} 
                                alt="Previsualización" 
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                key={form.fotoUrl} // Forzar recarga cuando cambia la URL
                            />
                        </div>
                    )}
                </div>
                <div className="editar-reporte-buttons">
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => navigate("/list-report")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditarReporte;