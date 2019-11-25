<template>
  <section id="location">
    <div>
        <img src="@/assets/pin.svg" @click="getGeoPosition" />
    </div>
    <h1 @click="getGeoPosition">{{ status }}</h1>
  </section>
</template>

<script>
export default {
  name: 'Location',
  props: [
    'didUpdateLocation',
  ],
  data: function() {
    return {
      status: 'Use My Current Location',
    }
  },
  methods: {
    getGeoPosition: function() {
      this.status = "Getting your location";
      navigator.geolocation.getCurrentPosition(position => {
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.append('lat', position.coords.latitude);
        urlParams.append('lon', position.coords.longitude);
        let encodedUrl = decodeURIComponent(`${window.location.pathname}?${urlParams}`);
        window.history.replaceState({}, null, encodedUrl);
        this.didUpdateLocation(position.coords.latitude, position.coords.longitude);
      }, error => {
        this.status = 'Use My Current Location';
        alert(error);
      });
    },
  }
}
</script>

<style scoped>
  h1 {
    text-align: center;
    font-family: 'Lato', sans-serif;
    font-size: 1.5em;
    cursor: pointer;
    margin-top: 20px;
  }
  div {
    padding-top: 50px;
    font-size: 18px;
    width: 100%;
    text-align: center;
  }
  img {
    text-align: center;
    height: 150px;
    width: 150px;
    outline: none;
    cursor: pointer;
  }
</style>