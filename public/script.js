function sendRequest(url) {
    return fetch(url).then((response) => response.json());
}

const API_URL = 'http://localhost:3000';

class Item {
    constructor(id, name, price, quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    render() {
        return `<div class="product">
                    <div class="product_img" style="background-image: url(img/feturedItems${this.id}.jpg)"></div>
                    <div class="product_price">
                        <h2 class="product_name">${this.name}</h2>
                        <h3 class="product_cost">$${this.price}</h3>
                    </div>
                    <div class="product_hidelink" id="costlink" data-id="${this.id}">
                        <img src="img/basket-white.svg" alt="basketwight" id="costlink" data-id="${this.id}"">
                        <p id="costlink" data-id="${this.id}">Add to cart</p>
                    </div>
                </div>`
    }
    renderCart() {
        const sum = this.price * this.quantity;
        return `<div class="productCart">
                    <h2 class="productCart_name">${this.name}</h2>
                    <h3 class="productCart_cost">$${this.price}</h3>
                    <p>
                        <button class="minusProduct" data-id="${this.id}">-</button>
                        <span class="quaintity" data-id="${this.id}">${this.quantity}</span>
                        <button class="plusProduct" data-id="${this.id}">+</button>
                    </p>
                    <h3 class="sumProduct">Сумма ${sum}</h3>

                    <button class="removeProduct" data-id="${this.id}">Убрать</button>
                </div>`
    }
}

class ItemsList {
    constructor() {
        this.items = [];
        this.itemsCart = [];
    }

    fetchItems() {
        return sendRequest(`${API_URL}/products`).then((items) => {
            this.items = items.map(item => new Item(item.id, item.name, item.price));
            this.filteredItems = this.items;
        });
    }
    fetchItemsCart() {
        return sendRequest(`${API_URL}/cart`).then((itemsCart) => {
            this.itemsCart = itemsCart.map(item => new Item(item.id, item.name, item.price, item.quantity));
        });
    }

    filterItems(query) {
        const regexp = new RegExp(query, 'i');
        this.filteredItems = this.items.filter((item) => regexp.test(item.name))
    }

    total() {
        return this.items.reduce((acc, item) => acc + item.price, 0);
    }

    render() {
        const itemsHtmls = this.filteredItems.map(item => item.render());
        return itemsHtmls.join('');
    }

    renderCart() {
        const itemsHtmlsCart = this.itemsCart.map(itemCart => itemCart.renderCart());
        return itemsHtmlsCart.join('');
    }
}

const items = new ItemsList();
items.fetchItems().then(() => {
    document.querySelector('.goods').innerHTML = items.render();
});

const $searchText = document.querySelector('.search-text');

$searchText.addEventListener('input', () => {
    items.filterItems($searchText.value);
    document.querySelector('.goods').innerHTML = items.render();
});

items.fetchItemsCart().then(() => {
    document.querySelector('.cart').innerHTML = items.renderCart();
}).then(() => {
    let sum = 0;
    for (elem of items.itemsCart) {
        sum += elem.price * elem.quantity;
    }
    document.querySelector('.sumAll').innerHTML = `Общая сумма ${sum}`;
});

document.querySelector('.goods').addEventListener('click', (event) => {
    if (event.target.id === 'costlink') {
        const id = event.target.dataset.id;
        for (elem of items.items) {
            if (elem.id === +id) {
                fetch(`${API_URL}/cart/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "id": elem.id,
                            "name": elem.name,
                            "price": elem.price,
                            "quantity": 1
                        }),
                    })
                    .then(() => {
                        items.fetchItemsCart().then(() => {
                            document.querySelector('.cart').innerHTML = items.renderCart();
                            let sum = 0;
                            for (elem of items.itemsCart) {
                                sum += elem.price * elem.quantity;
                            }
                            document.querySelector('.sumAll').innerHTML = `Общая сумма ${sum}`;
                        });
                    });
            };
        }
    }
});

document.querySelector('.cart').addEventListener('click', (event) => {
    if (event.target.classList.contains('removeProduct')) {
        const id = event.target.dataset.id;
        fetch(`${API_URL}/cart/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                document.querySelector('.cart').removeChild(event.target.parentElement);
                items.fetchItemsCart().then(() => {
                    let sum = 0;
                    for (elem of items.itemsCart) {
                        sum += elem.price * elem.quantity;
                    }
                    document.querySelector('.sumAll').innerHTML = `Общая сумма ${sum}`;
                });
            });
    };
    if (event.target.classList.contains('plusProduct')) {
        const id = event.target.dataset.id;
        let quantity = +event.target.previousElementSibling.innerHTML + 1;
        fetch(`${API_URL}/cart/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "quantity": quantity,
                }),
            })
            .then(() => {
                event.target.previousElementSibling.innerHTML = quantity;
                items.fetchItemsCart().then(() => {
                    let sum = 0;
                    for (elem of items.itemsCart) {
                        sum += elem.price * elem.quantity;
                    }
                    let sumProduct = +event.target.parentElement.parentElement.querySelector('.productCart_cost').innerHTML.slice(1) * quantity;
                    event.target.parentElement.parentElement.querySelector('.sumProduct').innerHTML = `Сумма ${sumProduct}`;
                    document.querySelector('.sumAll').innerHTML = `Общая сумма ${sum}`;
                });
            });

    };
    if (event.target.classList.contains('minusProduct')) {
        let quantity = +event.target.nextElementSibling.innerHTML - 1;
        const id = event.target.dataset.id;
        if (quantity === 0) {
            fetch(`${API_URL}/cart/${id}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    event.target.parentElement.parentElement.remove();
                    items.fetchItemsCart().then(() => {
                        let sum = 0;
                        for (elem of items.itemsCart) {
                            sum += elem.price * elem.quantity;
                        }
                        document.querySelector('.sumAll').innerHTML = `Общая сумма ${sum}`;
                    });

                });
        } else {
            fetch(`${API_URL}/cart/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "quantity": quantity,
                    }),
                })
                .then(() => {
                    event.target.nextElementSibling.innerHTML = quantity;
                    items.fetchItemsCart().then(() => {
                        let sum = 0;
                        for (elem of items.itemsCart) {
                            sum += elem.price * elem.quantity;
                        }
                        let sumProduct = +event.target.parentElement.parentElement.querySelector('.productCart_cost').innerHTML.slice(1) * quantity;
                        event.target.parentElement.parentElement.querySelector('.sumProduct').innerHTML = `Сумма ${sumProduct}`;
                        document.querySelector('.sumAll').innerHTML = `Общая сумма ${sum}`;
                    });
                });
        }
    };
});