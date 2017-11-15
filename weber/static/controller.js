var app = new Vue({
  el: "#controller",
  data: {
    pid: {
      "pid_running": true,
      "pv": 100.2,
      "sv": 157
    },
    relays: [
      {
        "state": true,
        "prettyName": "HLT Valve",
        "method": {
          "offArg": 0,
          "onArg": 1,
          "name": "hlt"
        },
        "verbage": {
          true: "Open",
          false: "Closed"
        },
        "name": "hlt",
        "icon": "camera"
      },
      {
        "state": true,
        "prettyName": "HLT Divert",
        "method": {
          "offArg": "boil",
          "onArg": "mash",
          "name": "hlt_to"
        },
        "verbage": {
          true: "To Boil",
          false: "To Mash"
        },
        "name": "hltToMash",
        "icon": "donut_small"
      },
      {
        "state": true,
        "prettyName": "Pump",
        "method": {
          "offArg": 0,
          "onArg": 1,
          "name": "pump"
        },
        "verbage": {
          true: "On",
          false: "Off"
        },
        "name": "pump",
        "icon": "camera"
      },
      {
        "state": true,
        "prettyName": "RIMS Divert",
        "method": {
          "offArg": "boil",
          "onArg": "mash",
          "name": "rims_to"
        },
        "verbage": {
          true: "To Boil",
          false: "To Mash"
        },
        "name": "rimsToMash",
        "icon": "donut_small"
      },
      {
        "state": false,
        "prettyName": "RIMS Heater",
        "method": {
          "offArg": 0,
          "onArg": 1,
          "name": "pid"
        },
        "verbage": {
          true: "On",
          false: "Off"
        },
        "name": "rims",
        "icon": "flash_on"
      }
    ],
    timer: 0,
    timerInput: null,
    timerUnit: "minutes",
    timeString: "Done."
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
      tempChart.data.labels.push(new Date().toLocaleTimeString());
      tempChart.data.datasets[0].data.push(this.pid.pv);

      tempChart.data.datasets[1].data.push(this.pid.sv);
      tempChart.update();
    }
  },


  mounted() {
    this.setTempBars();
  },

  watch: {
    pid: {
      handler() {
        this.updateTempBars();
        this.updateTempChart();
      },
      deep: true
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
