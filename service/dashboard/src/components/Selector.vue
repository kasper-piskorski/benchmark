<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <span>{{ title }}</span>
      <span v-if="currentItem">: </span>
      <span>{{ currentItem }}</span>
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu
      slot="dropdown"
      trigger="hover"
    >
      <el-dropdown-item
        v-for="item in items"
        :key="item.value"
        @click.native="updateItem(item)"
      >
        <span>{{ item.text }}</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    defaultItem: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      currentItem: this.defaultItem ? this.defaultItem.text : undefined,
    };
  },

  methods: {
    updateItem(selectedItem) {
      this.currentItem = selectedItem.text;
      this.$emit('item-selected', selectedItem.value);
    },
  },
};
</script>
