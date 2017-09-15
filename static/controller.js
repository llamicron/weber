var controller = new Vue({
  el: "#controller",
  data: {
    relays: null,
    // Default data
    pid: {
      pid_running: false,
      sv: 0.0,
      pv: 0.0
    }
  },

  methods: {
    getRelaysFromJson() {
      axios.get('/relay-list')
        .then(response => {
          this.relays = response.data.relays;
        })
        .catch(error => {
          console.log(error);
        })
    },

    toggleRelay(relay) {
      axios.post('/set-relay', {
        relay: relay
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      })
      return true;
    },

    getPidData() {
      axios.get('/pid')
        .then(response => {
          this.pid = response.data.pid;
        })
        .catch(error => {
          console.log(error);
        })
    },

    loadData() {
      this.getRelaysFromJson();
      this.getPidData();
    }
  },

  mounted() {
    this.loadData();

    setInterval(function () {
      this.loadData();
    }.bind(this), 1000);
  }
})
