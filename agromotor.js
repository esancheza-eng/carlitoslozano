/* =====================================================
   AGRO-MOTOR · Productos, buscador, carrito y WhatsApp
===================================================== */

(function () {

	const WHATSAPP = "593968734687";

	/* ---------- Productos (edita aquí para agregar o cambiar) ---------- */
	const PRODUCTOS = [
		{ nombre: "Desmalezadoras",          tag: "LIMPIEZA",   img: "images/desbrozadora.jpg",           desc: "Equipos ideales para limpieza de terrenos y maleza.",     buscar: "desmalezadora desbrozadora" },
		{ nombre: "Nebulizadora ECHO MB-580", tag: "FUMIGACIÓN", img: "images/echo-mb580.jpg",            desc: "Nebulizadoras y pulverizadoras para trabajos agrícolas.", buscar: "echo fumigadora" },
		{ nombre: "Equipos de corte",        tag: "CAMPO",      img: "images/desbrozadora-campo.jpg",     desc: "Mantenimiento de terrenos y áreas verdes.",               buscar: "desbrozadora campo" },
		{ nombre: "Motosierras Husqvarna",   tag: "FORESTAL",   img: "images/motosierra-husqvarna.jpg",   desc: "Equipos para poda, corte y trabajos forestales.",         buscar: "motosierra husqvarna" },
		{ nombre: "Motosierras STIHL",       tag: "FORESTAL",   img: "images/motosierra-stihl.jpg",       desc: "Herramientas para corte y trabajos exigentes.",           buscar: "motosierra stihl" },
		{ nombre: "Podadoras",               tag: "PODA",       img: "images/podadora.jpg",               desc: "Poda de árboles y mantenimiento en altura.",              buscar: "podadora altura" },
		{ nombre: "Bombas de riego",         tag: "RIEGO",      img: "images/bomba-riego.jpg",            desc: "Equipos para abastecimiento y riego de agua.",            buscar: "bomba agua riego" },
		{ nombre: "Nebulizadora Cifarelli",  tag: "FUMIGACIÓN", img: "images/nebulizadora-cifarelli.jpg", desc: "Equipos de aplicación para necesidades agrícolas.",       buscar: "cifarelli fumigadora" },
		{ nombre: "Accesorios y repuestos",  tag: "ACCESORIOS", img: "images/husqvarna-equipo.jpg",       desc: "Cadenas, repuestos, aceites, herramientas y más.",        buscar: "cadenas aceites repuestos" }
	];

	const $ = id => document.getElementById(id);

	/* ---------- Carrito guardado en el navegador ---------- */
	let cart = [];
	try { cart = JSON.parse(localStorage.getItem("agromotor_cart")) || []; } catch (e) { cart = []; }
	const guardar = () => { try { localStorage.setItem("agromotor_cart", JSON.stringify(cart)); } catch (e) {} };

	/* ---------- Pintar galería ---------- */
	$("productGrid").innerHTML = PRODUCTOS.map((p, i) => `
		<div class="col-4 col-6-narrow col-12-mobile product-col" data-search="${(p.nombre + " " + p.tag + " " + p.buscar).toLowerCase()}">
			<a class="product" data-i="${i}" role="button" tabindex="0">
				<img src="${p.img}" alt="${p.nombre}" loading="lazy" />
				<div class="info">
					<span class="tag">${p.tag}</span>
					<h3>${p.nombre}</h3>
					<p>${p.desc}</p>
					<span class="add">+ Agregar al pedido</span>
				</div>
			</a>
		</div>`).join("");

	$("productGrid").addEventListener("click", e => {
		const card = e.target.closest(".product");
		if (card) agregar(PRODUCTOS[card.dataset.i]);
	});

	/* ---------- Buscador ---------- */
	$("searchInput").addEventListener("input", e => {
		const q = e.target.value.toLowerCase().trim();
		let visibles = 0;
		document.querySelectorAll(".product-col").forEach(c => {
			const ok = c.dataset.search.includes(q);
			c.style.display = ok ? "" : "none";
			if (ok) visibles++;
		});
		$("noResults").style.display = visibles ? "none" : "block";
	});

	/* ---------- Funciones del carrito ---------- */
	function agregar(p) {
		const item = cart.find(x => x.nombre === p.nombre);
		item ? item.cant++ : cart.push({ nombre: p.nombre, img: p.img, cant: 1 });
		guardar(); pintar(); aviso("✓ " + p.nombre + " agregado");
	}

	function pintar() {
		const total = cart.reduce((s, x) => s + x.cant, 0);
		$("cartCount").textContent = total;
		$("cartItemsCount").textContent = total;
		$("checkoutWhatsapp").disabled = !cart.length;

		if (!cart.length) {
			$("cartItems").innerHTML = `<div class="empty"><strong>Tu pedido está vacío</strong><br />Agrega productos desde la galería.</div>`;
			return;
		}
		$("cartItems").innerHTML = cart.map((x, i) => `
			<div class="cart-item">
				<img src="${x.img}" alt="" />
				<div class="n">${x.nombre}<br /><button class="remove" data-del="${i}">Quitar</button></div>
				<div class="qty"><button data-menos="${i}">−</button><span>${x.cant}</span><button data-mas="${i}">+</button></div>
			</div>`).join("");
	}

	$("cartItems").addEventListener("click", e => {
		const d = e.target.dataset;
		if (d.mas !== undefined) cart[d.mas].cant++;
		else if (d.menos !== undefined) { cart[d.menos].cant--; if (cart[d.menos].cant < 1) cart.splice(d.menos, 1); }
		else if (d.del !== undefined) cart.splice(d.del, 1);
		else return;
		guardar(); pintar();
	});

	$("checkoutWhatsapp").addEventListener("click", () => {
		if (!cart.length) return;
		const lineas = cart.map(x => `• ${x.cant} x ${x.nombre}`).join("\n");
		const msg = `Hola AGRO-MOTOR 👋\nQuiero cotizar este pedido:\n\n${lineas}\n\n¿Me confirman precios y disponibilidad? Gracias.`;
		window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
	});

	/* ---------- Abrir / cerrar carrito ---------- */
	const abrir = () => { $("cartPanel").classList.add("active"); $("cartOverlay").classList.add("active"); };
	const cerrar = () => { $("cartPanel").classList.remove("active"); $("cartOverlay").classList.remove("active"); };
	$("openCart").onclick = abrir;
	$("closeCart").onclick = cerrar;
	$("cartOverlay").onclick = cerrar;

	/* ---------- Formulario de contacto → WhatsApp ---------- */
	$("contactForm").addEventListener("submit", e => {
		e.preventDefault();
		const v = id => $(id).value.trim();
		const msg = `Hola AGRO-MOTOR, soy ${v("cNombre")}${v("cCiudad") ? " de " + v("cCiudad") : ""}.\nMotivo: ${v("cMotivo")}\n\n${v("cMensaje")}`;
		window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
	});

	/* ---------- Menú móvil y barra fija ---------- */
	const menu = $("menu");
	$("menuToggle").onclick = () => menu.classList.toggle("open");
	menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
	const onScroll = () => $("topbar").classList.toggle("solid", window.scrollY > 60);
	window.addEventListener("scroll", onScroll); onScroll();

	/* ---------- Aviso ---------- */
	let t;
	function aviso(txt) {
		const el = $("toast");
		el.textContent = txt; el.classList.add("show");
		clearTimeout(t); t = setTimeout(() => el.classList.remove("show"), 1800);
	}

	$("year").textContent = new Date().getFullYear();
	pintar();

})();
