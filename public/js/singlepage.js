const API_URL = 'http://localhost:3000';
const id = +window.location.search.split('=')[1];

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

const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        item: []
    },
    mounted() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });
        fetch(`${API_URL}/products/${id}`)
            .then(response => response.json())
            .then((item) => {
                this.item = item;
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
        handleBuyClick() {
            const colorOption = document.getElementsByClassName('choose color')[0].options.selectedIndex;
            const colorOptionValue = document.getElementsByClassName('choose color')[0].options[colorOption].text;
            const sizeOption = document.getElementsByClassName('choose size')[0].options.selectedIndex;
            const sizeOptionValue = document.getElementsByClassName('choose size')[0].options[sizeOption].text;
            const quantityValue = +document.getElementsByClassName('choose quantity')[0].value;
            const cartItem = this.cart.find((entry) => {
                if (entry.id_product === id &&
                    entry.size === sizeOptionValue &&
                    entry.color === colorOptionValue) {
                    return entry;
                }
            });
            if (cartItem) {
                fetch(`${API_URL}/cart/${cartItem.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            quantity: +cartItem.quantity + +quantityValue
                        }),
                    })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart[item.id - 1].quantity = item.quantity;
                    });
            } else {
                // товара в корзине еще нет, нужно добавить
                fetch(`${API_URL}/cart`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id_product: id,
                            name: this.item.name,
                            price: this.item.price,
                            src: this.item.src,
                            quantity: quantityValue,
                            color: colorOptionValue,
                            size: sizeOptionValue
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