import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {databases, storage, account} from "../firebase-config"
import { showToast } from './CustomToast'; 
const ReporteCard = ({ reporte, onVotoSuccess }) => {
    const [hasVoted, setHasVoted] = useState(reporte.votantes?.includes(localStorage.getItem('userId')) ||false);
    const [verificaciones, setVerificaciones] = useState(reporte.verificaciones || 0);
    const [direccion, setDireccion] = useState("");
    const [nombreComercio, setNombreComercio] = useState("");
    const [isVoting, setIsVoting] = useState(false);
    const [comercios, setComercios] = useState([]);


    const handleVotar = async () => {
    setIsVoting(true);
    
    try {
        // 1. Verificar autenticación con Appwrite
        let userId;
        try {
            const user = await account.get();
            userId = user.$id;
        } catch (error) {
            showToast('Debes iniciar sesión para votar', 'error')
            setIsVoting(false);
            return;
        }

        // 2. Verificar si ya votó
        if (hasVoted) {
            showToast('Ya haz votado este reporte', 'info')
            setIsVoting(false);
            return;
        }

        // 3. Actualizar el reporte
        await databases.updateDocument(
            '6836a856002abc2c585d', // Database ID
            '6836a8d000394e3080c3', // Collection ID (asegúrate que es "reportes")
            reporte.$id,
            {
                verificaciones: verificaciones + 1,
                votantes: [...(reporte.votantes || []), userId]
            }
        );

        // 4. Actualizar estado local
        setHasVoted(true);
        setVerificaciones(prev => prev + 1);
        showToast('Voto registrado!', 'success')
        
        if (onVotoSuccess) onVotoSuccess();

    } catch (error) {
        console.error("Error al votar:", error);
        showToast(`Error al votar: ${error.message}`, 'error')
    } finally {
        setIsVoting(false);
    }
};
    
    useEffect(() => {
        const fetchComercios = async () => {
            try {
                // Obtener todos los comercios (no solo los del usuario actual)
                const response = await databases.listDocuments(
                    '6836a856002abc2c585d', // ID de la base de datos
                    '6836a924002f72431f73'  // ID de la colección de comercios
                );
                
                setComercios(response.documents);
                
                // Buscar el comercio específico para este reporte
                const comercioRelacionado = response.documents.find(
                    comercio => comercio.nombre === reporte.comercioId
                );
                
                if (comercioRelacionado) {
                    setDireccion(comercioRelacionado.direccion);
                    setNombreComercio(comercioRelacionado.nombre);
                }
                
            } catch (error) {
                console.error("Error al obtener los comercios:", error);
            }
        };

        fetchComercios();
    }, [reporte.comercioId]);

    return (
        <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        position: 'relative'
        }}
        className='container_card'>
        {/* Badge de verificación */}
        {verificaciones > 2 && (
            <span style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: '#4CAF50',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
            }}>
            ✓
            </span>
        )}

        <h3 style={{ marginTop: 0 }}>{reporte.producto}</h3>
        {reporte.fotoUrl && (
                <div style={{
                    margin: '12px 0',
                    textAlign: 'center'
                }}>
                    <img 
                        src={reporte.fotoUrl} 
                        alt={`Foto de ${reporte.producto}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            borderRadius: '10px',
                            boxShadow: '0px 0px 3px 0px #000'
                        }}
                    />
                </div>
            )}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '12px'
        }}>
            <span><strong>Precio:</strong> ${reporte.precio}</span>
            <span><strong>Tipo:</strong> {reporte.tipo}</span>
            <span><strong>Estado:</strong> {reporte.esDisponible ?  <div style={{ width: '100px', height:"20px", display:'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>Disponible<span style={{
                width: '10px',
                height: '10px', 
                background: 'green', 
                borderRadius: '50%'
            }}></span></div>: <div>No disponible</div>}</span>
        </div>
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '12px'
        }}> 
            <span><strong>Tienda:</strong> {nombreComercio || "Desconocido"}</span>
                <span><strong>Ubicación:</strong> {direccion || "No especificada"}</span>
        </div>

        {/* Sección de votación */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <button
            onClick={handleVotar}
            disabled={hasVoted || isVoting}
            style={{
                padding: '6px 12px',
                background: hasVoted ? '#e0e0e0' : '#4CAF50',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: hasVoted || isVoting ? 'not-allowed' : 'pointer',
                opacity: isVoting ? 0.7 : 1
            }}
            >
            {hasVoted ? '✔ Ya votaste' : isVoting ? 'Procesando...' : '👍 Confirmar'}
            </button>

            <span style={{ fontSize: '0.9em' }}>
            {verificaciones} verificaciones
            </span>
        </div>
        </div>
    );
};

export default ReporteCard;