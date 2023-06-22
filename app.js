import { fetchJSON } from "./functions/api.js"

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

    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element) {
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
        if (this.#loading) {
            return
        }
        this.#loading = true
        const comments = await fetchJSON(this.#endpoint)
        for (const comment of comments) {
            const commentElement = this.#template.content.cloneNode(true) // template vide
            for (const [key, selector] of Object.entries(this.#elements)) {
                console.log({ key, selector })
                commentElement.querySelector(selector).innerText = comment[key] 
                /* ca recupere le selector qui est soit js-username ou js-content on le modifie
                avec comment[key]. comment est un commentaire parmi les commentaires qu'on parcours
                key est une valeur soit name soit body. Donc comment[key] on recupere la valeur 
                name(string) et de body(string) dans un commentaire*/
            }
            this.#target.append(commentElement)
        }
        this.#loading = false
    }
}

document
    .querySelectorAll('.js-infinite-pagination')
    .forEach(el => new InfinitePagination(el))