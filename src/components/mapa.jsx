import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import { databases } from '../firebase-config';
import Encabezado from './encabezado';
import  ReportCard  from './reportCard';
import { ToastContainer, toast } from 'react-toastify';
import { Geolocation } from '@capacitor/geolocation';

// Solución para iconos rotos en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

function Mapa() {
    const { id } = useParams(); // Obtiene el id del producto desde la URL
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [comercios, setComercios] = useState([]);
    const [message, setMessage] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    
    
     useEffect(() => {
        const getCurrentPosition = async () => {
            try {
                const permissions = await Geolocation.checkPermissions();
                if (permissions.location === 'denied') {
                    const request = await Geolocation.requestPermissions();
                    if (request.location !== 'granted') {
                        throw new Error('Permiso de ubicación denegado');
                    }
                }
                
                const position = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000
                });
                
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            } catch (error) {
                console.error('Error al obtener ubicación:', error);
                setLocationError('No se pudo obtener tu ubicación. Active la ubicacion');
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            setUserLocation({
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude,
                            });
                            setLocationError(null);
                        },
                        (err) => {
                            console.warn("No se pudo obtener la ubicación:", err.message);
                            setLocationError("No se pudo obtener tu ubicación. Verifica los permisos de la app.");
                        }
                    );
                }
            }
        };
        
        getCurrentPosition();
    }, []);
   useEffect(() => {
        const fetchComercios = async () => {
            try {
                const response = await databases.listDocuments(
                    '6836a856002abc2c585d', // Database ID
                    '6836a924002f72431f73' // Collection ID
                );
                setComercios(response.documents);
            } catch (error) {
                console.error("Error al obtener los comercios:", error);
            }
        };

        fetchComercios();
    }, []);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await databases.listDocuments(
                    'dondehaycuba', // Database ID
                    'reportes' // Collection ID
                );

                const data = response.documents.map(doc => ({
                    $id: doc.$id,
                    ...doc,
                    ubicacion: {
                        lat: parseFloat(doc.ubicacion?.lat) || null,
                        lng: parseFloat(doc.ubicacion?.lng) || null
                    }
                }));

                const reporte = data.find(r => r.$id === id);
                setSelectedReporte(reporte);
            } catch (error) {
                console.error("Error al obtener los reportes:", error);
            }
        };
        
        if (id) fetchReportes();
    }, [id]);


    return (
        <div style={{height:"100vh", width:"100%", display:"flex",zIndex:"0", flexDirection:"column", alignContent:"center", justifyContent:"space-evenly"}}>
            <Encabezado/>
            <div className="home" style={{ height: '70vh', width: '100%', zIndex:"1"}}>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
                <MapContainer
                    center={selectedReporte ? [selectedReporte.ubicacion.lat, selectedReporte.ubicacion.lng] : [23.1136, -82.3666]}
                    zoom={selectedReporte ? 15 : 13}
                    style={{ height: "100%", width: "100%" , zIndex:"1"}}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {selectedReporte && (
                        <Marker
                            position={[selectedReporte.ubicacion.lat, selectedReporte.ubicacion.lng]}
                        >
                            <Popup>
                                
                                <ReportCard 
                                reporte={selectedReporte}
                                />
                                
                            </Popup>
                        </Marker>
                    )}
                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} >
                        <Popup>
                            <b>¡Estás aquí!</b>
                        </Popup>
                        </Marker>
                    )}
                    <ToastContainer/>
                </MapContainer>
            </div>
        </div>
    );
}

export default Mapa;