import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { account, databases } from "../firebase-config";
import './EditarReporte.css'
//import {ToastContainer, toast } from "react-toastify";
import { CustomToaster, showToast } from './CustomToast';
//import "react-toastify/dist/ReactToastify.css";
function EditarComercio() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
        ubicacion: ["", ""] 
    });

    useEffect(() => {
        const fetchComercio = async () => {
            if (!id) return;
            
            try {
                const currentUser = await account.get();
                if (!currentUser) {
                    showToast('No hay usuario logueado', 'error')
                    return;
                }

                
                const response = await databases.getDocument(
                    '6836a856002abc2c585d', 
                    '6836a924002f72431f73',
                    id 
                );
                
                setForm({
                    nombre: response.nombre,
                    direccion: response.direccion,
                    ubicacion: response.ubicacion || ["", ""]
                });
            } catch (error) {
                console.error("Error al obtener el comercio:", error);
                showToast('Error al cargar el comrecio', 'error')
            }
        };

        fetchComercio();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "lat") {
            setForm(prev => ({
                ...prev,
                ubicacion: [value, prev.ubicacion[0]]
            }));
        } else if (name === "lng") {
            setForm(prev => ({
                ...prev,
                ubicacion: [prev.ubicacion[1], value]
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const currentUser = await account.get();
            
            await databases.updateDocument(
                '6836a856002abc2c585d', 
                '6836a924002f72431f73',
                id,
                {
                    direccion: form.direccion,
                    nombre: form.nombre,
                    ubicacion: [
                        parseFloat(form.ubicacion[0]),
                        parseFloat(form.ubicacion[1])
                    ],
                    userId: currentUser.$id,
                    verificada: form.verificada || false
                }
            );

            showToast('Comercio actualizado correctamente!', 'success')
            setTimeout(() => navigate("/list-comerc"), 2000);
        } catch (error) {
            console.error("Error al guardar:", error);
            showToast('Error al actualizar el comercio', 'error')
        }
    };

    return (
        <div className="editar-reporte-container">
            <CustomToaster/> 
            <h1 className="editar-reporte-title">Editar Comercio</h1>
            <form className="editar-reporte-form" onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Direccion:</label>
                    <input
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Latitud:</label>
                    <input
                        type="number"
                        name="lat"
                        value={form.ubicacion[0]}
                        onChange={handleChange}
                        required
                        step="any"
                    />
                </div>
                <div>
                    <label>Longitud:</label>
                    <input
                        type="number"
                        name="lng"
                        value={form.ubicacion[1]}
                        onChange={handleChange}
                        required
                        step="any"
                    />
                </div>
                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={() => navigate("/list-comerc")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default EditarComercio;