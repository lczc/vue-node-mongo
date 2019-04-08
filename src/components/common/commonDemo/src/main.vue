<style  scoped>
.common-demo {
    padding: 15px 70px 15px 60px;
    border-bottom: 1px solid #dfe4ed;
    margin-bottom: 30px;
}
</style>

<template>
  <div class="common-demo">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'CommonDemo'
}
</script>
