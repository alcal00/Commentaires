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

    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.#endpoint = element.dataset.endpoint
        this.#template = document.querySelector(element.dataset.template)
        this.#target = document.querySelector(element.dataset.target)
        this.#elements = element.dataset.elements 
        this.#observer = new IntersectionObserver((entries) => {
            for(const entry of entries){
                if (entry.isIntersecting){
                    this.#loadMore()
                }
            }
        })
        this.#observer.observe(element)
    }

    async #loadMore(){
         const comments = await fetchJSON(this.#endpoint)
         for(const comment of comments){
            const commentElement = this.#template.content.cloneNode(true)
            this.#target.append(commentElement)
         }
    }
}

document
    .querySelectorAll('.js-infinite-pagination')
    .forEach(el => new InfinitePagination(el))