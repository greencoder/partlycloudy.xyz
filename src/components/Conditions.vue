<template>
  <section id="conditions">
    <header>
      <img src="@/assets/location.svg" class="right icon" v-on:click="updateGeoPosition">
      <h1>Current Conditions at</h1>
      <h2>{{ location.name }}</h2>
    </header>
    <main>
      <div class="row">
        <div class="left">
          <img v-bind:src="conditions.icon" />
        </div>
        <div class="right">
            <span class="conditions">{{ conditions.conditions }}</span><br/>
            <span class="temperature">{{ conditions.temperature }}</span><br/>
            <span v-if="conditions.wind_chill" class="wchill">
              Feels like {{ conditions.wind_chill }}
            </span><br/>
        </div>
      </div>
      <div>
        <p>
            <strong>Humidity:</strong>
            {{ conditions.humidity }}<br/>
            <strong>Wind:</strong>
            {{ conditions.wind }}<br/>
            <strong>Pressure:</strong>
            {{ conditions.pressure }}<br/>
            <strong>Dew Point:</strong>
            {{ conditions.dewpoint }}<br/>
            <strong>Visibility:</strong>
            {{ conditions.visibility }}<br/>
        </p>
      </div>
    </main>
  </section>
</template>

<script>
export default {
  name: 'Conditions',
  props: [
    'location',
    'conditions',
    'didUpdateLocation',
  ],
  methods: {
    updateGeoPosition: function() {
      navigator.geolocation.getCurrentPosition(position => {
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.set('lat', position.coords.latitude);
        urlParams.set('lon', position.coords.longitude);
        let encodedUrl = decodeURIComponent(`${window.location.pathname}?${urlParams}`);
        window.history.replaceState({}, null, encodedUrl);
        this.didUpdateLocation(position.coords.latitude, position.coords.longitude);
      }, error => {
        alert(error);
      });
    },
  }
}
</script>

<style scoped>

img.right {
  float: right;
  margin: 20px 10px;
  height: 25px;
  opacity: 0.5;
}

img.icon {
  cursor: pointer;
}

span.temperature {
  font-size: 2.7em;
  font-weight: bold;
}

span.wchill {
  font-size: 1.0em;
  font-weight: 300;
}

</style>