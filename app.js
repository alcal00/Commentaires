import { fetchJSON } from "./functions/api.js"
import { alertElement } from "./functions/alert.js"

class InfinitePagination {

    /**@type {string} */
    #endpoint
    /**@type {HTMLTemplateElement} */
    #template
    /**@type {HTMLElement} */
    #target
    /**@type {string} */
    #elements
    /**@type {IntersectionObserver} */
    #observer
    /**@type {boolean} */
    #loading = false
    /**@type {number} */
    #page = 1
    /**@type {HTMLElement} */
    #loader

    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.#loader = element
        this.#endpoint = element.dataset.endpoint
        this.#template = document.querySelector(element.dataset.template)
        this.#target = document.querySelector(element.dataset.target)
        this.#elements = JSON.parse(element.dataset.elements) // json to string
        this.#observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    this.#loadMore()
                }
            }
        })
        this.#observer.observe(element)
    }

    async #loadMore() {
        if (this.#loading) {
            return
        }
        this.#loading = true
        try {
            const url = new URL(this.#endpoint)
            url.searchParams.set('_page', this.#page) // modifie parametre page dans l'url
            const comments = await fetchJSON(url.toString())//Recupere donnée API GUI
            if (comments.length === 0) {// On a plus de commentaires في stock
                this.#observer.disconnect()
                this.#loader.remove()
            }
            for (const comment of comments) {
                const commentElement = this.#template.content.cloneNode(true) // template vide
                for (const [key, selector] of Object.entries(this.#elements)) {
                    commentElement.querySelector(selector).innerText = comment[key]
                    /* ca recupere le selector qui est soit js-username ou js-content on le modifie
                    avec comment[key]. comment est un commentaire parmi les commentaires qu'on parcours
                    key est une valeur soit name soit body. Donc comment[key] on recupere la valeur 
                    name(string) et de body(string) dans un commentaire*/
                }
                this.#target.append(commentElement)
            }
            this.#page++
            this.#loading = false
        } catch (e) {
            this.#loader.style.display = 'none'
            const error = alertElement('Impossible de charger le contenus')
            error.addEventListener('close', () => {
                this.#loader.style.removeProperty('display')
                this.#loading = false
            })
            this.#target.prepend(error)

        }
    }
}


class FetchForm {

    /**@type {string} */
    #endpoint
    /**@type {HTMLTemplateElement} */
    #template
    /**@type {HTMLElement} */
    #target
    /**@type {string} */
    #elements

    /**
     * 
     * @param {HTMLFormElement} form 
     */
    constructor(form) {
        this.#endpoint = form.dataset.endpoint
        this.#template = document.querySelector(form.dataset.template)
        this.#target = document.querySelector(form.dataset.target)
        this.#elements = JSON.parse(form.dataset.elements) // json to string
        form.addEventListener('submit', e => {
            e.preventDefault()
            this.#submitForm(e.currentTarget)
        })

    }
    /**
     * @param {HTMLFormElement} form 
     */
    async #submitForm(form) {
        const button = document.querySelector('button')
        button.setAttribute('disabled', '')
        try {
            const data = new FormData(form)
            const comment = await fetchJSON(this.#endpoint, {
                method: 'POST',
                json: Object.fromEntries(data)
            })

            const commentElement = this.#template.content.cloneNode(true)
            for (const [key, selector] of Object.entries(this.#elements)) {
                commentElement.querySelector(selector).innerText = comment[key]
            }
            this.#target.prepend(commentElement)
            form.reset()
            button.removeAttribute('disabled')
            form.insertAdjacentElement(
                'beforebegin',
                alertElement("Succes t'as peur", 'success')
            )
        } catch (e) {
            const errorElement = alertElement("Erreur t'as peur")
            form.insertAdjacentElement(
                'beforebegin',
                errorElement
            )
            errorElement.addEventListener('close', () => {
                button.removeAttribute('disabled')
            })
        }
    }
}


document
    .querySelectorAll('.js-infinite-pagination')
    .forEach(el => new InfinitePagination(el))

document
    .querySelectorAll('.js-form-fetch')
    .forEach(form => new FetchForm(form))