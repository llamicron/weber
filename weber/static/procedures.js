Vue.directive('sortable', {
  inserted: function (el, binding) {
    new Sortable(el, binding.value || {})
  }
})

var app = new Vue({
  el: '#procedures',
  data: {
    // We need to keep a list of items that is never changed
    procedureName: "",
    items: [],
    tableItems: [

    ],
    search: {
      term: '',
      results: []
    },
    id: 0
  },

  methods: {
    addSelected(item) {
      // If you don't copy the item, Vue will treat repeat table instances as the same object
      itemCopy = JSON.parse(JSON.stringify(item));
      itemCopy.id = this.id;
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

    updateOrder(event) {
      this.tableItems.splice(event.newIndex, 0, this.tableItems.splice(event.oldIndex, 1)[0])
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
  }
})
