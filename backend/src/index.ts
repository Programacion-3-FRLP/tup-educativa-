import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

const firebaseConfig = {
    apiKey: 'AIzaSyCMYA1dQ6HRTPj_5UeuH02W1dwfCCYzCWo',
    authDomain: 'educactiva-a3a00.firebaseapp.com',
    projectId: 'educactiva-a3a00',
    storageBucket: 'educactiva-a3a00.firebasestorage.app',
    messagingSenderId: '712323141237',
    appId: '1:712323141237:web:444d7407f84066ebd8b23c',
    measurementId: 'G-1MS0B9Z6V5',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const itemsCol = collection(db, 'items');

// Al iniciar el proyecto se debe realizar un GET general para obtener todos los elementos posibles
async function initDB() {
    try {
        const snapshot = await getDocs(itemsCol);
        if (snapshot.empty) {
            console.log("Colección 'items' vacía. Inicializando desde randomuser.me...");
            const response = await fetch('https://randomuser.me/api/?results=10');
            const data = await response.json();
            for (const user of data.results) {
                const id = user.login?.uuid || Math.random().toString(36).substring(2, 15);
                if (!user.login) user.login = {};
                user.login.uuid = id;
                await setDoc(doc(db, 'items', id), user);
            }
            console.log("Base de datos inicializada con éxito.");
        } else {
            console.log(`Base de datos ya contiene ${snapshot.size} elementos.`);
        }
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}
initDB();

// 1. GET: obtener todos los items
app.get('/items', async (req: Request, res: Response) => {
    try {
        const snapshot = await getDocs(itemsCol);
        const results = snapshot.docs.map(doc => doc.data());
        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener items" });
    }
});

// 2. GET: obtener un único elemento por id
app.get('/items/:id', async (req: Request, res: Response) => {
    try {
        const docRef = doc(db, 'items', req.params.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        res.json(docSnap.data());
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el item" });
    }
});

// 3. POST: agregar un elemento a la lista
app.post('/items', async (req: Request, res: Response) => {
    try {
        const newItem = req.body;
        if (!newItem.login) newItem.login = {};
        if (!newItem.login.uuid) {
            newItem.login.uuid = Math.random().toString(36).substring(2, 15);
        }
        await setDoc(doc(db, 'items', newItem.login.uuid), newItem);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el item" });
    }
});

// 4. PUT: reemplazar completamente un elemento
app.put('/items/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newItem = { ...req.body };
        if (!newItem.login) newItem.login = {};
        newItem.login.uuid = id;
        
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        await setDoc(docRef, newItem);
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el item" });
    }
});

// 5. PATCH: editar solo una propiedad de un elemento
app.patch('/items/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        const updatedItem = { ...docSnap.data(), ...req.body };
        if (!updatedItem.login) updatedItem.login = {};
        updatedItem.login.uuid = id;
        
        await setDoc(docRef, updatedItem);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Error al modificar el item" });
    }
});

// 6. DELETE: eliminar un elemento
app.delete('/items/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        await deleteDoc(docRef);
        res.json({ message: "Item eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el item" });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Backend API REST corriendo en http://localhost:${port}`);
});
