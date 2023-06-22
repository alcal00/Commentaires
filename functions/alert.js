/**
 * Renvoie un élément HTML
 * @param {string} message 
 * @return {HTMLElement}
 */
export function alertElement(message){
    /** @type {HTMLElement} */
    const el = document.querySelector('#alert').content.firstElementChild.cloneNode(true) // Clone sur le premier walad pour pas avoir un doc#fragment et avoir un element
    el.querySelector('.js-text').innerText = message
    el.querySelector('button').addEventListener('click', e =>{
        e.preventDefault()
        el.remove()
        el.dispatchEvent(new CustomEvent('close'))
    })
    return el // pour qu'il puisse etre utilisé
}