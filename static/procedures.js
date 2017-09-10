var procedureBuilder = new Vue({
  el: '#procedure-builder',
  data: {
    items: {
      binaries: [
        {
          "type": "binary",
          "name": "hlt",
          "state": 0,
          "icon": "fa-power-off",
          "stateVerbage": {
            1: 'open',
            0: 'closed'
          },
          "prettyName": "HLT Valve"
        },
        {
          "type": "binary",
          "name": "pump",
          "state": 0,
          "icon": "fa-power-off",
          "stateVerbage": {
            1: 'on',
            0: 'off'
          },
          "prettyName": "Pump"
        },
        {
          "type": "binary",
          "name": "rims",
          "state": 0,
          "icon": "fa-thermometer-quarter",
          "stateVerbage": {
            1: 'on',
            0: 'off'
          },
          "prettyName": "RIMS Heater"
        }
      ],
      diverts: [
        {
          "type": "divert",
          "name": "hltDivert",
          "location": 1,
          "icon": "fa-power-off",
          "locationVerbage": {
            1: 'mash',
            0: 'boil'
          },
          "prettyName": "HLT Divert Valve"
        },
        {
          "type": "divert",
          "name": "rimsDivert",
          "location": 1,
          "icon": "fa-power-off",
          "locationVerbage": {
            1: 'mash',
            0: 'boil'
          },
          "prettyName": "RIMS Divert Valve"
        }
      ],
      methods: [
        {
          "type": "method",
          "name": "sleep",
          "prettyName": "Wait",
          "icon": "fa-hourglass-start",
          "desc": "Wait for this amount of seconds",
          "args": [
            "duration"
          ],
          "hrType": "Number",
          "value": null
        },
        {
          "type": "method",
          "name": "watch",
          "prettyName": "Watch Until",
          "desc": "Wait until PV is this value or greater",
          "icon": "fa-cubes",
          "args": [
            "pv"
          ],
          "hrType": "Number",
          "value": null
        }
      ]
    },

    tableItems: [

    ]
  },

  methods: {
    addSelected(item) {
      this.tableItems.push(item);
    },

    removeElement(item) {
      this.tableItems.splice(this.tableItems.indexOf(item), 1);
    }
  },

})
