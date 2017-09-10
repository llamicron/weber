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
      ]
      // methods: [
      //   {
      //     "name": "sleep",
      //     "prettyName": "Wait",
      //     "args": [],
      //     "arg_types": ["int", "float"],
      //   },
      //   {
      //     "name": "slack",
      //     "prettyName": "Slack",
      //     "args": [],
      //     "arg_types": ['str']
      //   }
      // ]
    },

    tableData: [

    ]
  },

  methods: {
    addSelected(id) {
      this.items['binaries'].forEach(function (relay) {
        if (relay.name == id) {
          this.tableData.push(relay)
        }
      }, this);
      this.items['diverts'].forEach(function (relay) {
        if (relay.name == id) {
          this.tableData.push(relay)
        }
      }, this);
    },

    removeElement(item) {
      index = this.tableData.indexOf(item);
      if (index > -1) {
        this.tableData.splice(index, 1);
      }
    }
  }

})
