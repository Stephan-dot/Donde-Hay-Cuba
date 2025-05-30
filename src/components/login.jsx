import { useState, useEffect } from "react";
import './login.css'; 
import './Register.css';
import { useNavigate } from "react-router-dom";
import { account } from "../firebase-config"
function Login() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLoginClick = ()=> setIsLoggedIn(!isLoggedIn); 

    const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
        setError("Email y contraseña son requeridos");
        return;
    }

    try {
        // Primero, intenta crear la sesión
        await account.createEmailPasswordSession(email, password);  // Usa `createEmailSession` en lugar de `createSession`
        setMessage('Autenticación exitosa');
        setTimeout(() => navigate("/"), 3000);
    } catch (error) {
        setError(getErrorMessage(error));
    }
};

    const handleRegister = async (e) => {
    e.preventDefault();
    try {
        await account.create(
            'unique',  // ID único generado automáticamente
            email,       // Email del usuario
            password     // Contraseña (mínimo 8 caracteres)
        );
        setMessage('¡Registro exitoso! Inicia sesión.');
    } catch (error) {
        setError(getErrorMessage(error.message)); // Muestra el error real
    }
};
    
    const getErrorMessage = (error) => {
    switch (error.type) {
        case 'user_invalid_credentials':
            return "Email o contraseña incorrectos";
        case 'user_not_found':
            return "Usuario no registrado";
        case 'general_argument_invalid':
            return "Datos inválidos";
        default:
            console.error("Error detallado:", error); // Depuración
            return "Error al iniciar sesión. Intenta nuevamente.";
    }
};

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    return (
        <div className="container_from-login">
        
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!isLoggedIn ? (
                <form onSubmit={handleLogin} className="from_Login">
                <div>
                    <label htmlFor="">
                        Email:
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        placeholder="tu@email.com"
                        disabled={isLoggedIn}
                    />
                </div>
                <div>
                    <label htmlFor="">Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="Contraseña"
                        disabled={isLoggedIn}
                    />
                </div>
                
                <button type="submit" disabled={isLoggedIn}>
                    {isLoggedIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <label 
                    to="/register" 
                    style = {{color: "blue"}}
                    onClick={handleLoginClick}
                >
                    No tienes una cuenta? Registrate
                </label>
            </form>
            ): (
                <form onSubmit={handleRegister} className="from_register">
                
                <div>
                    <label htmlFor="">Email :</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }} 
                        placeholder="tu@email.com" 
                        required 
                        
                    />
                </div>
                <div>
                    <label htmlFor="">Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }} 
                        placeholder="Contraseña" 
                        required 
                        
                    />
                </div>
                <button type="submit">
                   Registrarse
                </button>
                <label 
                    to="/register" 
                    style = {{color: "blue"}}
                    onClick={handleLoginClick}
                >
                    Ya tienes una cuenta? Logeate
                </label>
            </form>
            )}
        </div>
    );
}

export default Login;