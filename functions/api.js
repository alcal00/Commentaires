/**
 * Intéragit avec une API JSON
 * @param {string} url 
 * @param {RequestInit & {json?: object}} options 
 */
export async function fetchJSON(url, options = {}){
    const headers = {Accept : 'application/json', ...options.headers}
    if(options.json){
       options.body = JSON.stringify(options.json)
        // string to json
       headers['Content-Type'] = 'application/json'// pour dire au serveur qu'on envoie du json
    }
    const r = await fetch(url, {...options, headers})
        if(!r.ok){
            throw new Error ('Erreur Serveur', {cause: r})
        }
        return await r.json()
}