<template>
  <div class="d-flex justify-content-between align-items-center w-100">
    <div class="custom-control custom-checkbox" :class="{checked: item.checked}">
      <input type="checkbox" class="custom-control-input" :id="item.key" @click="onToggle(item)" :model="checked" :checked="item.checked">
      <label class="custom-control-label" :for="item.key">{{ item.name }}</label>
    </div>
    <div class="btn-group" role="group">
      <button class="btn btn-danger" @click="onRemove">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "shopping-list-item",
  components: {
  },
  props: {
    item: {
      type: Object,
      default: () => []
    },
  },
  data: function() {
    return {
      checked: this.item.checked
    }
  },
  methods: {
    onToggle: function () {
      this.$emit('toggle', this.item)
    },
    onRemove: function() {
      this.$emit('remove', this.item)
    }
  },
};
</script>

<style scoped></style>
