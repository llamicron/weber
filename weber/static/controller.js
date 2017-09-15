var controller = new Vue({
  el: "#controller",
  data: {
    relays: null,
    // Default data
    pid: {
      pid_running: false,
      sv: 0.0,
      pv: 0.0
    },
    svField: ''
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
          this.pid = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    loadData() {
      this.getRelaysFromJson();
      this.getPidData();
    },

    setSv() {
      axios.post('/set-sv', {
        sv: this.svField
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      this.svField = '';
    }
  },

  mounted() {
    this.loadData();

    setInterval(function () {
      this.loadData();
    }.bind(this), 1000);
  }
})
