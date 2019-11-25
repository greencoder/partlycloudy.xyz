<template>
  <section id="alerts">
    <header>Hazardous Weather Conditions</header>
    <main>
      <ul>
        <li v-for="alert in alerts" v-bind:key="alert.name">
          <a v-bind:href="alert.href">{{ alert.name }}</a>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
export default {
  name: 'Alerts',
  props: [
    'alerts',
  ]
}
</script>

<style scoped>

li {
  margin: none;
}

a {
  color: #4C84F1;
  text-decoration: none;
}

ul {
  margin: 5px 0px 10px 0px;
  list-style-type: none;
  padding-left: 0px;
  list-style-position: inside;
}

</style>