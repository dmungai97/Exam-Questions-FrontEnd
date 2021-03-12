<template>
  <b-button variant="outline-secondary" size="sm" class="border-0 rounded-0" :title="title" @click="clickHandler(clickParam)">
    <b-icon :icon="iconName"></b-icon>
  </b-button>
</template>
<script>
export default {
  props: ['title', 'clickHandler', 'clickParam', 'iconName']
};
</script>
