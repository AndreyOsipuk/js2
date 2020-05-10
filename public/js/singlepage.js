const API_URL = 'http://localhost:3000';
const id = +window.location.search.split('=')[1];


Vue.component('product-item', {
    props: ['item'],
    template: `
    <div class="product">
        <a :href="href">
            <div class="productImg" :style="background"></div>
            <div class="productPrice">
                <h2 class="productName">{{item.name}}</h2>
                <h3 class="productCost">\${{item.price}}</h3>
            </div>
            <div class="hideLink" @click.prevent="handleBuyClickProduct(item)">
                <img src="img/basket-white.svg" alt="basketwight">
                <p>Add to cart</p>
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
        handleBuyClickProduct(item) {
            this.$emit('onBuy', item);
        },
    }
});

Vue.component('products', {
    props: [],
    methods: {
        handleBuyClickProduct(item) {
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
                this.items = items.splice(0, 4);
            });
    },
    template: `
         <div class="productLine">
           <product-item v-for="entry in items" :item="entry" @onBuy="handleBuyClickProduct"></product-item>
         </div>
    `,
});


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
                            size: sizeOptionValue.toLowerCase()
                        })
                    })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart.push(item);
                    });
            }
        },
        handleBuyClickProduct(item) {
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