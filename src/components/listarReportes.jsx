/*import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './listarReportes.css'
function ListarReportes() {
    const [selectedReporte, setSelectedReporte] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState("");
    
    useEffect(() => {
    if (message) {
        const timer = setTimeout(() => {
            setMessage(""); // Limpia el mensaje después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
    }, [message]);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                if (!auth.currentUser) {
                    console.error("No hay un usuario logueado");
                    return;
                }
                const q = query(
                    collection(db, "reportes"),
                    where("userId", "==", auth.currentUser.uid) // Filtrar por userId
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    ubicacion: {
                        lat: parseFloat(doc.data().ubicacion?.lat) || null,
                        lng: parseFloat(doc.data().ubicacion?.lng) || null
                    }
                }));
                // Encuentra el reporte seleccionado por id
                const reporte = data;
                setSelectedReporte(reporte);
            } catch (error) {
                console.error("Error al obtener los reportes:", error);
                setError("Error al eliminar los reportes.");
            }
        };
        fetchReportes();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                // Si ya está seleccionado, lo eliminamos
                return prevSelectedIds.filter((selectedId) => selectedId !== id);
            } else {
                // Si no está seleccionado, lo agregamos
                return [...prevSelectedIds, id];
            }
        });
    };

    const handleDelete = async () => {
        try {
            for (const id of selectedIds) {
                await deleteDoc(doc(db, "reportes", id));
            }
            // Filtrar los reportes eliminados del estado
            setSelectedReporte((prevReportes) =>
                prevReportes.filter((reporte) => !selectedIds.includes(reporte.id))
            );
            setSelectedIds([]); // Limpiar los IDs seleccionados
            setMessage("Reportes eliminados correctamente.");
        } catch (error) {
            console.error("Error al eliminar los reportes:", error);
        }
    };

    const handleEdit = () => {
        if (selectedIds.length !== 1) {
            setMessage("Por favor, selecciona un único reporte para editar.");
            return;
        }
        const reporteId = selectedIds[0];
        navigate(`/editar-reporte/${reporteId}`); // Redirige a la página de edición
    };

    return (
        <div className="listar-reportes-container">
            {message && <p className="listar-reportes-message" style={{ color: 'green' }}>{message}</p>}
            {error && <p className="listar-reportes-message" style={{ color: 'red' }}>{error}</p>}
            {selectedReporte.length === 0 ? (
                <p>No hay reportes disponibles.</p>
            ) : (
                <table className="listar-reportes-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedReporte.map((reporte) => (
                            <tr key={reporte.id}>
                                <td>{reporte.producto}</td>
                                <td>{reporte.tipo}</td>
                                <td>{reporte.precio}</td>
                                <td>{reporte.ubicacion.lat}</td>
                                <td>{reporte.ubicacion.lng}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(reporte.id)}
                                        onChange={() => handleCheckboxChange(reporte.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="listar-reportes-actions">
                <button onClick={handleEdit}>Editar</button>
                <button onClick={handleDelete}>Eliminar</button>
            </div>
        </div>
    );
}

export default ListarReportes;*/