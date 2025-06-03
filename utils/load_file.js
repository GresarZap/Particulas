export async function loadFile(path) {
    try {

        let url = buildUrl(path);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al cargar el archivo: ' + url);
        }
        
        return response.text();  // Devuelve el contenido del archivo como texto
    } catch (error) {
        console.error('Error al cargar el archivo: ', error);  // Muestra el error en consola
    }
}


function buildUrl(path) {
    let isLocal = window.location.hostname === '127.0.0.1';
    const baseUrl = window.location.origin + (isLocal?'':'/Sprites/');
    console.log(`Base URL: ${baseUrl}, Path: ${path}`);
    return baseUrl + path;
}