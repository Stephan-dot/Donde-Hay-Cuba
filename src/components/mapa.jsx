import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import { databases } from '../firebase-config';
import  ReportCard  from './reportCard';
import { Geolocation } from '@capacitor/geolocation';
import { CustomToaster, showToast } from './CustomToast';
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
    const { id } = useParams(); 
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [comercios, setComercios] = useState([]);
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
                
                setUserLocation([
                    position.coords.latitude,
                    position.coords.longitude
                ]);
            } catch (error) {
                console.error('Error al obtener ubicación:', error);
                showToast('No se pudo obtener su ubicacion. Active la ubicación', 'error')
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            setUserLocation([
                                pos.coords.latitude,
                                pos.coords.longitude
                            ]);
                            setLocationError(null);
                        },
                        (err) => {
                            console.warn("No se pudo obtener la ubicación:", err.message);
                            showToast('No se pudo obtenr su ubicación. Verifique los permisos de la app', 'error')
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
                    '6836a856002abc2c585d', 
                    '6836a924002f72431f73' 
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
                    '6836a856002abc2c585d', 
                    '6836a8d000394e3080c3' 
                );

                const data = response.documents.map(doc => ({
                    $id: doc.$id,
                    ...doc,
                    ubicacion: [parseFloat(doc.ubicacion[0]),parseFloat(doc.ubicacion[1])]
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
        <div style={{height:"100vh", width:"100%", display:"flex",zIndex:"0", flexDirection:"column", alignItems:"end", justifyContent:"end"}}>
            
            <div className="home" style={{ height: '90vh', width: '100%', zIndex:"1"}}>
                
                {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
                <MapContainer
                    center={selectedReporte ? [selectedReporte.ubicacion[0], selectedReporte.ubicacion[1]] : [23.1136, -82.3666]}
                    zoom={selectedReporte ? 15 : 13}
                    style={{ height: "100%", width: "100%" , zIndex:"1"}}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {selectedReporte && (
                        <Marker
                            position={[selectedReporte.ubicacion[0], selectedReporte.ubicacion[1]]}
                        >
                            <Popup>
                                
                                <ReportCard 
                                reporte={selectedReporte}
                                />
                                
                            </Popup>
                        </Marker>
                    )}
                    {userLocation && (
                        <Marker position={[userLocation[0], userLocation[1]]} icon={userIcon} >
                        <Popup>
                            <b>¡Estás aquí!</b>
                        </Popup>
                        </Marker>
                    )}
                    <CustomToaster/>
                </MapContainer>
            </div>
        </div>
    );
}

export default Mapa;