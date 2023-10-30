import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import icons from 'url:../img/icons.svg';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/actual';
import 'regenerator-runtime/runtime'; 
import { async } from 'regenerator-runtime';

const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);
        
        if (!id) return;
        recipeView.renderSpinner();

        // 0 Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 1 Update bookmarks view
        bookmarksView.update(model.state.bookmarks);
       
        // 2 Loading recipe
        await model.loadRecipe(id); 

        // 3 Rendering recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError(); // wrong id error
        console.error(err);
    }
};

const controlSearchResults = async function() {
    try {
        // 1. Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2. Load search results
        await model.loadSearchResults(query);

        // 3. Render results
        resultsView.render(model.getSearchResultsPage());

        // 4. Render initial pagination btns
        paginationView.render(model.state.search);
    } catch(err) {
        console.log(err);
    }
};

const controlPagination = function(goToPage) {    
    // 1. Render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2. Render NEW pagination btns
    paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
    // Update recipe servings (in state object)
    model.updateServings(newServings);

    // Update recipe view
    recipeView.update(model.state.recipe); 
};

const controlAddBookmark = function() {
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    recipeView.update(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
    try {
        addRecipeView.renderSpinner(); 

        // Upload new recipe data
        await model.uploadRecipe(newRecipe);

        recipeView.render(model.state.recipe);
        addRecipeView.renderMessage();
        bookmarksView.render(model.state.bookmarks);

        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        setTimeout(() => {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);

    } catch(err) {
        console.error('', err);
        addRecipeView.renderError(err.message);
    }
    location.reload();
};

const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks); 
    recipeView.addHandlerRender(controlRecipes); 
    recipeView.addHandlerUpdateServings(controlServings); 
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults); 
    paginationView.addHandlerClick(controlPagination);
    bookmarksView.addHandlerRender(controlBookmarks); 
    bookmarksView.addHandlerRender(controlBookmarks); 
    addRecipeView.addHandlerUpload(controlAddRecipe); 
};

init();