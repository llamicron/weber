var app = new Vue({
  el: '#procedures',
  data: {
    // We need to keep a list of items that is never changed
    procedureName: "",
    items: [
      {
        "type": "binary",
        "name": "hlt",
        "state": 0,
        "icon": "camera",
        "stateVerbage": {
          "1": "open",
          "0": "closed"
        },
        "prettyName": "HLT Valve"
      },
      {
        "type": "binary",
        "name": "pump",
        "state": 0,
        "icon": "camera",
        "stateVerbage": {
          "1": "on",
          "0": "off"
        },
        "prettyName": "Pump"
      },
      {
        "type": "binary",
        "name": "rims",
        "state": 0,
        "icon": "flash_on",
        "stateVerbage": {
          "1": "on",
          "0": "off"
        },
        "prettyName": "RIMS Heater"
      },
      {
        "type": "divert",
        "name": "hltDivert",
        "location": "1",
        "icon": "donut_small",
        "locationVerbage": {
          "1": "mash",
          "0": "boil"
        },
        "prettyName": "HLT Divert Valve"
      },
      {
        "type": "divert",
        "name": "rimsDivert",
        "location": "1",
        "icon": "donut_small",
        "locationVerbage": {
          "1": "mash",
          "0": "boil"
        },
        "prettyName": "RIMS Divert Valve"
      },
      {
        "type": "method",
        "name": "sleep",
        "prettyName": "Wait",
        "icon": "hourglass_full",
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
        "icon": "search",
        "args": [
          "pv"
        ],
        "hrType": "Number",
        "value": null
      },
      {
        "type": "method",
        "name": "slack",
        "prettyName": "Send in Slack",
        "desc": "Sends a message in slack",
        "icon": "send",
        "args": [
          "Message"
        ],
        "hrType": "Text",
        "value": null
      }
    ],
    tableItems: [

    ],
    search: {
      term: '',
      results: []
    }
  },

  methods: {
    addSelected(item) {
      // If you don't copy the item, Vue will treat repeat table instances as the same object
      itemCopy = JSON.parse(JSON.stringify(item));
      this.tableItems.push(itemCopy);
    },

    filterSearchList() {
      this.search.results = [];
      this.searchableItems.forEach(item => {
        if (item.prettyName.toLowerCase().indexOf(this.searchTerm) != -1) {
          this.search.results.push(item);
        }
      }, this);
    },

    removeElement(item) {
      this.tableItems.splice(this.tableItems.indexOf(item), 1);
    },

    getItemsFromJson() {
      axios.get("/items")
        .then(response => {
          this.items = response.data.items;
          // Set default list
          this.search.results = response.data.items;
          return true;
        }).catch(function (error) {
          console.log(error);
        });
    }
  },

  computed: {
    searchTerm() {
      return this.search.term.toLowerCase();
    },
    searchableItems() {
      return JSON.parse(JSON.stringify(this.items));
    }
  },


  mounted() {
    this.getItemsFromJson();
  }
})
