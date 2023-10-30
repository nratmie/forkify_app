import View from "./View";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        })
    }

    _generateMarkupBtn(direction) {
        let isNext = direction.toLowerCase() === 'next';
        let pageNum = this._data.page; 
        isNext ? pageNum++ : pageNum--;

        return `
                <button data-goto="${pageNum}" class="btn--inline pagination__btn--${direction}">
                    ${isNext ? `<span>Page ${pageNum}</span>` : ''}
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-${isNext ? 'right' : 'left'}"></use>
                    </svg>
                    ${isNext ? '' : `<span>Page ${pageNum}</span>`}
                </button>
            `;
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
       
        // We are at page 1 and there are other pages
        if (curPage === 1 && numOfPages > 1) {
            return this._generateMarkupBtn('next');
        }

        // Last page
        if (curPage === numOfPages && numOfPages > 1) {
            return this._generateMarkupBtn('prev');
        }
        
        // Other page
        if (curPage < numOfPages) {
            return `
                ${this._generateMarkupBtn('next')}
                ${this._generateMarkupBtn('prev')}
            `;
        }

        // We are at page 1, and there are NO other pages
        return '';
    }
}

export default new PaginationView();