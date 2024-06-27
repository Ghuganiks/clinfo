let cartActive = false;
let bookletPage = 1;
let cartItems = [];
let ids = 0;

var localIds = localStorage.getItem("ids");
if (localIds != null) {
  ids = parseInt(localIds);
}
var localCart = localStorage.getItem("cart");
if (localCart != null) {
  cartItems = JSON.parse(localCart);
}

let cartTotal = 0;
let cartQuantity = 0;

function toggleCart() {
  const container = document.getElementById("container");
  const cartButton = document.getElementById("cart-button");
  let cart = document.getElementById("cart");
  if (window.screen.width <= 800) {
    cart = document.getElementById("cart-modal");
  }
  const cartContainer = document.getElementById("cart-container");

  if (cartActive) {
    cartButton.classList.remove("active");
    cart.classList.remove("shown");
    cartActive = false;
    if (window.screen.width > 800) {
      cartContainer.classList.remove("shown");
      container.style.width = "";
    }
  } else {
    cartButton.classList.add("active");
    cart.classList.add("shown");
    cartActive = true;
    if (window.screen.width > 800) {
      cartContainer.classList.add("shown");
      container.style.setProperty("width", "calc(100dvw + 470px)");
    }
  }
}

function changeBookletImage() {
  const getPath = (number) => `./images/booklet/${number}.png`;
  const booklet = document.getElementById("booklet");
  bookletPage++;
  if (bookletPage > 5) bookletPage = 1;
  booklet.src = getPath(bookletPage);
}

function addNewToCart(name, tags, price) {
  const id = ids;
  ids++;
  localStorage.setItem("ids", JSON.stringify(ids));
  cartItems.push({ id, name, tags, price });
  addToCart(id, name, tags, price);
}

function updateTotalAndQuantity() {
  document.getElementById("cart-total").innerHTML = cartTotal;
  document.getElementById("cart-quantity").innerHTML = cartQuantity;

  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function addToCart(id, name, tags, price) {
  let cartItemsElement;
  if (window.screen.width <= 800) {
    cartItemsElement = document
      .getElementById("cart-modal")
      .getElementsByClassName("cart__items")[0];
  } else {
    cartItemsElement = document
      .getElementById("cart")
      .getElementsByClassName("cart__items")[0];
  }
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart__item");
  cartItem.innerHTML = `
        <span class="cart__item_name">${name}</span>
        <div class="cart__item_tags"></div>
        <span class="cart__item_price">${price}IC</span>
        <button class="cart__item_delete"><span class="material-symbols-outlined">close</span></button>
    `;

  const cartItemTags = cartItem.getElementsByClassName("cart__item_tags")[0];
  const cartItemDelete =
    cartItem.getElementsByClassName("cart__item_delete")[0];

  cartItem.addEventListener("mouseover", () => {
    cartItemDelete.classList.add("shown");
  });
  cartItem.addEventListener("mouseout", () => {
    cartItemDelete.classList.remove("shown");
  });
  tags.forEach((tag) => {
    const tagElement = document.createElement("div");
    tagElement.classList.add("cart__item_tag");
    tagElement.innerHTML = tag;
    cartItemTags.appendChild(tagElement);
  });
  cartTotal += price;
  cartQuantity++;
  cartItemsElement.appendChild(cartItem);
  updateTotalAndQuantity();

  localStorage.setItem("cart", JSON.stringify(cartItems));
  cartItemDelete.onclick = () => {
    cartTotal -= price;
    cartQuantity--;
    cartItems = cartItems.filter((item) => item.id != id);
    cartItemsElement.removeChild(cartItem);
    updateTotalAndQuantity();
  };
}

function enroll() {
  const enrollModal = document.getElementById("enroll-modal");
  const enrollModalClose = enrollModal.getElementsByClassName("later")[0];
  enrollModal.classList.add("shown");
  enrollModalClose.onclick = () => {
    enrollModal.classList.remove("shown");
  };
}

function pay() {
  const paymentModal = document.getElementById("payment-modal");
  const paymentModalClose = document.getElementById("payment-modal");
  cartItems = [];
  localStorage.setItem("cart", JSON.stringify(cartItems));
  cartTotal = 0;
  cartQuantity = 0;
  toggleCart();
  paymentModal.classList.add("shown");
  paymentModalClose.onclick = () => {
    paymentModal.classList.remove("shown");
  };
  updateTotalAndQuantity();
}

window.onload = () => {
  cartItems.forEach(({ id, name, tags, price }) => {
    addToCart(id, name, tags, price);
  });

  const products = document.querySelectorAll("div.product");

  products.forEach((product) => {
    const productCartButton =
      product.getElementsByClassName("product__button")[0];
    product.addEventListener("mouseover", () => {
      productCartButton.classList.add("shown");
    });
    product.addEventListener("mouseleave", () => {
      productCartButton.classList.remove("shown");
    });
  });

  const modal = document.getElementById("modal-container");
  const modalImage = document.getElementById("modal-image");
  const posters = document.querySelectorAll("button.poster");
  if (modal) {
    modal.onclick = () => {
      modal.classList.remove("shown");
    };

    posters.forEach((poster) => {
      poster.onclick = () => {
        modalImage.src = poster.getElementsByTagName("img")[0].src;
        modal.classList.add("shown");
      };
    });
  }
};
