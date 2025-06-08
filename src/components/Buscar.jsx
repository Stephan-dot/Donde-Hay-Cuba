import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './Buscar.css';
import { databases } from "../firebase-config";
import {Query} from 'appwrite'

function Buscar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);


    const searchReportes = async () => {
        setLoading(true);
        try {
            let queries = [];
            
            if (activeFilter !== "all") {
                queries.push(Query.equal('tipo', activeFilter));
            }

            const response = await databases.listDocuments(
                '6836a856002abc2c585d',
                '6836a8d000394e3080c3',
                queries
            );
            const filtered = response.documents.filter(item =>
                item.producto.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            setResults(filtered.map(doc => ({
                id: doc.$id,
                ...doc,
                ubicacion: [doc.ubicacion[0], doc.ubicacion[1]] 
            })));
        } catch (error) {
            showToast('Error al buscar reportes', 'error')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchTerm.length > 0 || activeFilter !== "all") {
                searchReportes();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, activeFilter]);

    return (
        <div className="search-container">
            <div className="search-header">
                {/* Barra de búsqueda */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar medicamentos o alimentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Filtros rápidos */}
                <div className="filters">
                    <button
                        className={activeFilter === "all" ? "active-filter-button" : "filter-button"}
                        onClick={() => setActiveFilter("all")}
                    >
                        Todos
                    </button>
                    <button
                        className={activeFilter === "medicamento" ? "active-filter-button" : "filter-button"}
                        onClick={() => setActiveFilter("medicamento")}
                    >
                        💊 Medicamentos
                    </button>
                    <button
                        className={activeFilter === "alimento" ? "active-filter-button" : "filter-button"}
                        onClick={() => setActiveFilter("alimento")}
                    >
                        🍎 Alimentos
                    </button>
                </div>
            </div>

            {/* Resultados */}
            {loading ? (
                <p className="loading-text">Buscando...</p>
            ) : (
                <div className="results">
                    {results.map(item => (
                        <div
                            key={item.id}
                            className="result-card"
                            onClick={() => navigate(`/mapa/${item.id}`)}
                        >
                            <div className="result-left">
                                <span className={item.tipo === "medicamento" ? "med-badge" : "food-badge"}>
                                    {item.tipo === "medicamento" ? '💊' : '🍎'}
                                </span>
                            </div>
                            <div className="result-center">
                                <h3 className="result-title">{item.producto}</h3>
                                <p className="result-price">${item.precio} CUP</p>
                                {item.fecha && (
                                    <p className="result-date">
                                        {new Date(item.fecha).toLocaleDateString() }                                   

                                    </p>
                                )}
                            </div>
                            <div className="result-right">
                                <FaMapMarkerAlt className="location-icon" />
                                <span className="result-distance">
                                    {item.ubicacion[0]}, {item.ubicacion[1]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Buscar;