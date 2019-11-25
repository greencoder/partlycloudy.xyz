<template>
  <div id="container">
    <Location v-if="locationMissing"
              :didUpdateLocation="didUpdateLocation" />
    <Loading v-if="fetched === false && !locationMissing" />
    <Conditions v-if="fetched === true"
                :location="location"
                :conditions="conditions"
                :didUpdateLocation="didUpdateLocation" />
    <Alerts v-if="fetched === true && alerts.length > 0"
            :alerts="alerts" />
    <Forecasts v-if="fetched === true"
               :about="about"
               :forecasts="forecasts" />
    <Radar v-if="fetched === true"
          :radar="radar"
          :satellite="satellite" />
    <footer v-if="fetched === true">
      Last Updated: {{ conditions.updated }}
    </footer>
  </div>
</template>

<script>
import Alerts from './components/Alerts.vue';
import Conditions from './components/Conditions.vue';
import Forecasts from './components/Forecasts.vue';
import Loading from './components/Loading.vue';
import Location from './components/Location.vue';
import Radar from './components/Radar.vue';
import NOAA from './scripts/noaa.js';

export default {
  name: 'app',
  components: {
    Alerts,
    Conditions,
    Forecasts,
    Loading,
    Location,
    Radar,
  },
  methods: {
    didUpdateLocation: function(lat, lng) {
      if (lat !== this.latitude || lng !== this.longitude) {
        this.fetched = false;
        this.readUrlParams();
        this.fetchWeather();
      }
    },
    fetchWeather: function() {
      let noaa = new NOAA();
      noaa.fetchAndParse(this.latitude, this.longitude).then(weather => {
        this.conditions = weather.conditions;
        this.forecasts = weather.forecasts;
        this.location = weather.location;
        this.radar = weather.radar;
        this.satellite = weather.satellite;
        this.alerts = weather.alerts;
        this.about = weather.about;
        this.fetched = true;
      });
    },
    readUrlParams: function() {
      let urlParams = new URLSearchParams(window.location.search);
      let lat = urlParams.get('lat');
      let lng = urlParams.get('lon');

      if (lat && lng) {
        this.latitude = parseFloat(lat);
        this.longitude = parseFloat(lng);
      }
    },
  },
  computed: {
    locationMissing: function() {
      return this.latitude === null && this.longitude === null;
    }
  },
  mounted() {
    this.readUrlParams();
    if (this.latitude && this.longitude) {
      this.fetchWeather();
    }
  },
  data: function() {
    return {
      fetched: false,
      latitude: null,
      longitude: null,
      conditions: {},
      forecasts: [],
      location: {},
      radar: {},
      satellite: {},
      alerts: [],
      about: {}
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  color: #464646;
}

html, body {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}

body {
  display: flex;
  align-content: top;
  justify-content: center;
  font-size: 16px;
}

@media screen and (min-width: 401px) {
  body {
    background-color: #ccc;
  }
}

div#container {
  width: 100%;
  max-width: 900px;
  background-color: #fff;
}

section {
  margin: 0px;
  padding: 0px;
  padding-bottom: 10px;
  background-color: #fff;
}

section div {
  display: inline-block;
}

section header {
  width: 100%;
  background-color: #efefef;
  padding: 10px;
  font-weight: bold;
  font-size: 1.2em;
}

section h1 {
  font-size: 0.9em;
  margin: 5px 0px;
}

section h2 {
  font-size: 1.0em;
  margin: 5px 0px;
}

section h3 {
  font-size: 1.2em;
  margin: 5px 0px;
}

section h4 {
  margin: 10px 0px 10px 0px;
  font-size: 0.9em;
  font-weight: 400;
}

section main {
  padding: 10px;
  font-size: 1.0em;
}

section main p {
  line-height: 1.5em;
}

section main img {
  width: 86px;
  padding-top: 0px;
  border: 1px solid #ccc;
}

section main div.row {
  display: flex;
}

section main div.left {
  width: 100px;
  padding-top: 5px;
}

section main div.right {
  width: calc(100% - 100px);
}

section main div.right p {
  margin-top: 0px;
}

footer {
  padding: 20px 10px 40px 10px;
  background-color: #fff;
  border-top: 2px solid #efefef;
  font-weight: 300;
}

</style>
