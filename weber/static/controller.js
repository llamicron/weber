var app = new Vue({
  el: "#controller",
  data: {
    pid: {
      "pid_running": true,
      "pv": 100,
      "sv": 100
    },
    newSVTemp: "",
    relays: [],
    timer: 0,
    timerInput: null,
    timerUnit: "minutes",
    timeString: "Done.",
    pidUpdateIntervalLength: 3,
  },

  methods: {
    setTempBars() {
      document.querySelector('#pvBar').addEventListener('mdl-componentupgraded', function () {
        this.MaterialProgress.setProgress(app.pid.pv / 2.12);
        if (app.pid.pid_running) {
          this.MaterialProgress.setBuffer(87);
        }
      });
      document.querySelector('#svBar').addEventListener('mdl-componentupgraded', function () {
        this.MaterialProgress.setProgress(app.pid.sv / 2.12);
      });
      return true;
    },

    updateTempBars() {
      document.querySelector('#pvBar').MaterialProgress.setProgress(this.pid.pv / 2.12);
      document.querySelector('#svBar').MaterialProgress.setProgress(this.pid.sv / 2.12);
      if (this.pid.pid_running) {
        document.querySelector('#pvBar').MaterialProgress.setBuffer(87);
      } else {
        document.querySelector('#pvBar').MaterialProgress.setBuffer(100);
      }
      return true;
    },

    getInputTimeInSeconds() {

      if (this.timerInput == '') {
        return 600;
      }

      if (this.timerUnit == 'seconds') {
        return parseInt(this.timerInput);
      } else {
        return parseInt(this.timerInput * 60);
      }
    },

    setTimer() {
      this.timer = this.getInputTimeInSeconds();
      this.endTime = this.now() + this.timer;
      this.timeRemaining = this.timer;
      this.timerInput = "";

      window.setInterval(() => {
        this.timeRemaining = this.endTime - this.now();
        this.setTimeString();
      }, 1000);
    },

    cancelTimer() {
      this.endTime = this.now() - 2;
    },

    now() {
      return Math.floor(Date.now() / 1000)
    },

    setTimeString() {
      if (this.timeRemaining < 0) {
        this.timeString = "Done.";
        return true;
      }
      seconds = this.timeRemaining % 60;
      var formattedSeconds = ("0" + seconds).slice(-2);
      minutes = Math.floor(this.timeRemaining / 60);

      this.timeString = minutes.toString() + ":" + formattedSeconds.toString();
    },

    updateTempChart() {
      if (tempChart.data.datasets[0].data.length > 10) {
        tempChart.data.datasets[0].data.shift();
        tempChart.data.labels.shift();
      }
      if (tempChart.data.datasets[1].data.length > 10) {
        tempChart.data.datasets[1].data.shift();
      }

      tempChart.data.labels.push(new Date().toLocaleTimeString());
      tempChart.data.datasets[0].data.push(this.pid.pv);

      tempChart.data.datasets[1].data.push(this.pid.sv);
      tempChart.update();
    },

    getRelayList() {
      axios.get('/relay-list')
        .then(response => {
          this.relays = response.data.relays;
        })
        .catch(function (error) {
          console.log(error);
        });

    },

    getPidInfo() {
      axios.get('/pid')
        .then(response => {
          this.pid = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    pidUpdateInterval() {
      return parseInt(this.pidUpdateIntervalLength) * 1000;
    },

    toggleRelay(relay) {
      axios.post('/set-relay', {
        relay: relay
      }).then(response => {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    },

    setNewSVTemp() {
      if (this.newSVTemp == "" || isNaN(this.newSVTemp) || parseFloat(this.newSVTemp) < 20) {
        return false;
      } else {
        axios.post('/set-sv', {
          sv: parseFloat(this.newSVTemp)
        }).then(response => {
          console.log(response);
        }).catch(error => {
          console.log(error);
        });
        this.pid.sv = parseFloat(this.newSVTemp);
        this.newSVTemp = "";
      }
    }
  },


  mounted() {
    this.setTempBars();
    this.getRelayList();
    this.getPidInfo();
    this.relayUpdator = window.setInterval(() => {
      this.getRelayList();
    }, 1000);
    this.pidUpdator = window.setInterval(() => {
      this.getPidInfo();
    }, this.pidUpdateInterval())
    fade(document.querySelector('#loading'));
  },

  watch: {
    pid: {
      handler() {
        this.updateTempBars();
        this.updateTempChart();
      },
      deep: true
    },
    pidUpdateIntervalLength: {
      handler() {
        window.clearInterval(this.pidUpdator);
        this.pidUpdator = window.setInterval(() => {
          this.getPidInfo();
        }, this.pidUpdateInterval())
      }
    }
  }
})

var ctx = document.getElementById("tempChart").getContext('2d');
var tempChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [new Date().toLocaleTimeString()],
    datasets: [
      {
        label: 'Actual Temperature ( ˚ F)',
        data: [app.pid.pv],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      },
      {
        label: "Target Temperature",
        data: [app.pid.sv, app.pid.sv],
      }
    ]
  }
});

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
}
