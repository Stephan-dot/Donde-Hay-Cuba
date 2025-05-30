/*import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import './EditarReporte.css'
function EditarComercio(){
const { id } = useParams(); // Obtener el ID del reporte desde la URL
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
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
        const fetchComercios = async () => {
            try {
                const docRef = doc(db, "comercio", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setForm({
                        nombre: docSnap.data().nombre,
                        direccion: docSnap.data().direccion,
                        ubicacion: {
                            lat: docSnap.data().ubicacion.lat,
                            lng: docSnap.data().ubicacion.lng
                        }
                    });
                } else {
                    console.error("No se encontró el comercio.");
                    setError("No se encontró el comercio.");
                }
            } catch (error) {
                console.error("Error al cargar el comercio:", error);
                setError("Error al cargar el comercio.");
            }
        };

        fetchComercios();
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
            const docRef = doc(db, "comercio", id);
            await updateDoc(docRef, {
                nombre: form.nombre.trim(),
                direccion: form.direccion,
                ubicacion: {
                    lat: parseFloat(form.ubicacion.lat),
                    lng: parseFloat(form.ubicacion.lng)
                }
            });

            setMessage("Comercio actualizado con éxito");

            // Retrasar la redirección para mostrar el mensaje
            setTimeout(() => {
                navigate("/list-comerc");
            }, 2000); // Redirige después de 2 segundos
        } catch (error) {
            console.error("Error al actualizar el comercio:", error);
            setError("Error al actualizar el comercio.");
        }
    };

    return (
        <div className="editar-reporte-container">
            {message && <p className="editar-reporte-message success" style={{ color: 'green' }}>{message}</p>}
            <h1 className="editar-reporte-title">Editar Reporte</h1>
            {error && <p className="editar-reporte-message error" style={{ color: "red" }}>{error}</p>}
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
                <button type="button" onClick={() => navigate("/list-comerc")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default EditarComercio; */