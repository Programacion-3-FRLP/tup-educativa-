import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos simulada en memoria local
interface Item {
    id: number;
    name: string;
    description: string;
    active: boolean;
}

let items: Item[] = [
    { id: 1, name: "Elemento 1", description: "Descripción del elemento 1", active: true },
    { id: 2, name: "Elemento 2", description: "Descripción del elemento 2", active: false }
];

let nextId = 3;



// 1. GET: obtener todos los items
app.get('/items', (req: Request, res: Response) => {
    res.json(items);
});

// 2. GET: obtener un único elemento por id
app.get('/items/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    res.json(item);
});

// 3. POST: agregar un elemento a la lista
app.post('/items', (req: Request, res: Response) => {
    const { name, description, active } = req.body;
    const newItem: Item = {
        id: nextId++,
        name: name || "Sin nombre",
        description: description || "Sin descripción",
        active: active !== undefined ? active : true
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// 4. PUT: reemplazar completamente un elemento
app.put('/items/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    
    const { name, description, active } = req.body;
    items[index] = { 
        id, 
        name: name || "", 
        description: description || "", 
        active: active !== undefined ? active : true 
    };
    res.json(items[index]);
});

// 5. PATCH: editar solo una propiedad de un elemento
app.patch('/items/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Item no encontrado" });
    }
    
    // Se actualizan solo las propiedades enviadas en el body
    const updates = req.body;
    items[index] = { ...items[index], ...updates };
    res.json(items[index]);
});

// 6. DELETE: eliminar un elemento
app.delete('/items/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
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
