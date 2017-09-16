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
    svField: '',
    timer: {
      input: '',
      remaining: -1
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
    },

    now() {
      return Math.floor(new Date().getTime() / 1000);
    },

    startTimer() {
      interval = parseFloat(this.minutesToSeconds(this.timer.input));
      this.timer.endTime = this.now() + interval;
      this.timer.remaining = this.timeRemaining()
      this.timer.input = '';
    },

    secondsToMinutes(seconds) {
      return parseFloat(seconds) / 60;
    },

    minutesToSeconds(minutes) {
      return parseFloat(minutes) * 60;
    },

    timeRemaining() {
      return this.timer.endTime - Math.floor(new Date().getTime() / 1000);
    },

    timerDone() {
      if (this.timer.remaining == 0) {
        console.log("Finished at " + this.now());
      }
    }
  },


  mounted() {
    this.loadData();

    setInterval(function () {
      this.loadData();
        if (this.timer.remaining > -1) {
          this.timer.remaining = this.timeRemaining();
        }
      if (this.timer.remaining == 0) {
        this.timerDone();
      }
    }.bind(this), 1000);
  }
})
