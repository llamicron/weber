var procedureBuilder = new Vue({
  el: '#procedure-builder',
  data: {
    items: null,
    tableItems: [

    ]
  },

  methods: {
    addSelected(item) {
      this.tableItems.push(item);
    },

    removeElement(item) {
      this.tableItems.splice(this.tableItems.indexOf(item), 1);
    },

    getItemsFromJson() {
      axios.get("/options")
        .then(response => {
          this.items = response.data.items;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },


  mounted() {
    this.getItemsFromJson();
  }
})
