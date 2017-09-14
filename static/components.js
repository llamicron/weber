Vue.component("bulma-hero", {
  template: `
  <section class="hero">
  <div class="hero-body">
  <div class="container">
  <h1 class="title">
  <slot></slot>
  </h1>
  </div>
  </div>
  </section>
  `
})

Vue.component("panel-item", {
  props: ['item'],

  methods: {
    addSelected() {
      this.$emit("added", this.item);
    },
  },

  template: `
  <!-- Pump Panel Item -->
  <a class="panel-block" @click="addSelected" :id="item.name" :title="item.prettyName">
    <span class="panel-icon">
      <i class="fa" :class="item.icon" aria-hidden="true" />
    </span>
    {{ item.prettyName }}
  </a>
  `
})


Vue.component("row-select", {
  props: ["item"],
  template: `
  <div>
    <div v-if="item.type == 'binary'" class="select is-small">
      <select v-model="item.state" name="state-select" id="state-select">
        <option value="1">{{ item.stateVerbage[1] }}</option>
        <option value="0">{{ item.stateVerbage[0] }}</option>
      </select>
    </div>
    <div v-if="item.type == 'divert'" class="select is-small">
      <select v-model="item.location" name="location-select" id="location-select">
        <option value="1">mash</option>
        <option value="0">boil</option>
      </select>
    </div>
    <div v-if="item.type == 'method'">
      <div class="field" v-for="arg in item.args">
        <div class="control">
          <input class="input is-small" v-model="item.value" :name="arg" type="text" :placeholder="item.hrType">
        </div>
      </div>
    </div>
  </div>
  `
})


Vue.component('remove-button', {
  methods: {
    removeElement() {
      this.$emit("remove");
    }
  },

  template: `
  <a @click="removeElement">
    <!-- <i class="fa fa-window-close fa-lg" aria-hidden="true"></i> -->
    <a href="#" class="button is-danger is-small">Remove</a>
  </a>
  `
})
