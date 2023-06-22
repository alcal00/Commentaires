import { alertElement } from "./functions/alert.js"
import { fetchJSON } from "./functions/api.js"


class InfinitePagination {

    /**@type {string} */
    #endpoint
    /**@type {HTMLTemplateElement} */
    #template
    /**@type {HTMLElement} */
    #target
    /**@type {HTMLElement} */
    #loader
    /**@type {object} */
    #elements
    /**@type {IntersectionObserver} */
    #observer
    /**@type {boolean} */
    #loading = false
    /**@type {number} */
    #page = 0


    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.#loader = element
        this.#endpoint = element.dataset.endpoint
        this.#template = document.querySelector(element.dataset.template)
        this.#target = document.querySelector(element.dataset.target)
        this.#elements = JSON.parse(element.dataset.elements)
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
        console.log
        if (this.#loading) {
            return
        }
        this.#loading = true
        try {
            const url = new URL(this.#endpoint)
            url.searchParams.set('_page', this.#page)
            const comments = await fetchJSON(url.toString())
            if (comments === 0) {
                this.#observer.disconnect()
                this.#loader.remove()
                return
            }
            for (const comment of comments) {
                const commentElement = this.#template.content.cloneNode(true)
               for (const [key, selector] of Object.entries(this.#elements)) {
                    commentElement.querySelector(selector).innerText = comment[key]
                }

                this.#target.append(commentElement)

            }
            console.log(this.#loader)
            this.#page++
            this.loading = false
        } catch (e) {
            console.log('Erreur')
            this.#loader.style.display = 'none'
            const error = alertElement('Impossible de charger les contenus')
            error.addEventListener('close', () => {
                this.#loader.style.removeProperty('display')
                this.#loading = false
            })
            this.#target.append(error)

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
    /**@type {object} */
    #elements
    /**@type {IntersectionObserver} */

    /**
     * @param {HTMLFormElement} form 
     */
    constructor(form) {
        this.#endpoint = form.dataset.endpoint
        this.#template = document.querySelector(form.dataset.template)
        this.#target = document.querySelector(form.dataset.target)
        this.#elements = JSON.parse(form.dataset.elements)
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
            appendToTarget(comment, this.#template, this.#elements, this.#target)
            form.reset()
            button.removeAttribute('disabled') 
            form.insertAdjacentElement(
                'beforebegin',
                alertElement("Succes t'as peur", 'succes')
            )
        } catch (e) {
            const errorElement = alertElement("Erreur t'as peur")
            form.insertAdjacentElement(
                'beforebegin',
                errorElement
            )
                errorElement.addEventListener('close', () =>{
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



    /**
     * 
     * @param {string || json} comment 
     * @param {HTMLTemplateElement} tagTemplate 
     * @param {object} tagElements 
     * @param {HTMLElement} tagTarget 
     */
function appendToTarget(comment, tagTemplate, tagElements, tagTarget) {
    const commentElement = tagTemplate.content.cloneNode(true)
    for (const [key, selector] of Object.entries(tagElements)) {
        commentElement.querySelector(selector).innerText = comment[key]
    }
    tagTarget.prepend(commentElement)
}