/* =====================================================
   AGRO-MOTOR
   MENÚ + BUSCADOR + CARRITO + WHATSAPP
===================================================== */

const WHATSAPP = "593968734687";

let cart = JSON.parse(localStorage.getItem("agromotor_cart")) || [];


/* =====================================================
   MENÚ
===================================================== */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle?.addEventListener("click", () => {

  mainNav.classList.toggle("open");

});


document.querySelectorAll("#mainNav a").forEach(link => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("open");

  });

});


/* =====================================================
   BUSCADOR
===================================================== */

const searchInput = document.getElementById("searchInput");
const cards = [...document.querySelectorAll(".product-card")];
const noResults = document.getElementById("noResults");

searchInput?.addEventListener("input", () => {

  const query = searchInput.value
    .toLowerCase()
    .trim();

  let visible = 0;

  cards.forEach(card => {

    const content =
      (
        card.dataset.name +
        " " +
        card.innerText
      ).toLowerCase();

    const match = content.includes(query);

    card.style.display = match ? "" : "none";

    if(match){
      visible++;
    }

  });

  noResults.style.display =
    visible === 0 ? "block" : "none";

});


/* =====================================================
   ELEMENTOS DEL CARRITO
===================================================== */

const cartPanel =
  document.getElementById("cartPanel");

const cartOverlay =
  document.getElementById("cartOverlay");

const openCart =
  document.getElementById("openCart");

const closeCart =
  document.getElementById("closeCart");

const cartItems =
  document.getElementById("cartItems");

const cartCount =
  document.getElementById("cartCount");

const cartItemsCount =
  document.getElementById("cartItemsCount");

const checkoutWhatsapp =
  document.getElementById("checkoutWhatsapp");

const continueShopping =
  document.getElementById("continueShopping");


/* =====================================================
   ABRIR CARRITO
===================================================== */

function openCartPanel(){

  cartPanel.classList.add("active");

  cartOverlay.classList.add("active");

  document.body.classList.add("cart-open");

}


/* =====================================================
   CERRAR CARRITO
===================================================== */

function closeCartPanel(){

  cartPanel.classList.remove("active");

  cartOverlay.classList.remove("active");

  document.body.classList.remove("cart-open");

}


openCart?.addEventListener(
  "click",
  openCartPanel
);

closeCart?.addEventListener(
  "click",
  closeCartPanel
);

cartOverlay?.addEventListener(
  "click",
  closeCartPanel
);

continueShopping?.addEventListener(
  "click",
  () => {

    closeCartPanel();

    document
      .getElementById("productos")
      ?.scrollIntoView({
        behavior:"smooth"
      });

  }
);


/* =====================================================
   AGREGAR PRODUCTOS
===================================================== */

document.querySelectorAll(".add-cart").forEach(button => {

  button.addEventListener("click", () => {

    const card =
      button.closest(".product-card");

    const product = {

      id: card.dataset.product,

      name: card.dataset.product,

      image: card.dataset.image,

      quantity: 1

    };


    const existing =
      cart.find(item => item.id === product.id);


    if(existing){

      existing.quantity++;

    }else{

      cart.push(product);

    }


    saveCart();

    renderCart();

    openCartPanel();

  });

});


/* =====================================================
   GUARDAR CARRITO
===================================================== */

function saveCart(){

  localStorage.setItem(
    "agromotor_cart",
    JSON.stringify(cart)
  );

}


/* =====================================================
   RENDER CARRITO
===================================================== */

function renderCart(){

  const totalProducts =
    cart.reduce(
      (total,item) =>
        total + item.quantity,
      0
    );


  cartCount.textContent =
    totalProducts;

  cartItemsCount.textContent =
    totalProducts;


  if(cart.length === 0){

    cartItems.innerHTML = `

      <div class="empty-cart">

        <div>🛒</div>

        <strong>
          Tu carrito está vacío
        </strong>

        <p>
          Agrega productos para preparar tu pedido.
        </p>

        <button
          id="continueShopping2"
          class="btn btn-orange"
        >
          VER PRODUCTOS
        </button>

      </div>

    `;


    document
      .getElementById("continueShopping2")
      ?.addEventListener(
        "click",
        () => {

          closeCartPanel();

          document
            .getElementById("productos")
            ?.scrollIntoView({
              behavior:"smooth"
            });

        }
      );

    return;

  }


  cartItems.innerHTML = "";


  cart.forEach((item,index) => {

    const element =
      document.createElement("div");

    element.className =
      "cart-product";


    element.innerHTML = `

      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div>

        <div class="cart-product-name">
          ${item.name}
        </div>

        <small>
          Consultar precio
        </small>

        <div class="qty">

          <button
            onclick="changeQuantity(${index}, -1)"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            onclick="changeQuantity(${index}, 1)"
          >
            +
          </button>

        </div>

      </div>

      <button
        class="remove-product"
        onclick="removeProduct(${index})"
        title="Eliminar"
      >
        🗑
      </button>

    `;


    cartItems.appendChild(element);

  });

}


/* =====================================================
   CAMBIAR CANTIDAD
===================================================== */

function changeQuantity(index, amount){

  cart[index].quantity += amount;


  if(cart[index].quantity <= 0){

    cart.splice(index,1);

  }


  saveCart();

  renderCart();

}


/* =====================================================
   ELIMINAR PRODUCTO
===================================================== */

function removeProduct(index){

  cart.splice(index,1);

  saveCart();

  renderCart();

}


/* =====================================================
   FINALIZAR PEDIDO POR WHATSAPP
===================================================== */

checkoutWhatsapp?.addEventListener(
  "click",
  () => {

    if(cart.length === 0){

      alert(
        "Agrega al menos un producto al carrito."
      );

      return;

    }


    let message =
      "Hola AGRO-MOTOR, quiero realizar el siguiente pedido:%0A%0A";


    cart.forEach((item,index) => {

      message +=
        `${index + 1}. ${item.name} - Cantidad: ${item.quantity}%0A`;

    });


    message +=
      "%0APor favor, indíqueme disponibilidad y precio.";


    const url =
      `https://wa.me/${WHATSAPP}?text=${message}`;


    window.open(
      url,
      "_blank"
    );

  }
);


/* =====================================================
   AÑO
===================================================== */

const year =
  document.getElementById("year");

if(year){

  year.textContent =
    new Date().getFullYear();

}


/* =====================================================
   INICIAR
===================================================== */

renderCart();
