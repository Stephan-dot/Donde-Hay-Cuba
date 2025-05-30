/*import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import './EditarReporte.css'

function EditarReporte() {
    const { id } = useParams(); // Obtener el ID del reporte desde la URL
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        producto: "",
        tipo: "",
        precio: "",
        ubicacion: {
            lat: "",
            lng: ""
        }
    });
    const [error, setError] = useState("");
    
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
            setMessage(""); // Limpia el error después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
    }, [message]);

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const docRef = doc(db, "reportes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setForm({
                        producto: docSnap.data().producto,
                        tipo: docSnap.data().tipo,
                        precio: docSnap.data().precio,
                        ubicacion: {
                            lat: docSnap.data().ubicacion.lat,
                            lng: docSnap.data().ubicacion.lng
                        }
                    });
                } else {
                    console.error("No se encontró el reporte.");
                    setError("No se encontró el reporte.");
                }
            } catch (error) {
                console.error("Error al cargar el reporte:", error);
                setError("Error al cargar el reporte.");
            }
        };

        fetchReporte();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "lat" || name === "lng") {
            setForm((prevForm) => ({
                ...prevForm,
                ubicacion: {
                    ...prevForm.ubicacion,
                    [name]: value
                }
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = doc(db, "reportes", id);
            await updateDoc(docRef, {
                producto: form.producto.trim(),
                tipo: form.tipo,
                precio: Number(form.precio),
                ubicacion: {
                    lat: parseFloat(form.ubicacion.lat),
                    lng: parseFloat(form.ubicacion.lng)
                }
            });

            setMessage("Reporte actualizado con éxito");

            // Retrasar la redirección para mostrar el mensaje
            setTimeout(() => {
                navigate("/list-report");
            }, 2000); // Redirige después de 2 segundos
        } catch (error) {
            console.error("Error al actualizar el reporte:", error);
            setError("Error al actualizar el reporte.");
        }
    };

    return (
        <div className="editar-reporte-container">
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
                        value={form.ubicacion.lat}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Longitud:</label>
                    <input
                        type="number"
                        name="lng"
                        value={form.ubicacion.lng}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={() => navigate("/list-report")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default EditarReporte;*/