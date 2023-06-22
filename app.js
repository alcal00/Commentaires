class InfinitePagination {

    #endpoint
    #template
    #target
    #elements

    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this.#endpoint = element.dataset.endpoint
        this.#template = element.dataset.template
        this.#target = element.dataset.target
        this.#elements = element.dataset.elements 
    }
}

document
    .querySelectorAll('.js-infinite-pagination')
    .forEach(el => new InfinitePagination(el))