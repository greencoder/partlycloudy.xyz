<template>
  <section id="error">
    <p>An error has occurred: {{ error }}</p>
  </section>
</template>

<script>
export default {
  name: 'error',
  props: [
    'error',
  ]
}
</script>

<style scoped>
p {
  text-align: center;
}
</style>