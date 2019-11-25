<template>
  <section id="forecasts">
    <header>
      <h1>Seven-Day Forecast for</h1>
      <h2>{{ about.location }}</h2>
    </header>
    <main>
      <div v-for="forecast of forecasts" v-bind:key="forecast.period" class="forecast">
        <h3>
          {{ forecast.period }}
          <span class="hi-lo" v-bind:class="forecast.hiLoType">
            {{ forecast.hiLo }}
          </span>
        </h3>
        <h4>{{ forecast.descShort }}</h4>
        <div class="row">
          <div class="left">
            <img v-bind:src="forecast.icon" />
          </div>
          <div class="right forecast-text">
            <p>{{ forecast.descLong }}</p>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
export default {
  name: 'Forecasts',
  props: [
    'about',
    'forecasts',
  ]
}
</script>

<style scoped>

main {
  padding: 0px !important;
}

div.forecast {
  padding: 10px 10px 20px 10px;
  border-bottom: 1px solid #efefef;
  width: 100%;
}

div.forecast:last-child {
  border-bottom: none;
}

div.forecast-text {
  font-weight: 400;
}

span.hi-lo {
  display: inline-block;
  margin-left: 5px;
  font-weight: 400;
}

span.hi-lo.hi {
  color: #EC4F27;
}

span.hi-lo.lo {
  color: #4C84F1;
}

</style>