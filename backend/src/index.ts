import express, { Request, Response } from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { authenticate, isAdmin } from './middlewares/auth';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

let serviceAccount;
try {
    serviceAccount = require('../../firebase-key.json');
} catch (error) {
    console.warn('Advertencia: No se encontró firebase-key.json. Asegúrate de configurarlo correctamente.');
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    admin.initializeApp();
}

const db = admin.firestore();
const itemsCol = db.collection('items');

// Al iniciar el proyecto se debe realizar un GET general para obtener todos los elementos posibles
async function initDB() {
    try {
        const snapshot = await itemsCol.get();
        if (snapshot.empty) {
            console.log("Colección 'items' vacía. Inicializando desde randomuser.me...");
            const response = await fetch('https://randomuser.me/api/?results=10');
            const data = await response.json();
            for (const user of data.results) {
                const id = user.login?.uuid || Math.random().toString(36).substring(2, 15);
                if (!user.login) user.login = {};
                user.login.uuid = id;
                await itemsCol.doc(id).set(user);
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

app.post('/set-admin', authenticate, async (req: Request, res: Response) => {
    try {
        await admin.auth().setCustomUserClaims(req.user!.uid, { role: 'admin' });
        res.json({ message: 'Rol de administrador asignado correctamente. Cierra sesión y vuelve a entrar para actualizar tu token.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar rol de administrador' });
    }
});

// 1. GET: obtener todos los items
app.get('/items', async (req: Request, res: Response) => {
    try {
        const snapshot = await itemsCol.get();
        const results = snapshot.docs.map(doc => doc.data());
        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener items" });
    }
});

// 2. GET: obtener un único elemento por id
app.get('/items/:id', async (req: Request, res: Response) => {
    try {
        const docRef = itemsCol.doc(req.params.id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        res.json(docSnap.data());
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el item" });
    }
});

// 3. POST: agregar un elemento a la lista
app.post('/items', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const newItem = req.body;
        if (!newItem.login) newItem.login = {};
        if (!newItem.login.uuid) {
            newItem.login.uuid = Math.random().toString(36).substring(2, 15);
        }
        await itemsCol.doc(newItem.login.uuid).set(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el item" });
    }
});

// 4. PUT: reemplazar completamente un elemento
app.put('/items/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newItem = { ...req.body };
        if (!newItem.login) newItem.login = {};
        newItem.login.uuid = id;

        const docRef = itemsCol.doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        await docRef.set(newItem);
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el item" });
    }
});

// 5. PATCH: editar solo una propiedad de un elemento
app.patch('/items/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const docRef = itemsCol.doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        const updatedItem = { ...docSnap.data(), ...req.body };
        if (!updatedItem.login) updatedItem.login = {};
        updatedItem.login.uuid = id;

        await docRef.set(updatedItem);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Error al modificar el item" });
    }
});

// 6. DELETE: eliminar un elemento
app.delete('/items/:id', authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const docRef = itemsCol.doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        await docRef.delete();
        res.json({ message: "Item eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el item" });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Backend API REST corriendo en http://localhost:${port}`);
});
