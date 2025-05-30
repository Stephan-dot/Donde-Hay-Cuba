/*// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

export default function Profile() {
    const [userReports, setUserReports] = useState([]);

    useEffect(() => {
        if (auth.currentUser) {
        const fetchUserReports = async () => {
            const q = query(
            collection(db, "reportes"),
            where("userId", "==", auth.currentUser.uid)
            );
            const snapshot = await getDocs(q);
            setUserReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchUserReports();
        }
    }, [auth.currentUser]);

    return (
        <div>
        <h2>Mis Reportes</h2>
        {userReports.map(reporte => (
            <div key={reporte.id}>
            <p>{reporte.producto} - ${reporte.precio}</p>
            </div>
        ))}
        </div>
    );
}*/