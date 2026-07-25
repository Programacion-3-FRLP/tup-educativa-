import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos simulada en memoria local
let items: any[] = [];

// Al iniciar el proyecto se debe realizar un GET general para obtener todos los elementos posibles
async function initDB() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=10');
        const data = await response.json();
        items = data.results;
        console.log(`Base de datos inicializada con ${items.length} elementos desde randomuser.me`);
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}
initDB();

// 1. GET: obtener todos los items
app.get('/items', (req: Request, res: Response) => {
    res.json({ results: items });
});

// 2. GET: obtener un único elemento por id
app.get('/items/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const item = items.find(i => i.login.uuid === id);
    if (!item) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    res.json(item);
});

// 3. POST: agregar un elemento a la lista
app.post('/items', (req: Request, res: Response) => {
    const newItem = req.body;
    // Si no tiene uuid, le asignamos uno aleatorio simulado
    if (!newItem.login) newItem.login = {};
    if (!newItem.login.uuid) {
        newItem.login.uuid = Math.random().toString(36).substring(2, 15);
    }
    items.push(newItem);
    res.status(201).json(newItem);
});

// 4. PUT: reemplazar completamente un elemento
app.put('/items/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = items.findIndex(i => i.login.uuid === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    
    items[index] = { ...req.body };
    // Asegurar que el id no cambie
    if (!items[index].login) items[index].login = {};
    items[index].login.uuid = id;
    
    res.json(items[index]);
});

// 5. PATCH: editar solo una propiedad de un elemento
app.patch('/items/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = items.findIndex(i => i.login.uuid === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    
    items[index] = { ...items[index], ...req.body };
    // Asegurar que el id no cambie
    if (!items[index].login) items[index].login = {};
    items[index].login.uuid = id;
    
    res.json(items[index]);
});

// 6. DELETE: eliminar un elemento
app.delete('/items/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = items.findIndex(i => i.login.uuid === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    
    items.splice(index, 1);
    res.json({ message: "Item eliminado exitosamente" });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Backend API REST corriendo en http://localhost:${port}`);
});
