<template>
  <div class="d-flex justify-content-between align-items-center">
    <strong>{{ recipe.name }}</strong>
    <div class="btn-group" role="group">
      <button class="btn btn-link text-dark " @click="onUpdateRecipe">Update</button>
      <button class="btn btn-danger" @click="onRemoveRecipe">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "recipe",
  props: {
    recipe: {
      type: Object
    },
  },
  methods: {
    onUpdateRecipe: function() {
      this.$emit('updateRecipe', this.recipe)
    },
    onRemoveRecipe: function() {
      this.$emit('removeRecipe', this.recipe)
    }
  }
};
</script>

<style scoped></style>
