let cart = 0;

const hero = document.getElementById("hero-section");
const why = document.getElementById("why-section");
const trending = document.getElementById("trending-section");
const productsSection = document.getElementById("products-section");

const trendingContainer = document.getElementById("trending-container");
const productContainer = document.getElementById("product-container");
const categoriesDiv = document.getElementById("categories");
const cartCount = document.getElementById("cart-count");

//Home to Product
function showHome() {
  hero.classList.remove("hidden");
  why.classList.remove("hidden");
  trending.classList.remove("hidden");
  productsSection.classList.add("hidden");

  document.getElementById("nav-home").classList.add("text-indigo-600");
  document.getElementById("nav-products").classList.remove("text-indigo-600");
}
//show product function
function showProducts() {
  hero.classList.add("hidden");
  why.classList.add("hidden");
  trending.classList.add("hidden");
  productsSection.classList.remove("hidden");

  document.getElementById("nav-products").classList.add("text-indigo-600");
  document.getElementById("nav-home").classList.remove("text-indigo-600");
}

async function loadTrending() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  const top = data.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);

  trendingContainer.innerHTML = "";
  top.forEach((p) => (trendingContainer.innerHTML += createCard(p)));
}

async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  displayProducts(data);
}

async function loadCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const data = await res.json();

  categoriesDiv.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "btn btn-sm btn-primary";
  allBtn.innerText = "All";
  allBtn.addEventListener("click", loadProducts);
  categoriesDiv.appendChild(allBtn);

  data.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline";
    btn.innerText = cat;

    btn.addEventListener("click", () => {
      loadByCategory(cat);
    });

    categoriesDiv.appendChild(btn);
  });
}

async function loadByCategory(category) {
  const res = await fetch(
    `https://fakestoreapi.com/products/category/${category}`,
  );
  const data = await res.json();
  displayProducts(data);
}

function displayProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((p) => (productContainer.innerHTML += createCard(p)));
}

function createCard(p) {
  return `
  <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
    <img src="${p.image}" class="h-52 mx-auto object-contain">

    <div class="mt-4">
      <span class="text-xs bg-gray-200 px-2 py-1 rounded">
        ${p.category}
      </span>

      <h3 class="font-semibold mt-3 text-sm">
        ${p.title.substring(0, 45)}...
      </h3>

      <div class="flex justify-between items-center mt-3">
        <span class="font-bold">$${p.price}</span>
        <span class="text-sm">⭐ ${p.rating.rate}</span>
      </div>

      <div class="flex gap-2 mt-4">
        <button onclick="showDetails(${p.id})"
          class="flex-1 border py-1 rounded text-sm">
          Details
        </button>

        <button onclick="addToCart()"
          class="flex-1 bg-indigo-600 text-white py-1 rounded text-sm">
          Add
        </button>
      </div>
    </div>
  </div>
  `;
}

async function showDetails(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const p = await res.json();

  document.getElementById("modal-title").innerText = p.title;
  document.getElementById("modal-description").innerText = p.description;
  document.getElementById("modal-price").innerText = p.price;
  document.getElementById("modal-rating").innerText = p.rating.rate;
  document.getElementById("modal-image").src = p.image;

  document.getElementById("productModal").showModal();
}

function addToCart() {
  cart++;
  cartCount.innerText = cart;
}

loadTrending();
loadProducts();
loadCategories();
