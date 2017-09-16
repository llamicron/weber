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
      timerInput: '',
      string: '',
      startTime: 0,
      endTime: 0
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

    startTimer() {
      input = parseFloat(this.minutesToSeconds(this.timer.timerInput));
      this.timer.startTime = Math.floor(new Date().getTime() / 1000);
      this.timer.endTime = this.timer.startTime + input;
      this.timer.remaining = this.timeRemaining();
      this.timer.timerInput = '';
    },

    secondsToMinutes(seconds) {
      return parseFloat(seconds) / 60;
    },

    minutesToSeconds(minutes) {
      return parseFloat(minutes) * 60;
    },
    timeRemaining() {
      return this.timer.endTime - Math.floor(new Date().getTime() / 1000);
    }
  },

  computed: {
    timeRemainingString() {
      this.timer.string = '';
      minutes = Math.floor(this.timer.remaining / 60);
      if (minutes > 0) {
        this.timer.string = this.timer.string + minutes.toString();
        if (minutes == 1) {
          this.timer.string = this.timer.string + " Minute";
        } else {
          this.timer.string = this.timer.string + " Minutes";
        }
      }

      seconds = this.timer.remaining % 60
      if (seconds > 0) {
        this.timer.string = this.timer.string + ", " + seconds.toString() + " Seconds";
      }

      return this.timer.string;
    }
  },


  mounted() {
    this.loadData();

    setInterval(function () {
      this.loadData();
      this.timer.remaining = this.timeRemaining()
    }.bind(this), 1000);
  }
})
