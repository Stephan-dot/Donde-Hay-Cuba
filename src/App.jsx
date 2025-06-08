import './App.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import image from './image/photo_2025-05-14_13-01-29.jpg';
import { FaMapMarkedAlt, FaSearch, FaBell } from 'react-icons/fa';
import { CustomToaster} from './components/CustomToast.jsx';
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div style={{
        position: 'absolute',display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: '#f0eadc', width:"100%", zIndex: "1000"
      }}>
        <img style={{ width: "100%", height: "350px" }} src={image} alt="logo" />
      </div>
    );
  }

  const features = [
    {
      icon: <FaMapMarkedAlt size={40} />,
      title: "Explora el Mapa",
      description: "Encuentra productos y servicios cerca de ti",
      action: () => navigate('/mapa')
    },
    {
      icon: <FaSearch size={40} />,
      title: "Búsqueda Inteligente",
      description: "Busca productos específicos en toda Cuba",
      action: () => navigate('/Search')
    }
  ];

  return (
    <>
      <CustomToaster/>
      {location.pathname === '/' && (
        <main className='main'>
          <div className="hero-section">
            <h1 className='presentacion'>¿Dónde Hay? Cuba</h1>
            <p className='texto'>
              Tu plataforma comunitaria para encontrar productos y servicios en Cuba. 
              Descubre dónde encontrar lo que necesitas, comparte información útil con otros 
              y mantente actualizado sobre la disponibilidad de productos en tu área.
            </p>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Comercios</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Usuarios</span>
              </div>
            </div>
          </div>
          <div className='features-grid'>
            {features.map((feature, index) => (
              <div key={index} className="feature-card" onClick={feature.action}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="cta-section">
            <h2>¿Quieres contribuir con la comunidad?</h2>
            <p>Únete a nuestra red de colaboradores y ayuda a mantener la información actualizada</p>
            <button className="cta-button" onClick={() => navigate('/login')}>
              Registrarse Ahora
            </button>
          </div>
        </main>
      )}

    </>
  );
}

export default App;