var procedureBuilder = new Vue({
  el: '#procedure-builder',
  data: {
    items: {
      binaries: [
        {
          "type": "binary",
          "name": "hlt",
          "state": 0,
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
          "args": [
            "duration"
          ],
          "arg_types": ["int", "float"],
        },
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
