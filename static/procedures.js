var procedureBuilder = new Vue({
  el: '#procedure-builder',
  data: {
    "relays": [

      {
        "name": "hlt",
        "state": 0,
        "prettyName": "HLT Valve"
      },
      {
        "name": "hltDivert",
        "location": 1,
        "state": 0,
        "prettyName": "HLT Divert Valve"
      },
      {
        "name": "rims",
        "location": 1,
        "state": 0,
        "prettyName": "RIMS Valve"
      },
      {
        "name": "pump",
        "state": 0,
        "prettyName": "Pump"
      }
    ],
    "rims": [
      {
        "name": "rims",
        "state": 0,
        "prettyName": "RIMS Heater"
      }
    ],

    tableData: [
      {
        "name": "hlt",
        "state": 1,
        "prettyName": "HLT Valve"
      },
      {
        "name": "hltDivert",
        "location": 1,
        "state": 0,
        "prettyName": "HLT Divert Valve"
      },
    ]
  },

  methods: {
    addOption(event) {
      this.tableData.push(event.srcElement.id)
    }
  }

})
