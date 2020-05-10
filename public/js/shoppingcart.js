const API_URL = 'http://localhost:3000';

Vue.component('product-cart', {
    props: ['item'],
    template: `
    <div class="productSC">
        <a :href="href" class="productDetails">
            <div class="productDetailsWrap">
                <div class="productDetailsImg" :style="background"></div>
                <div class="productName">
                    <h3>{{item.name}}</h3>
                    Color:<span>{{item.color}}</span><br>
                    Size:<span>{{item.size}}</span>
                </div>
            </div>
        </a>
        <div class="unitePrice">
            \${{item.price}}
        </div>
        <div class="quantity">
            <input type="number" class="quantityBox" @change="changeQuantity(item)" v-model.number="item.quantity">
        </div>
        <div class="shipping">
            FREE
        </div>
        <div class="subtotal">
            \${{item.price * item.quantity}}
        </div>
        <div class="action" @click.prevent="handleDeleteClick(item)">
            <i class="fas fa-times-circle"></i>
        </div>
    </div>   
    `,
    data() {
        return {
            href: '',
        };
    },
    computed: {
        background() {
            if (this.item.src) {
                return {
                    backgroundImage: 'url(' + this.item.src + ')'
                }
            } else {
                return {
                    backgroundImage: ' url(img/noimg.jpg) repeat scroll 50% 50%'
                }
            }
        },
    },
    mounted() {
        this.href = API_URL + '/singlepage.html?id=' + this.item.id;
    },
    methods: {
        handleDeleteClick(item) {
            this.$emit('delete', item);
        },
        changeQuantity(item) {
            fetch(`${API_URL}/cart/${item.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: this.item.quantity
                }),
            })
        }
    }
});

Vue.component('products', {
    props: ['cart'],
    methods: {
        handleDeleteClick(item) {
            this.$emit('delete', item);
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
    mounted() {},
    template: `
         <div>
           <product-cart v-for="entry in cart" :item="entry" @delete="handleDeleteClick"></product-cart>
         </div>
    `,
});

// -------------------------------

Vue.component('cart', {
    props: ['cart', 'showCart'],
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
    data() {
        return {
            show: true,
        };
    },
    mounted() {},
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        },
    },
    methods: {
        handleDeleteClick(item) {
            this.$emit('delete', item);
        },
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

// --------------------------------------

const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        show: false,
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
        },
    },
    methods: {
        quote() {
            this.show = !this.show;
        },
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
                            size: item.size.toLowerCase(),
                            quantity: 1
                        })
                    })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart.push(item);
                    });
            }
        },
        deleteAll() {
            for (i of this.cart) {
                fetch(`${API_URL}/cart/${i.id}`, {
                    method: 'DELETE',
                })
            };
            this.cart = []
        }
    }
});