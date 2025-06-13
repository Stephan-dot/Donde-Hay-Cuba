import React from 'react';
import './Help.css';

const Help = () => {
    return (
        <div className="help-container">
            <h1>Guía de Usuario - ¿Dónde Hay? Cuba</h1>

            <section className="help-section">
                <h2>🔍 Búsqueda de Productos</h2>
                <p>Puedes buscar productos específicos utilizando la función de búsqueda. Simplemente:</p>
                <ul>
                    <li>Haz clic en el ícono de búsqueda</li>
                    <li>Escribe el nombre del producto que necesitas</li>
                    <li>Filtra por categoría o ubicación si lo deseas</li>
                </ul>
            </section>

            <section className="help-section">
                <h2>🗺️ Mapa</h2>
                <p>El mapa te permite:</p>
                <ul>
                    <li>Ver todos los comercios registrados</li>
                    <li>Encontrar productos cerca de tu ubicación</li>
                    <li>Ver detalles de cada comercio haciendo clic en los marcadores</li>
                </ul>
            </section>

            <section className="help-section">
                <h2>📝 Gestión de Productos</h2>
                <p>Si eres un usuario registrado, puedes:</p>
                <ul>
                    <li>Agregar nuevos productos y su disponibilidad</li>
                    <li>Editar información de productos existentes</li>
                    <li>Ver listado completo de productos</li>
                    <li>Eliminar productos que ya no estén disponibles</li>
                </ul>
            </section>

            <section className="help-section">
                <h2>🏪 Gestión de Comercios</h2>
                <p>Para la gestión de comercios puedes:</p>
                <ul>
                    <li>Registrar nuevos comercios</li>
                    <li>Actualizar información de comercios existentes</li>
                    <li>Ver listado de todos los comercios</li>
                    <li>Eliminar comercios que ya no existan</li>
                </ul>
            </section>

            <section className="help-section">
                <h2>🔔 Notificaciones</h2>
                <p>Activa las notificaciones para:</p>
                <ul>
                    <li>Recibir alertas de nuevos reportes</li>
                    <li>Estar al tanto de nuevos medicamentos disponibles</li>
                    <li>Conocer actualizaciones de productos alimenticios</li>
                </ul>
            </section>

            <section className="help-section">
                <h2>👤 Cuenta de Usuario</h2>
                <p>Gestiona tu cuenta:</p>
                <ul>
                    <li>Inicia sesión para acceder a todas las funcionalidades</li>
                    <li>Cierra sesión cuando termines de usar la aplicación</li>
                </ul>
            </section>
        </div>
    );
};

export default Help; 