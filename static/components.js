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
  props: ['id', 'name', 'icon'],

  // data() {

  // },

  methods: {
    addSelected() {
      this.$emit("added", this.id);
    },
  },

  template: `
  <!-- Pump Panel Item -->
  <a class="panel-block" @click="addSelected">
    <span class="panel-icon">
      <i :class="'fa ' + this.icon" aria-hidden="true"></i>
    </span>
    <slot></slot>
  </a>
  `
})

