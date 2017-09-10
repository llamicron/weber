var procedureBuilder = new Vue({
  el: '#procedure-builder',
  data: {
    relays: {
      binaries: [
        {
          "type": "binary",
          "name": "hlt",
          "state": 0,
          "prettyName": "HLT Valve"
        },
        {
          "type": "binary",
          "name": "pump",
          "state": 0,
          "prettyName": "Pump"
        },
        {
          "type": "binary",
          "name": "rims",
          "state": 0,
          "prettyName": "RIMS Heater"
        }
      ],
      diverts: [
        {
          "type": "divert",
          "name": "hltDivert",
          "location": 1,
          "prettyName": "HLT Divert Valve"
        },
        {
          "type": "divert",
          "name": "rimsDivert",
          "location": 1,
          "prettyName": "RIMS Divert Valve"
        }
      ]
    },

    tableData: [
      {
        "type": "binary",
        "name": "hlt",
        "state": 0,
        "prettyName": "HLT Valve"
      },
      {
        "type": "divert",
        "name": "rims",
        "location": 1,
        "prettyName": "RIMS Divert Valve"
      },
      {
        "type": "binary",
        "name": "pump",
        "state": 0,
        "prettyName": "Pump"
      },
    ]
  },

  methods: {
    addSelected(id) {
      this.relays['binaries'].forEach(function(relay) {
        if (relay.name == id) {
          this.tableData.push(relay)
        }
      }, this);
      this.relays['diverts'].forEach(function(relay) {
        if (relay.name == id) {
          this.tableData.push(relay)
        }
      }, this);
    }
  }

})
