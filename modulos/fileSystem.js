import { promises as fs} from 'fs';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

export async function leerArchivo(urlArchivo) {
    try {
        const content = await fs.readFile(urlArchivo, 'utf8');
        return JSON.parse(content || '[]');
    } catch (err) {
        console.error('Error al leer archivo:', err.message);
        return [];
    }
}

export async function escribirArchivo(url, data) {
    try {
        await fs.writeFile(url, JSON.stringify(data), 'utf8');
    } catch (err) {
        console.error('Error al escribir archivo:', err.message);
    }
}