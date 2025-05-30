import './encabezado.css';
import { Link, useNavigate } from 'react-router-dom';
import { account} from '../firebase-config';
import { useRef, useEffect, useState } from 'react';
import Login from '../image/logo.jpg';
import { FaHome, FaMap, FaSearch, FaArrowAltCircleDown } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';
import { LuLogOut, LuLogIn } from 'react-icons/lu';
import { MdClose, MdOutlineHelp } from 'react-icons/md';

/*const guardarTokenEnFirestore = async (token) => {
    try {
        if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
        }

        await setDoc(doc(db, "users", auth.currentUser.uid), {
        fcmToken: token,
        lastUpdated: serverTimestamp()
        }, { merge: true });

        console.log("Token guardado en Firestore");
    } catch (error) {
        console.error("Error guardando token:", error);
        throw error;
    }
};
*/
const Encabezado = () => {
    //const [notificationEnabled, setNotificationEnabled] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const iconClick = useRef(null)
    const element = useRef(null)
    const iconClick1 = useRef(null)
    const element1 = useRef(null)
    const menuCheckboxRef = useRef(null);
        const closeMenu = () => {
        if (menuCheckboxRef.current) {
            menuCheckboxRef.current.checked = false;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
                // Opcional: redirige al login si no está autenticado
                // navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleClick = ()=>{
        if(element.current){
            console.log("Elemento en el dom"); 
            if( element.current.style.display != 'flex'){
                element.current.style.display = 'flex';
            }else{
                element.current.style.display = 'none';
            }
        }else{
            console.log("Elemento no cargado"); 
        }
    }

    const handleClick1 = ()=>{
        if(element1.current){
            console.log("Elemento en el dom"); 
            if( element1.current.style.display != 'flex'){
                element1.current.style.display = 'flex';
            }else{
                element1.current.style.display = 'none';
            }
        }else{
            console.log("Elemento no cargado"); 
        }
    }
        const handleSignOut = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
  
     return (
        <header>
            {user ? (
                <nav className="navbar">
                    <div className="navbar_encabezado">
                        <img src={Login} alt="logo" className='logo'/>
                        <h1 className="navbar_titulo">Donde hay? Cuba</h1>
                    </div>
                    <div className="navbar_acces">
                        <Link to={"/"}><FaHome size={24} color="#2870c9"/></Link>
                        <label onClick={handleSignOut} className='nav_button'>
                            <LuLogOut size={24} color="#2870c9"/>
                        </label>
                        <label htmlFor="menu">
                            <CiMenuKebab size={24} color="#2870c9"/>
                        </label> 
                        <input type="checkbox" id="menu" ref={menuCheckboxRef}/>
                        <div className='container_oculto'>
                            <ul className="ul_oculta">
                                <label className="cerrar" htmlFor="menu">
                                    <MdClose size={30} color="var(--azul-color)"/>
                                </label>
                                <li className="ul_oculta-item">
                                    <Link to="/mapa" onClick={closeMenu}>
                                        <label><FaMap size={24} color="var(--azul-color)"/> Mapa</label>
                                    </Link>
                                </li>
                                <li className="ul_oculta-item">
                                    <Link to="/Search" onClick={closeMenu}>
                                        <label><FaSearch size={24} color="var(--azul-color)"/> Buscar Producto</label>
                                    </Link>
                                </li>
                                <section name="" id="" className='nav_select'>
                                    <label htmlFor="" ref={iconClick} onClick={handleClick} style={{fontSize:"1.5rem"}}>
                                        <FaArrowAltCircleDown size={24} color="var(--azul-color)"/> Gestionar Producto
                                    </label>
                                    <section className='nav_desplegable' ref={element}>
                                        <Link to="/add-reportes" onClick={closeMenu}>
                                            <label value="">Agregar Producto</label>    
                                        </Link>
                                        <Link to="/list-report" onClick={closeMenu}>
                                            <label value="">Editar Producto</label>
                                        </Link>
                                        <Link to="/list-report" onClick={closeMenu}>
                                            <label value="">Listar Producto</label>
                                        </Link>
                                        <Link to="/list-report" onClick={closeMenu}>
                                            <label value="">Eliminar Producto</label>
                                        </Link>
                                    </section>
                                </section>
                                <section name="" id="" className='nav_select'>
                                    <label htmlFor="" ref={iconClick1} onClick={handleClick1} style={{fontSize:"1.5rem"}}>
                                        <FaArrowAltCircleDown size={24} color="var(--azul-color)"/> Gestionar Comercio
                                    </label>
                                    <section className='nav_desplegable' ref={element1}>
                                        <Link to="/add-comerce" onClick={closeMenu}>
                                            <label value="">Agregar Comercio</label>    
                                        </Link>
                                        <Link to="/editar-comerc/:id" onClick={closeMenu}>
                                            <label value="">Editar Comercio</label>
                                        </Link>
                                        <Link to="/list-comerc" onClick={closeMenu}>
                                            <label value="">Listar Comercio</label>
                                        </Link>
                                        <Link to="/list-comerc" onClick={closeMenu}>
                                            <label value="">Eliminar Comercio</label>
                                        </Link>
                                    </section>
                                </section>
                                <li className="ul_oculta-item">
                                    <Link to="/help" onClick={closeMenu}>
                                        <label><MdOutlineHelp color="var(--azul-color)"/> Ayuda</label>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className="navbar login" style={{ justifyContent: 'end' }}>
                    <div className="navbar_encabezado">
                        <img src={Login} alt="logo" className='logo'/>
                        <h1 className="navbar_titulo">Donde hay? Cuba</h1>
                    </div>
                    <div className="navbar_acces">
                        <Link to={"/"}><FaHome size={24} color="#2870c9"/></Link>
                        <Link to="/login"><LuLogIn size={24} color="#2870c9"/></Link>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Encabezado;
