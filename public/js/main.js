const API_URL = 'http://localhost:3000';

Vue.component('cart', {
  props: ['cart'],
  template: `
  <div class="cartHide">
      <cart-item v-for="entry in cart" :cart="entry" @delete="handleDeleteClick"></cart-item>
    <div class="cartTotal">
      <p>TOTAL</p>
      <p>\${{total}}</p>
    </div>
    <a href="checkout.html" class="checkOut">Chekout</a>
    <a href="ShoppingCart.html" class="goToCart">go to cart</a>
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

Vue.component('cart-item', {
  props: ['cart'],
  template: `
      <div class="cartGoods">
        <div class="goodsImg" :style="backgroundImg"></div>
        <div class="goodsName">
            <h2>{{cart.name}}</h2>
            <h3>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
            </h3>
            <p>{{cart.quantity}} x \${{cart.price}}</p>
        </div>
        <div class="goodsClose" @click.prevent="handleDeleteClick(cart)">
            <i class="fas fa-times-circle"></i>
        </div>
      </div>
  `,
  data() {
    return {
      src: ''
    };
  },
  mounted() {},
  computed: {
    backgroundImg() {
      if (this.cart.src) {
        return {
          backgroundImage: 'url(' + this.cart.src + ')'
        }
      } else {
        return {
          backgroundImage: 'url(img/noimg.jpg)'
        }
      }
    }
  },
  methods: {
    handleDeleteClick(item) {
      this.$emit('delete', item);
    }
  },
});

//------------------------------------------------------------

Vue.component('product-item', {
  props: ['item'],
  template: `
      <div class="feturedItems" >
      <a :href="href" class="feturedItemsLink">
        <div class="feturedImg" :style="background"></div>
        <div class="feturedPrice">
            <h2 class="feturedName">{{item.name}}</h2>
            <h3 class="feturedCost">\${{item.price}}</h3>
        </div>
      </a>
      <a :href="href" class="feturedItemsLink2">
        <div class="feturedHidden">
            <div class="fetureHiddenBye">
              <p @click.prevent.stop="handleBuyClick(item)">
              <img src="img/basket-white.svg" alt="basketwight">
              Add to cart
              </p>
            </div>
        </div>
      </a>
    </div>
  `,
  data() {
    return {
      background: '',
      href: ''
    };
  },
  mounted() {
    if (this.item.src) {
      this.background = 'background: url(' + this.item.src + ')'

    } else {
      this.background = 'background: url(img/noimg.jpg) repeat scroll 50% 50%'
    };
    this.href = API_URL + '/singlepage.html?id=' + this.item.id
  },
  methods: {
    handleBuyClick(item) {
      this.$emit('onBuy', item);
    },
  }
});

Vue.component('products', {
  props: [],
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
    // filteredItems() {
    // }
  },
  mounted() {
    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then((items) => {
        this.items = items;
      });
  },
  template: `
       <div class="contentMain3">
         <product-item v-for="entry in items" :item="entry" @onBuy="handleBuyClick"></product-item>
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
    handleBuyClick(item) {
      const cartItem = this.cart.find((entry) => {
        if (entry.id_product === item.id &&
          entry.size.toLowerCase() === item.size.toLowerCase() &&
          entry.color === item.color) {
          return entry;
        }
      });
      if (cartItem) {
        // товар в корзине уже есть, нужно увеличить количество
        fetch(`${API_URL}/cart/${cartItem.id}`, {
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
          });
      } else {
        // товара в корзине еще нет, нужно добавить
        fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // ...item,
              id_product: item.id,
              name: item.name,
              price: item.price,
              src: item.src,
              color: item.color,
              size: item.size ? item.size.toLowerCase() : 'xxs',
              quantity: 1
            })
          })
          .then((response) => response.json())
          .then((item) => {
            this.cart.push(item);
          });
      }
    },

  }
});