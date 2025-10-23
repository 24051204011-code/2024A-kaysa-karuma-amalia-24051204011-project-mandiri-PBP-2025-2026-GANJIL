

const PRODUCTS = [
  { id: 'P1', title: 'P1', price: 25000, img: 'foto1.png' },
  { id: 'P2', title: 'P2', price: 30000, img: 'foto2.png' },
  { id: 'P3', title: 'P3', price: 23000, img: 'foto3.png' },
  { id: 'P4', title: 'P4', price: 24000, img: 'foto4.png' },
  { id: 'P5', title: 'P5', price: 24000, img: 'foto5.png' },
  { id: 'P6', title: 'P6', price: 26000, img: 'foto6.png' },
  { id: 'P7', title: 'P7', price: 20000, img: 'foto7.png' },
  { id: 'P8', title: 'P8', price: 22000, img: 'foto8.png' },
  { id: 'P9', title: 'P9', price: 25000, img: 'foto9.png' },
  { id: 'P10', title: 'P10', price: 27000, img: 'foto10.png' }
];


if (document.getElementById("produk-container")) {
  const container = document.getElementById("produk-container");
  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded-xl p-4 text-center hover:shadow-xl transition";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="rounded-xl mx-auto mb-3 h-40 w-auto">
      <h3 class="text-pink-700 font-bold mb-1">${p.title}</h3>
      <p class="text-gray-500 mb-3">Rp ${p.price.toLocaleString()}</p>
      <div class="flex justify-center gap-2">
        <button class="bg-pink-400 hover:bg-pink-500 text-white px-3 py-1 rounded-lg" onclick="addToCart('${p.id}')">🛒 Tambah</button>
        <button class="bg-pink-300 hover:bg-pink-400 text-white px-3 py-1 rounded-lg" onclick="buyNow('${p.id}')">❤ Beli</button>
      </div>`;
    container.appendChild(card);
  });
}


function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(id) {
  let cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  alert("✅ Produk " + id + " ditambahkan ke keranjang!");
}

function buyNow(id) {
  saveCart([{ id, qty: 1 }]);
  window.location.href = "contact.html";
}

if (document.getElementById("cart-table")) {
  const table = document.getElementById("cart-table");
  const cart = getCart();
  let total = 0;

  if (cart.length === 0) {
    table.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">Keranjang kosong 🛒</td></tr>`;
  } else {
    cart.forEach((item, i) => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      if (!p) return; 
      const sub = p.price * item.qty;
      total += sub;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-4 py-2 text-center"><input type="checkbox" class="item-checkbox" value="${item.id}"></td>
        <td class="border px-4 py-2 text-center">${i + 1}</td>
        <td class="border px-4 py-2 text-center">${p.title}</td>
        <td class="border px-4 py-2 text-center">${item.qty}</td>
        <td class="border px-4 py-2 text-center">Rp ${sub.toLocaleString()}</td>`;
      table.appendChild(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
      <td colspan="4" class="border px-4 py-2 font-bold text-right">Total</td>
      <td class="border px-4 py-2 font-bold text-center text-pink-700">Rp ${total.toLocaleString()}</td>`;
    table.appendChild(totalRow);
  }

  
  const hapusBtn = document.getElementById("hapusDipilih");
  if (hapusBtn) {
    hapusBtn.addEventListener("click", () => {
      const selected = Array.from(document.querySelectorAll(".item-checkbox:checked")).map(cb => cb.value);
      if (!selected.length) return alert("Pilih produk yang ingin dihapus!");
      let newCart = getCart().filter(it => !selected.includes(it.id));
      saveCart(newCart);
      location.reload();
    });
  }

  
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
      e.preventDefault();
      const namaEl = document.getElementById("nama");
      const alamatEl = document.getElementById("alamat");
      const hpEl = document.getElementById("hp");
      if (!namaEl || !alamatEl || !hpEl) return alert("Form input tidak lengkap di HTML.");

      const nama = namaEl.value.trim();
      const alamat = alamatEl.value.trim();
      const hp = hpEl.value.trim();
      if (!nama || !alamat || !hp) return alert("Isi semua data pembeli!");

      const kode = "PG" + Date.now();
      const produkList = cart.map(c => c.id).join(", ");
      const pesan = `Halo saya ${nama} dengan kode pembelian ${kode}, ingin membayar produk ${produkList}.`;
      const noWa = "6281246521518";

      const link = `https://api.whatsapp.com/send?phone=${noWa}&text=${encodeURIComponent(pesan)}`;

      const hasilEl = document.getElementById("hasil");
      if (hasilEl) {
        hasilEl.innerHTML = `
          <div class="mt-6 bg-pink-100 p-4 rounded-xl">
            <p><b>Nama:</b> ${nama}</p>
            <p><b>Alamat:</b> ${alamat}</p>
            <p><b>HP:</b> ${hp}</p>
            <p><b>Kode Pembelian:</b> ${kode}</p>
            <p><b>Produk:</b> ${produkList}</p>
            <a href="${link}" target="_blank" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg inline-block mt-3">
              💬 Hubungi via WhatsApp
            </a>
          </div>`;
      } else {
        
        window.open(link, "_blank");
      }

      localStorage.removeItem("cart");
    });
  }
}
