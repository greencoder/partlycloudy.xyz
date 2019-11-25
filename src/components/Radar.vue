<template>
  <section id="radar">
    <header>Radar and Satellite Images</header>
    <main>
      <a v-bind:href="radar.href"><img v-bind:src="radar.icon" /></a>
      <a v-bind:href="satellite.href"><img v-bind:src="satellite.icon" /></a>
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