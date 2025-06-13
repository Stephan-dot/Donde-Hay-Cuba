import { useEffect, useState } from "react";
import { account, databases, storage } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './listarReportes.css'
import {ToastContainer, toast } from "react-toastify";
import { Query } from "appwrite";
import { CustomToaster, showToast } from './CustomToast';

function ListarReportes() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchReportes = async () => {
        try {
            const currentUser = await account.get();
            if (!currentUser) {
                console.error("No hay un usuario logueado");
                showToast('No hay usuario logueado', 'error')
                return;
            }

            const response = await databases.listDocuments(
                '6836a856002abc2c585d',
                '6836a8d000394e3080c3',
                [Query.equal('userId', currentUser.$id)]
            );
            
            setReportes(response.documents);
            
        } catch (error) {
            console.error("Error al obtener los reportes:", error);
            showToast('Error al obtener los reportes', 'error')
            setReportes([]);
        }
    };

    useEffect(() => {
        fetchReportes();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(selectedId => selectedId !== id) 
                : [...prev, id]
        );
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

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            showToast('Por seleccione al menos un reporte para eliminar', 'info')
            return;
        }
        
        try {
            const currentUser = await account.get();
            if (!currentUser) {
                showToast('Debes iniciar sesion para eliminar reportes', 'error')
                return;
            }

            const confirmToastId = showToast(
                (t) => (
                    <div className="container_taost-dalete">
                        <div className="container_taost-dalete-title">
                            ¿Eliminar {selectedIds.length > 1 ? 
                            'los reportes seleccionados y sus imágenes?' : 
                            'el reporte seleccionado y su imagen?'}
                        </div>
                        <div className="container_taost-dalete-cuerpo">
                            <button
                                onClick={async () => {
                                    showToast.dismiss(t.id);
                                    await performDeletion();
                                }}
                                className="taost_btn-confirmar">
                                Confirmar
                            </button>
                            <button
                                onClick={() => showToast.dismiss(t.id)}
                                className="taost_btn-eliminar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                ),
                { duration: 10000 }
            );

            const performDeletion = async () => {
                const reportesAEliminar = reportes.filter(reporte => 
                    selectedIds.includes(reporte.$id)
                );

                for (const reporte of reportesAEliminar) {
                    try {
                       
                        const fileId = extractFileIdFromUrl(reporte.fotoUrl);
                        
                        
                        if (fileId) {
                            await storage.deleteFile(
                                '6836a7d200386f17c01b', 
                                fileId
                            );
                        }
                        
                        
                        await databases.deleteDocument(
                            '6836a856002abc2c585d',
                            '6836a8d000394e3080c3',
                            reporte.$id
                        );
                    } catch (error) {
                        console.error(`Error eliminando reporte ${reporte.$id}:`, error);
                        showToast(`Error eliminando reporte ${reporte.$id}: ${error.message}`, 'error');
                    }
                }
                
                
                setReportes(prev => 
                    prev.filter(reporte => !selectedIds.includes(reporte.$id))
                );
                setSelectedIds([]);
                showToast('Reportes eliminados correctamente', 'success')
            }
             
        } catch (error) {
            console.error("Error en eliminación:", error);
            showToast('Error al elimiar los reportes', 'error')
        }
    };

    const handleEdit = () => {
        if (selectedIds.length !== 1) {
            showToast('Profavor selecciona al menos un reporte para editar', 'info')
            return;
        }
        const reporteId = selectedIds[0];
        navigate(`/editar-reporte/${reporteId}`);
    };

    return (
        <div className="listar-reportes-container">
            <CustomToaster/>
            {error && <p className="listar-reportes-message" style={{ color: 'red' }}>{error}</p>}
            {reportes.length === 0 ? (
                <p>No hay reportes disponibles.</p>
            ) : (
                <>
                    <table className="listar-reportes-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Latitud</th>
                                <th>Longitud</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map((reporte) => (
                                <tr key={reporte.$id}>
                                    <td>{reporte.producto}</td>
                                    <td>{reporte.tipo}</td>
                                    <td>{reporte.precio}</td>
                                    <td>{reporte.ubicacion?.[0]}</td>
                                    <td>{reporte.ubicacion?.[1]}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(reporte.$id)}
                                            onChange={() => handleCheckboxChange(reporte.$id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="listar-reportes-actions">
                        <button onClick={handleEdit}>Editar</button>
                        <button onClick={handleDelete}>Eliminar</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ListarReportes;