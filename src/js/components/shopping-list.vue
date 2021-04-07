<template>
  <div>
    <h3 class="mb-3">Shopping List</h3>
    <div class="card has-btn-group mb-2" v-for="item in items" :key="item.key">
      <div class="card-body">
        <shopping-list-item
          @toggle="onToggle"
          @remove="onRemove"
          :item="item">
        </shopping-list-item>
      </div>
    </div>
    <div class="card mb-2">
      <div class="card-body">
        <form @submit.prevent="onSaveShoppingListItem" autocomplete="off">
          <input type="text" class="form-control alt" name="newItemName" placeholder="New item..." v-model="newItemName">
        </form>
      </div>
    </div>
    <button class="btn btn-block btn-light semi mt-4" @click="onGoBack">Back</button>
  </div>
</template>

<script>
import { VIEW_INDEX } from './../constants';
import ShoppingListItem from './shopping-list-item.vue';
import { isEmpty } from 'lodash'

export default {
  name: "shopping-list",
  components: {
    ShoppingListItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
  },
  data: function() {
    return {
      newItemName: ''
    };
  },
  computed: {
  },
  methods: {
    onToggle: function(item) {
      this.$emit('toggleShoppingListItem', item)
    },
    onGoBack: function() {
      this.$emit('switchView', VIEW_INDEX)
    },
    onSaveShoppingListItem: function () {
      if (!isEmpty(this.newItemName)) {
        this.$emit('saveShoppingListItem', this.newItemName)
      }
      this.newItemName = null
    },
    onRemove: function(item) {
      this.$emit('removeShoppingListItem', item)
    }
  },
};
</script>

<style scoped></style>
