<template>
  <span class="d-flex justify-content-between">
    <span>{{ nameIncludingMeasurement }}</span>
    <a v-if="canRemove" class="text-danger" @click="removeIngredient">Remove</a>
  </span>
</template>

<script>
import { measurementString } from './../helpers';

export default {
  name: "recipe-ingredient",
  props: {
    ingredient: {
      type: Object
    },
    canRemove: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nameIncludingMeasurement: function () {
      return `${this.ingredient.name} (${measurementString(this.ingredient)})`
    }
  },
  methods: {
    removeIngredient: function() {
      this.$emit('removeIngredient', this.ingredient)
    }
  }
};
</script>

<style scoped></style>
