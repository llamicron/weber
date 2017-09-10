var procedureBuilder = new Vue({
  el: '#procedure-builder',
  data: {
    "relays": [
      {
        "name": "hlt",
        "location": "",
        "state": 0,
        "prettyName": "HLT Valve"
      },
      {
        "name": "rims",
        "location": "",
        "state": 0,
        "prettyName": "RIMS Valve"
      },
      {
        "name": "pump",
        "location": null,
        "state": 0,
        "prettyName": "Pump"
      }
    ],
    "rims": [
      {
        "name": "rims",
        "state": 0,
        "prettyName": "RIMS"
      }
    ],

    tableData: [
      "HLT On"
    ]
  },

  methods: {
    addOption(event) {
      this.tableData.push(event.srcElement.id)
    }
  }

})

