/*const API_URL = 'http://localhost:3000';

Vue.component('search', {
  template: `
  <div>
    <input type="text" v-model="searchQuery" class="search-text" />
    <button class="search-button" @click="handleSearchClick">Поиск</button>
  </div>
  `,
  data() {
    return {
      searchQuery: '',
      image: 'https://i.ytimg.com/vi/M-XtB0R3ri4/maxresdefault.jpg',
    }
  },
  computed: {
    // backgroundImage() { return `url(${this.image})`; }
  },
  methods: {
    handleSearchClick() {
      this.$emit('search', this.searchQuery);
    }
  }
});

Vue.component('product-item', {
  props: ['item'],
  template: `
    <div class="item">
      <h2>{{item.name}}</h2>
      <span>{{item.price}}</span>
      <button @click.prevent="handleBuyClick(item)">Buy</button>
    </div>
  `,
  methods: {
    handleBuyClick(item) {
      this.$emit('onBuy', item);
    }
  }
});

Vue.component('products', {
  props: ['query'],
  methods: {
    handleBuyClick(item) {
      this.$emit('onbuy', item);
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    filteredItems() {
      if(this.query) {
        const regexp = new RegExp(this.query, 'i');
        return this.items.filter((item) => regexp.test(item.name));
      } else {
        return this.items;
      }
    }
  },
  mounted() {
    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then((items) => {
        this.items = items;
      });
  },
  template: `
    <div class="goods">
      <product-item v-for="entry in filteredItems" :item="entry" @onBuy="handleBuyClick"></product-item>
    </div>
  `,
});

Vue.component('cart', {
  props: ['cart'],
  template: `
  <div>
    <ul>
      <li v-for="item in cart">{{ item.name }} ({{ item.quantity }})<button
          @click="handleDeleteClick(item)">x</button></li>
    </ul>
    <div>Общая стоимость: {{ total }}</div>
  </div>
  `,
  computed: {
    total() {
      return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
  },
  methods: {
    handleDeleteClick(item) {
      this.$emit('delete', item);
    }
  }
});

const app = new Vue({
  el: '#app',
  data: {
    filterValue: '',
    cart: [],
    firstName: 'Ivan',
    lastName: 'Petrov',
    isFakeVisible: false,
  },
  mounted() {
    fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;
      });
  },
  methods: {
    handleButtonClick() {
      this.isFakeVisible = !this.isFakeVisible;
    },
    handleDeleteClick(item) {
      if (item.quantity > 1) {
        fetch(`${API_URL}/cart/${item.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        })
          .then((response) => response.json())
          .then((item) => {
            const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
            Vue.set(this.cart, itemIdx, item);
          });
      } else {
        fetch(`${API_URL}/cart/${item.id}`, {
          method: 'DELETE',
        })
          .then(() => {
            this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
          });
      }
    },
    handleSearchClick(query) {
      this.filterValue = query;
    },
    handleBuyClick(item) {
      const cartItem = this.cart.find((entry) => entry.id === item.id);
      if (cartItem) {
        // товар в корзине уже есть, нужно увеличить количество
        fetch(`${API_URL}/cart/${item.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
        })
          .then((response) => response.json())
          .then((item) => {
            const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
            Vue.set(this.cart, itemIdx, item);
          });
      } else {
        // товара в корзине еще нет, нужно добавить
        fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...item, quantity: 1 })
        })
          .then((response) => response.json())
          .then((item) => {
            this.cart.push(item);
          });
      }
    }
  }
});*/


const API_URL = 'http://localhost:3000';

Vue.component('product-item', {
  props: ['item'],
  template: `
      <div class="feturedItems">
        <a href="product.html" class="feturedItemsLink">
          <div class="feturedImg" :style="styleObject"></div>
          <div class="feturedPrice">
              <h2 class="feturedName">{{item.name}}</h2>
              <h3 class="feturedCost">{{item.price}}</h3>
          </div>
        </a>
        <a href="product.html" class="feturedItemsLink2">
          <div class="feturedHidden">
              <a href="#" class="fetureHiddenBye"><img src="img/basket-white.svg" alt="basketwight">
                  <p>Add to cart</p>
              </a>
          </div>
        </a>
    </div>
  `,
  data() {
    return {
      styleObject: {
        background: 'url({{item.src}})'
      }
    };
  },
  methods: {
    // handleBuyClick(item) {
    //   this.$emit('onBuy', item);
    // }
  }
});

Vue.component('products', {
  props: [''],
  methods: {
    // handleBuyClick(item) {
    //   this.$emit('onbuy', item);
    // },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {

  },
  mounted() {
    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then((items) => {
        this.items = items;
      });
  },
  template: `
    <div class="goods">
      <product-item v-for="entry in items" :item="entry"></product-item>
    </div>
  `,
});

const app = new Vue({
  el: '#app',
  data: {
    cart: [],
  },
  mounted() {
    fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;
      });
  },
  methods: {

  }
});