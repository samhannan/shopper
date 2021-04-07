<template>
  <div class="container py-3">
    <h1 class="display mb-5">Shopper</h1>
    <transition name="slide-fade" mode="out-in">
      <index 
        v-if="isCurrentView(VIEW_INDEX)"
        :recipes="recipes"
        :ingredients="combinedRecipeIngredients"
        @switchView="onSwitchView"
        @updateRecipe="onRecipeUpdate"
        @removeRecipe="onRecipeRemoved">
      </index>
      <add-recipe
        v-if="isCurrentView(VIEW_NEW_RECIPE)"
        @recipeSaved="onRecipeSaved"
        @switchView="onSwitchView">
      </add-recipe>
      <add-recipe
        v-if="isCurrentView(VIEW_UPDATE_RECIPE)"
        @recipeSaved="onRecipeSaved"
        @switchView="onSwitchView"
        :existingRecipe="existingRecipe">
      </add-recipe>
      <shopping-list
        v-if="isCurrentView(VIEW_SHOPPING_LIST)"
        @toggleShoppingListItem="onToggleShoppingListItem"
        @switchView="onSwitchView"
        @saveShoppingListItem="onSaveShoppingListItem"
        @removeShoppingListItem="onRemoveShoppingListItem"
        :items="shoppingListItems">
      </shopping-list>
    </transition>
  </div>
</template>

<script>
import {
  VIEW_INDEX,
  VIEW_NEW_RECIPE,
  VIEW_UPDATE_RECIPE,
  VIEW_SHOPPING_LIST,
  STORAGE_KEY_RECIPES,
  STORAGE_KEY_SHOPPING_LIST
} from './../constants';
import AddRecipe from './add-recipe.vue';
import Index from './index.vue';
import ShoppingList from './shopping-list.vue';
import { generateRecipeIngredients, generateKey } from './../helpers';

const defaultRecipes = [
  {
    name: 'Chilli',
    key: 1234,
    ingredients: [
      {
        measurement: 'weight',
        name: 'Mince',
        quantity: 500,
        key: 2222
      },
      {
        measurement: 'quantity',
        name: 'Puree',
        quantity: 1,
        key: 3333
      }
    ]
  },
  {
    name: 'Lasagne',
    key: 5678,
    ingredients: [
      {
        measurement: 'weight',
        name: 'Mince',
        quantity: 500,
        key: 4343
      },
      {
        measurement: 'quantity',
        name: 'Puree',
        quantity: 1,
        key: 9292
      }
    ]
  },
];

export default {
  name: "app",
  created () {
    this.VIEW_INDEX = VIEW_INDEX;
    this.VIEW_NEW_RECIPE = VIEW_NEW_RECIPE;
    this.VIEW_UPDATE_RECIPE = VIEW_UPDATE_RECIPE;
    this.VIEW_SHOPPING_LIST = VIEW_SHOPPING_LIST;
  },
  components: {
    AddRecipe,
    Index,
    ShoppingList
  },
  data: function () {
    return {
      view: VIEW_INDEX,
      recipes: [], //defaultRecipes,
      existingRecipe: null,
      shoppingListItems: [],
    };
  },
  mounted: function() {
    this.localStorage = window.localStorage;
    this.retrieveStorage();
  },
  computed: {
    combinedRecipeIngredients: function() {
      return generateRecipeIngredients([...this.recipes]);
    }
  },
  watch: {
  },
  methods: {
    retrieveStorage: function() {
      [STORAGE_KEY_RECIPES, STORAGE_KEY_SHOPPING_LIST].forEach(key => {
        const jsonValue = this.localStorage.getItem(key);
        if (jsonValue) {
          try {
            this.$set(this, key, JSON.parse(jsonValue));
          } catch (e) {
            this.localStorage.removeItem(key);
          }
        }
      });
    },
    recipesUpdated: function() {
      this.mergeShoppingList();
      this.setStorageItem(STORAGE_KEY_RECIPES, this.recipes);
      this.shoppingListUpdated();
    },
    shoppingListUpdated: function() {
      this.setStorageItem(STORAGE_KEY_SHOPPING_LIST, this.shoppingListItems);
    },
    setStorageItem: function(key, data) {
      this.localStorage.setItem(key, JSON.stringify(data));
    },
    mergeShoppingList: function() {
      let recipeIngredients = this.combinedRecipeIngredients;
      let shoppingListItems = [...this.shoppingListItems];

      // Add recipe ingredients which dont exist in shopping list
      recipeIngredients.forEach(recipeIngredient => {
        const shoppingListItemExists = shoppingListItems.findIndex(i => i.key === recipeIngredient.key);
        if (shoppingListItemExists === -1) {
          shoppingListItems.push(this.generateShoppingListItem(recipeIngredient.name, recipeIngredient.key))
        }
      })

      // Remove recipe ingredients which have been deleted
      const recipeIngredientKeys = recipeIngredients.map(i => i.key)
      shoppingListItems = shoppingListItems.filter(shoppingListItem => recipeIngredientKeys.includes(shoppingListItem.key))

      // Update existing shopping list items (required if we change the qty of a recipe ingredient)
      shoppingListItems = shoppingListItems.map(shoppingListItem => {
        return {
          ...shoppingListItem,
          name: recipeIngredients.filter(i => i.key === shoppingListItem.key)[0].name
        }
      })

      this.shoppingListItems = shoppingListItems;
    },
    generateShoppingListItem: function (name, key, checked = false) {
      return {
        name,
        key,
        checked
      }
    },
    onAddRecipe: function() {
      this.view = VIEW_NEW_RECIPE
    },
    isCurrentView: function (view) {
      return view === this.view;
    },
    onRecipeSaved: function (recipe) {
      // If updating a recipe, remove the old, outdated recipe
      if (this.existingRecipe) {
        const newRecipes = this.recipes.filter(r => r.key !== this.existingRecipe.key)
        this.recipes = newRecipes;
      }
      this.recipes.push(recipe);
      this.recipesUpdated();
    },
    onRecipeRemoved: function(recipe) {
      const updatedRecipes = this.recipes.filter(r => r.key !== recipe.key)
      this.recipes = updatedRecipes;
      this.recipesUpdated();
    },
    onRecipeUpdate: function(recipe) {
      this.existingRecipe = recipe;
      this.view = VIEW_UPDATE_RECIPE;
      this.recipesUpdated();
    },
    onSwitchView: function (view) {
      this.view = view;
    },
    onToggleShoppingListItem: function (item) {
      const shoppingListItems = this.shoppingListItems;
      const updatedItemKey = shoppingListItems.findIndex(i => i.key === item.key);
      shoppingListItems[updatedItemKey].checked = !shoppingListItems[updatedItemKey].checked;
      this.shoppingListItems = shoppingListItems;
      this.shoppingListUpdated();
    },
    onSaveShoppingListItem: function(newItemName) {
      const shoppingListItems = this.shoppingListItems;
      shoppingListItems.push(this.generateShoppingListItem(newItemName, generateKey()))
      this.shoppingListItems = shoppingListItems;
      this.shoppingListUpdated();
    },
    onRemoveShoppingListItem: function (item) {
      const updatedShoppingListItems = this.shoppingListItems.filter(r => r.key !== item.key)
      this.shoppingListItems = updatedShoppingListItems;
      this.shoppingListUpdated();
    },
  }
};
</script>

<style lang="scss" scoped>
 
</style>
