/*import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, onSnapshot, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './listarReportes.css'
function ListarCommerce(){
    const [comercio, setComercio] = useState([]);
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
                if (!auth.currentUser) {
                    console.error("No hay un usuario logueado");
                    return;
                }
                const q = query(
                    collection(db, "comercio"),
                    where("usuarioId", "==", auth.currentUser.uid) // Filtrar por userId
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
                const comercios = data;
                setComercio(comercios);
            } catch (error) {
                console.error("Error al obtener los comercios:", error);
                setError("Error al eliminar los comercios.");
            }
        };
        fetchComercios();
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
                // Eliminar los reportes relacionados con el comercio
                const reportesQuery = query(
                    collection(db, "reportes"),
                    where("comercioId", "==", id)
                );
                const reportesSnapshot = await getDocs(reportesQuery);

                const batch = writeBatch(db); // Usar batch para eliminar múltiples documentos
                reportesSnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                await batch.commit(); // Confirmar la eliminación de los reportes

                // Eliminar el comercio
                await deleteDoc(doc(db, "comercio", id));
            }

            // Filtrar los comercios eliminados del estado
            setComercio((prevComercio) =>
                prevComercio.filter((comers) => !selectedIds.includes(comers.id))
            );
            setSelectedIds([]); // Limpiar los IDs seleccionados
            setMessage("Comercios y reportes relacionados eliminados correctamente.");
        } catch (error) {
            console.error("Error al eliminar los comercios y reportes:", error);
            setError("Error al eliminar los comercios y reportes.");
        }
    };

    const handleEdit = () => {
        if (selectedIds.length !== 1) {
            setMessage("Por favor, selecciona un único comercio para editar.");
            return;
        }
        const comercioId = selectedIds[0];
        navigate(`/editar-comerc/${comercioId}`); // Redirige a la página de edición
    };

    return (
        <div className="listar-reportes-container">
            {message && <p className="listar-reportes-message" style={{ color: 'green' }}>{message}</p>}
            {error && <p className="listar-reportes-message" style={{ color: 'red' }}>{error}</p>}
            {comercio.length === 0 ? (
                <p>No hay comercios disponibles. Dirigace a la lista de Comercios y seleccione uno</p>
            ) : (
                <table className="listar-reportes-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comercio.map((c) => (
                            <tr key={c.id}>
                                <td>{c.nombre}</td>
                                <td>{c.direccion}</td>
                                <td>{c.ubicacion.lat}</td>
                                <td>{c.ubicacion.lng}</td>
                                <td>
                                    <input
                                    type="checkbox"
                                    checked ={selectedIds.includes(c.id)}
                                    onChange={() => handleCheckboxChange(c.id)}
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
export default ListarCommerce;*/