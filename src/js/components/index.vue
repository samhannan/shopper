<template>
  <div>
    <div class="card" v-if="!recipes.length">
      <div class="card-body">
        <h3>Your recipes</h3>
        <p>You have not added any recipes. Add your first recipe to begin, or go straight to your shopping list.</p>
        <button class="btn btn-primary btn-block" @click="onAddRecipe">Add new recipe</button>
      </div>
    </div>

    <div v-if="recipes.length > 0">
      <h3 class="text-light">Your Recipes</h3>
      <div class="card has-btn-group mb-2" v-for="recipe in recipes" :key="recipe.key">
        <div class="card-body">
          <recipe
            :recipe="recipe" 
            @updateRecipe="onUpdateRecipe"
            @removeRecipe="onRemoveRecipe"
          >
          </recipe>
        </div>
      </div>
      <button class="btn btn-light semi btn-block" @click="onAddRecipe">Add new recipe</button>
    </div>
    
    <button class="btn btn-dark btn-block mt-5" @click="onViewShoppingList" v-if="ingredients.length">View shopping list ({{ ingredients.length }})</button>

    <div class="install-container d-flex flex-wrap align-items-center justify-content-between" v-if="deferredInstallPrompt">
      <p class="mb-2">Install app for a better Shopper experience:</p>
      <button class="btn btn-outline-primary" @click="promptInstall"><i class="fas fa-download"></i>Install</button>
      <button class="btn btn-link" @click="ignoreInstall"><i class="fas fa-download"></i>No thanks</button>
    </div>
  </div>
</template>

<script>
import { VIEW_NEW_RECIPE, VIEW_SHOPPING_LIST, STORAGE_KEY_IGNORE_INSTALL } from './../constants';
import RecipeIngredient from './recipe-ingredient.vue';
import Recipe from './recipe.vue';

export default {
  name: "index",
  components: {
    Recipe,
    RecipeIngredient
  },
  props: {
    recipes: {
      type: Array,
      default: []
    },
    ingredients: {
      type: Array,
      default: []
    },
  },
  data: function() {
    return {
      deferredInstallPrompt: false
    }
  },
  mounted: function() {
    this.checkAddToHomeScreen()
    this.localStorage = window.localStorage;
  },
  computed: {
    canAddToHomeScreen: function() {
      console.log(window.showInstallPrompt)
    }
  },
  methods: {
    onAddRecipe: function() {
      this.$emit('switchView', VIEW_NEW_RECIPE)
    },
    onUpdateRecipe: function(recipe) {
      this.$emit('updateRecipe', recipe)
    },
    onRemoveRecipe: function(recipe) {
      this.$emit('removeRecipe', recipe)
    },
    onViewShoppingList: function(recipe) {
      this.$emit('switchView', VIEW_SHOPPING_LIST)
    },
    checkAddToHomeScreen: function() {
      window.addEventListener('beforeinstallprompt', (event) => {
        if (!this.localStorage.getItem(STORAGE_KEY_IGNORE_INSTALL)) {
          this.deferredInstallPrompt = event;
        }
      });
    },
    promptInstall: function() {
      this.deferredInstallPrompt.prompt();
      
      this.deferredInstallPrompt.userChoice.then(() => {
        this.deferredInstallPrompt = false;
      });
    },
    ignoreInstall: function() {
      this.localStorage.setItem(STORAGE_KEY_IGNORE_INSTALL, true)
      this.deferredInstallPrompt = false;
    }
  },
};
</script>

<style scoped></style>
