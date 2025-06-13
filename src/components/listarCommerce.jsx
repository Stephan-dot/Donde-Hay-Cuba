import { useEffect, useState } from "react";
import { account, databases, storage } from '../firebase-config';
import { Query, ID } from "appwrite";
import { useNavigate } from 'react-router-dom';
import './listarReportes.css'
//import {ToastContainer, toast } from "react-toastify";
import { CustomToaster, showToast } from './CustomToast';

function ListarCommerce() {
    const [comercio, setComercio] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const fetchComercios = async () => {
            try {
                const currentUser = await account.get();
                if (!currentUser) {
                    console.error("No hay un usuario logueado");
                    showToast('No hay usuario logueado', 'error')
                    return;
                }

                const response = await databases.listDocuments(
                    '6836a856002abc2c585d',
                    '6836a924002f72431f73',
                    [Query.equal('userId', currentUser.$id)]
                );
                
                setComercio(response.documents);
                
            } catch (error) {
                console.error("Error al obtener los comercios:", error);
                showToast('Error al obtener los comercios', 'error')
                setComercio([]);
            }
        };

        fetchComercios();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds(prev => prev.includes(id) 
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
            showToast('Por favor selecciona al menos un comercio para eliminar', 'error')
            return;
        }

        try {
            const currentUser = await account.get();
            if (!currentUser) {
                showToast('Debes iniciar sesión para eliminar comercios', 'error')
                return;
            }

            // Mostrar toast de confirmación personalizado
            const confirmToastId = showToast(
                (t) => (
                    <div className="container_taost-dalete">
                        <div className="container_taost-dalete-title">
                            ¿Eliminar {selectedIds.length > 1 ? 
                            'los comercios seleccionados y todos sus reportes asociados?' : 
                            'el comercio seleccionado y todos sus reportes asociados?'}
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
                const loadingToast = showToast("Eliminando comercios y reportes...", 'info',{
                    autoClose: false
                });
                
                try {
                    // Procesar cada comercio seleccionado
                    for (const comercioId of selectedIds) {
                        try {
                            // 1. Obtener el comercio
                            const comercio = await databases.getDocument(
                                '6836a856002abc2c585d',
                                '6836a924002f72431f73',
                                comercioId
                            );
                            
                            const nombreComercio = comercio.nombre;

                            // 2. Buscar reportes por nombre de comercio
                            let allReportes = [];
                            let offset = 0;
                            const limit = 100;
                            let moreReportes = true;
                            
                            while (moreReportes) {
                                const response = await databases.listDocuments(
                                    '6836a856002abc2c585d',
                                    '6836a8d000394e3080c3',
                                    [
                                        Query.equal('comercioId', nombreComercio),
                                        Query.limit(limit),
                                        Query.offset(offset)
                                    ]
                                );
                                
                                allReportes = [...allReportes, ...response.documents];
                                offset += limit;
                                moreReportes = response.documents.length === limit;
                            }
                            
                            
                            for (const reporte of allReportes) {
                                try {
                                   
                                    if (reporte.fotoUrl) {
                                        const fileId = extractFileIdFromUrl(reporte.fotoUrl);
                                        if (fileId) {
                                            await storage.deleteFile(
                                                '6836a7d200386f17c01b', 
                                                fileId
                                            );
                                        }
                                    }
                                    
                                    
                                    await databases.deleteDocument(
                                        '6836a856002abc2c585d',
                                        '6836a8d000394e3080c3',
                                        reporte.$id
                                    );
                                } catch (error) {
                                    console.error(`Error eliminando reporte:`, error);
                                    showToast('Error eliminando reportes', 'error');
                                }
                            }

                            
                            await databases.deleteDocument(
                                '6836a856002abc2c585d',
                                '6836a924002f72431f73',
                                comercioId
                            );

                        } catch (error) {
                            console.error(`Error procesando comercio:`, error);
                            showToast('Error procesando comercio', 'error');
                        }
                    }

                    // Actualizar estado
                    setComercio(prev => prev.filter(c => !selectedIds.includes(c.$id)));
                    setSelectedIds([]);
                    
                    // Mostrar mensaje de éxito
                    showToast.dismiss(loadingToast);
                    showToast(`${selectedIds.length} comercio(s) y sus reportes eliminados correctamente`, 'success');
                    // Recargar datos
                    const updatedComercios = await databases.listDocuments(
                        '6836a856002abc2c585d',
                        '6836a924002f72431f73',
                        [Query.equal('userId', currentUser.$id)]
                    );
                    setComercio(updatedComercios.documents);

                } catch (error) {
                    console.error("Error en eliminación:", error);
                    showToast.dismiss(loadingToast);
                    showToast('Error al eliminar comercios', 'error');
                }
            };

        } catch (error) {
            console.error("Error general:", error);
            showToast('Error al procesar la solicitud', 'error');
        }
    };

    const handleEdit = () => {
        if (selectedIds.length !== 1) {
            showToast('Por favor selecciona al menos un comercio para acutalizar', 'info');
            return;
        }
        const comercioId = selectedIds[0];
        navigate(`/editar-comerc/${comercioId}`);
    };

    return (
        <div className="listar-reportes-container">
             <CustomToaster/> 
            {message && <p className="listar-reportes-message" style={{ color: 'green' }}>{message}</p>}
            {error && <p className="listar-reportes-message" style={{ color: 'red' }}>{error}</p>}
            {comercio.length === 0 ? (
                <p>No hay comercios disponibles. Diríjase a la lista de Comercios y seleccione uno</p>
            ) : (
                <table className="listar-reportes-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                            <th>Seleccionar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comercio.map((c) => (
                            <tr key={c.$id}>
                                <td>{c.nombre}</td>
                                <td>{c.direccion}</td>
                                <td>{c.ubicacion[0]}</td>
                                <td>{c.ubicacion[1]}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(c.$id)}
                                        onChange={() => handleCheckboxChange(c.$id)}
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

export default ListarCommerce;