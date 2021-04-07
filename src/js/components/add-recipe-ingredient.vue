<template>
  <form @submit.prevent="saveRecipeIngredient" autocomplete="off">
    <div class="form-row mb-2">
      <div class="col">
        <input type="text" class="form-control alt" name="name" placeholder="Eg, Mince, Onion" v-model="name">
      </div>
    </div>
    <div class="form-row mb-2">
      <div class="col">
        <select class="form-control alt" name="measurement" v-model="measurement">
          <option v-for="option in measurementOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
      <div class="col">
        <input type="text" class="form-control alt" name="quantity" :placeholder="quantityPlaceholder" v-model="quantity">
      </div>
    </div>
    <button class="btn btn-block btn-primary mt-4" v-if="canSave">Save Ingredient</button>
  </form>
</template>

<script>
import {MEASUREMENT_QUANTITY, MEASUREMENT_WEIGHT} from './../constants';
import { isEmpty } from 'lodash'

export default {
  name: "add-recipe-ingredient",
  data: function() {
    return {
      name: '',
      measurement: MEASUREMENT_QUANTITY,
      quantity: ''
    };
  },
  computed: {
    measurementOptions: function() {
      return [
        {
          value: MEASUREMENT_QUANTITY,
          label: 'Quantity'
        },
        {
          value: MEASUREMENT_WEIGHT,
          label: 'Weight'
        }
      ]
    },
    quantityPlaceholder: function() {
      return this.measurement === MEASUREMENT_QUANTITY ? '1' : 'g'
    },
    canSave: function() {
      return !isEmpty(this.name) && !isEmpty(this.quantity);
    }
  },
  methods: {
    saveRecipeIngredient: function() {
      this.$emit('recipeIngredientAdded', {
        name: this.name,
        measurement: this.measurement,
        quantity: this.quantity,
      })
      this.name = '';
      this.measurement = MEASUREMENT_QUANTITY;
      this.quantity = '';
    }
  },
};
</script>

<style scoped></style>
