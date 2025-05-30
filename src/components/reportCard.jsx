import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Opcional: para notificaciones bonitas
import 'react-toastify/dist/ReactToastify.css';
import { ID } from 'appwrite';

const ReporteCard = ({ reporte, onVotoSuccess }) => {
    const [hasVoted, setHasVoted] = useState(reporte.votantes?.includes(localStorage.getItem('userId')) ||false);
    const [verificaciones, setVerificaciones] = useState(reporte.verificaciones || 0);
    const [isVoting, setIsVoting] = useState(false);
    
    const handleVotar = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.warning('Debes iniciar sesión para votar');
            return;
        }

        if (hasVoted) {
            toast.warning('Ya has votado este reporte');
            return;
        }

        if (isVoting) return;

        setIsVoting(true);

        try {
            // Actualizar el reporte en Appwrite
            await databases.updateDocument(
                'dondehaycuba', // Database ID
                'reportes', // Collection ID
                reporte.$id, // Document ID
                {
                    verificaciones: verificaciones + 1,
                    votantes: [...(reporte.votantes || []), userId]
                }
            );

            // Actualizar estado local
            setHasVoted(true);
            setVerificaciones(prev => prev + 1);
            toast.success('¡Voto registrado!');
            if (onVotoSuccess) onVotoSuccess();
        } catch (error) {
            console.error("Error al votar:", error);
            toast.error(error.message);
        } finally {
            setIsVoting(false);
        }
    };


    return (
        <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        position: 'relative'
        }}>
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
        
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '12px'
        }}>
            <span><strong>Precio:</strong> ${reporte.precio}</span>
            <span><strong>Tipo:</strong> {reporte.tipo}</span>
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