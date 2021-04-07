<template>
  <form @submit.prevent="onRecipeSaved" autocomplete="off">
    <div class="card">
      <div class="card-body">
        <h4>Recipe name</h4>
        <input type="text" class="form-control alt" name="name" placeholder="Lasagne" v-model="name">
      </div>
    </div>
    <div class="card my-3">
      <div class="card-body">
        <h4>Add Ingredient</h4>
        <add-recipe-ingredient 
          @recipeIngredientAdded="onRecipeIngredientAdded">
        </add-recipe-ingredient>
      </div>
    </div>
    <div class="card mb-2" v-for="(ingredient, index) in ingredients" :key="`${index}_${ingredient.name}`">
      <div class="card-body">
        <recipe-ingredient
          @removeIngredient="onRemoveIngredient"
          :canRemove="true"
          :ingredient="ingredient">
        </recipe-ingredient>
      </div>
    </div>
    <button class="btn btn-dark btn-block mt-5" v-if="canSave">Finish</button>
    <button class="btn btn-light semi btn-block mt-3" @click.prevent="onCancelAddRecipe">Go back</button>
  </form>
</template>

<script>
import AddRecipeIngredient from './add-recipe-ingredient.vue';
import RecipeIngredient from './recipe-ingredient.vue';
import { VIEW_INDEX } from './../constants';
import { random } from 'lodash';
import { generateKey } from './../helpers';

export default {
  name: "add-recipe",
  components: {
    AddRecipeIngredient,
    RecipeIngredient
  },
  props: {
    existingRecipe: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      name: this.existingRecipe ? this.existingRecipe.name : '',
      ingredients: this.existingRecipe ? this.existingRecipe.ingredients : [],
    };
  },
  computed: {
    canSave: function() {
      return this.name.length && this.ingredients.length;
    }
  },
  methods: {
    onRecipeIngredientAdded: function(ingredient) {
      ingredient.key = generateKey();
      this.ingredients.push(ingredient);
    },
    onRecipeSaved: function() {
      this.$emit('recipeSaved', {
        name: this.name,
        ingredients: this.ingredients,
        key: generateKey()
      })
      this.$emit('switchView', VIEW_INDEX)
    },
    onCancelAddRecipe: function() {
      this.name = '';
      this.ingredients = [];
      this.$emit('switchView', VIEW_INDEX)
    },
    onRemoveIngredient: function(ingredient) {
      const newIngredients = this.ingredients.filter(i => i.key !== ingredient.key);
      this.ingredients = newIngredients;
    }
  },
};
</script>

<style scoped></style>
