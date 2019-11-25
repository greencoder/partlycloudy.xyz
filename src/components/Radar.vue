<template>
  <section id="radar">
    <header>Radar Image</header>
    <main>
      <a v-bind:href="radar.href"><img v-bind:src="radar.icon" /></a>
    </main>
  </section>
</template>

<script>
export default {
  name: 'Radar',
  props: [
    'radar',
    'satellite',
  ]
}
</script>

<style scoped>

main {
  padding-top: 20px;
}

img {
  height: 100px;
  width: auto;
  margin-right: 15px;
}

</style>