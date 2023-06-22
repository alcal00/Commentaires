class InfinitePagination {

    /**@type {string} */
    #endpoint
    /**@type {string} */
    #template
    /**@type {string} */
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
        this.#template = element.dataset.template
        this.#target = element.dataset.target
        this.#elements = element.dataset.elements 
        this.#observer = new IntersectionObserver((entries) => {
            for(const entry of entries){
                if (entry.isIntersecting){
                    this.#loadMore()
                }
            }
        })
    }

    #loadMore(){
         
    }
}

document
    .querySelectorAll('.js-infinite-pagination')
    .forEach(el => new InfinitePagination(el))