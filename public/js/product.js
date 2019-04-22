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
    <div class="product">
        <a :href="href">
            <div class="productImg" :style="background"></div>
            <div class="productPrice">
                <h2 class="productName">{{item.name}}</h2>
                <h3 class="productCost">\${{item.price}}</h3>
            </div>
            <div class="hideLink" @click.prevent="handleBuyClick(item)">
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

        }
        this.href = API_URL + '/singlepage.html?id=' + this.item.id
    },
    methods: {
        handleBuyClick(item) {
            this.$emit('onBuy', item);
        }
    }
});

Vue.component('products', {
    props: ['size', 'sort'],
    methods: {
        handleBuyClick(item) {
            this.$emit('onbuy', item);
        }
    },
    data() {
        return {
            items: [],
        };
    },
    computed: {
        filteredItems() {
            if (this.size.length === 0 && this.sort === '') {
                return this.items;
            } else {
                let product;
                if (this.size.length !== 0) {
                    product = (product ? product : this.items).filter((item) => {
                        return this.size.includes(item.size ? item.size.toLowerCase() : item.size);
                    });
                }
                if (this.sort !== '') {
                    if (this.sort === 'Name') {
                        product = (product ? product : this.items).sort(function (a, b) {
                            if (a.name > b.name) {
                                return 1;
                            }
                            if (a.name < b.name) {
                                return -1;
                            }
                            return 0;
                        });
                    } else if (this.sort === 'Cost') {
                        product = (product ? product : this.items).sort(function (a, b) {
                            if (a.price > b.price) {
                                return 1;
                            }
                            if (a.price < b.price) {
                                return -1;
                            }
                            return 0;
                        });
                    }
                }
                return product;
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
       <div class="productWrap"">
         <product-item v-for="entry in filteredItems" :item="entry" @onBuy="handleBuyClick"></product-item>
       </div>
  `,
});



const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        size: [],
        sort: '',
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
            console.log('delete');
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
        },
        checkSize(e) {
            let size;
            if (e.target.tagName === 'INPUT') {
                size = e.target.nextElementSibling.innerHTML;
                if (this.size.indexOf(size) === -1) {
                    this.size.push(size);
                } else {
                    this.size = this.size.filter((cartItem) => cartItem !== size);
                    //еще способ
                    // this.size.splice(this.size.indexOf(size),1);
                }
                // console.log(this.size);
            }
        },

        sortBy(e) {
            if (e.target.tagName === 'OPTION') {
                this.sort = e.target.value
            }

        }
    }
});