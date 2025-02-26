let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product, price) {
  if (!product || isNaN(price)) {
    console.error("Invalid product or price");
    return;
  }

  let item = cart.find((i) => i.product === product);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ product, price, quantity: 1 });
  }
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");

  if (!cartItems || !total) return;

  cartItems.innerHTML = "";
  let sum = 0;

  cart.forEach((item, index) => {
    if (!item.product || isNaN(item.price)) return;

    let li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      ${item.product} - $${item.price.toFixed(2)} 
      <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
      ${item.quantity}
      <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
      <span class="remove-btn" onclick="removeFromCart(${index})">&times;</span>
    `;
    cartItems.appendChild(li);
    sum += item.price * item.quantity;
  });

  total.textContent = sum.toFixed(2);
}

function changeQuantity(index, amount) {
  if (cart[index] && cart[index].quantity + amount > 0) {
    cart[index].quantity += amount;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1);
  }
  saveCart();
}

function openCart() {
  updateCart();
  document.getElementById("cartModal").style.display = "block";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function checkout() {
  if (cart.length === 0) {
    Swal.fire({
      title: "Oops!",
      text: "Your cart is empty!",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  Swal.fire({
    title: "Success!",
    text: "Checkout successful!",
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    cart = [];
    saveCart();
  });
}

window.onload = updateCart;
