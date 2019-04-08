const API_URL = 'http://localhost:3000';

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
      if (this.query) {
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
  methods: {
    handleDeleteClick(item) {
      this.$emit('ondel', item);
    },
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  template: ` 
        <div class="cart">
            <item-cart v-for="entry in cart" :itemCart="entry" @onDel="handleDeleteClick"></item-cart>
        </div>
        `,
});

Vue.component('item-cart', {
  props: ['itemCart'],
  template: `
    <div class="itemCart">
      <h4>{{ itemCart.name }} ({{ itemCart.quantity }})
      <button @click.prevent="handleDeleteClick(itemCart)">x</button></h4>
    </div>
  `,
  methods: {
    handleDeleteClick(item) {
      this.$emit('onDel', item);
    }
  }
});

Vue.component('search-product', {
  methods: {
    handleSearchClick(searchQuery) {
      this.$emit('search', searchQuery);
    }
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  template: `<div>
              <input type="text" v-model="searchQuery" class="search-text" />
              <button class="search-button" @click.prevent="handleSearchClick(searchQuery)">Поиск</button>
            </div>
            `,

});

const app = new Vue({
  el: '#app',
  data: {
    filterValue: '',
    cart: [],
  },
  mounted() {
    fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;
      });
  },
  computed: {
    total() {
      return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
  },
  methods: {
    handleDeleteClick(item) {
      if (item.quantity > 1) {
        fetch(`${API_URL}/cart/${item.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: item.quantity - 1
            }),
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
    handleSearchClick(string) {
      this.filterValue = string;
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
            body: JSON.stringify({
              quantity: cartItem.quantity + 1
            }),
          })
          .then((response) => response.json())
          .then((item) => {
            const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
            Vue.set(this.cart, itemIdx, item);
          })
          .catch( (error) => {
              console.log(error);
          });
          
      } else {
        // товара в корзине еще нет, нужно добавить
        fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...item,
              quantity: 1
            })
          })
          .then((response) => response.json())
          .then((item) => {
            this.cart.push(item);
          });
      }
    }
  }
});