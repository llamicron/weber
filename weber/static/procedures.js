Vue.directive('sortable', {
  inserted: function (el, binding) {
    new Sortable(el, binding.value || {})
  }
})

var app = new Vue({
  el: '#procedures',
  data: {
    // We need to keep a list of items that is never changed
    items: [],
    procedureList: [],
    procedureName: "",
    tableItems: [
    ],
    search: {
      term: '',
      results: []
    },
    id: 0,
    message: ""
  },

  methods: {
    addSelected(item) {
      // If you don't copy the item, Vue will treat repeat table instances as the same object
      itemCopy = JSON.parse(JSON.stringify(item));
      itemCopy.id = this.id;
      itemCopy.position = this.tableItems.length;
      this.id++;
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
    },

    onUpdate(event) {
      console.log("By Old Index: " + this.tableItems[event.oldIndex].prettyName + " - Index: " + event.oldIndex);
      console.log("By new index: " + this.tableItems[event.newIndex].prettyName + " - Index: " + event.newIndex);
      this.tableItems.splice(event.newIndex, 0, this.tableItems.splice(event.oldIndex, 1)[0]);
    },

    removeElement(item) {
      this.tableItems.splice(this.tableItems.indexOf(item), 1);
    },

    saveProcedure() {
      if (this.procedureName == "") {
        this.message = "Please write a name";
        return false;
      }

      if (this.tableItems.length == 0) {
        this.message = "Please add some items";
        return false;
      }

      axios.post("/save-procedure", {
        name: this.procedureName,
        items: this.tableItems
      })
        .then(response => {
          console.log(response);
          this.message = "Procedure Saved"
        })
        .catch(error => {
          console.log(error);
          return false;
        });
      return true;
    },

    getSavedProcedures() {
      axios.get('/procedure-data')
        .then(response => {
          this.procedureList = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    setCurrentProcedure() {
      if (this.procedureName == '') {
        this.tableItems = [];
        return true;
      }

      for (let i = 0; i < this.procedureList.length; i++) {
        const proc = this.procedureList[i];
        if (proc.name == this.procedureName) {
          this.tableItems = proc.items;
          return true;
        }
      }
      return false;
    },

    runProcedure() {
      if (this.tableItems.length < 1 || this.procedureName == "") {
        this.message = "Please choose a procedure or create one";
        return false;
      }

      this.message = "Saving procedure..."
      this.saveProcedure();

      axios.post('/run-procedure', {
        name: this.procedureName
      }).then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
      })

    },

    getRemainingStep() {
      axios.get('/current-step')
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
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
    fade(document.querySelector('#loading'));

    this.getSavedProcedures();
  },

  watch: {
    procedureName: {
      handler: function () {
        this.setCurrentProcedure()
      }
    }
  }
})

