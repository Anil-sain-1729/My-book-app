// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://icwohahcsmobtloevjkf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljd29oYWhjc21vYnRsb2V2amtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4OTQ0NTYsImV4cCI6MjEwNjQ3MDQ1Nn0.KlNrRRKPfTt7XxdlX7i7U_U4r1FwsLeU2pu4YzAirN0";

const sb = SUPABASE_URL.startsWith("http") ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const ls = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
let tt; function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 3200); }
async function safe(fn, btn, label) { // runs async work with try/catch, button lock and friendly errors
  const old = btn?.textContent; if (btn) { btn.disabled = true; if (label) btn.textContent = label; }
  try { return await fn(); } catch (e) { console.error(e); toast(e?.message?.includes("fetch") ? "Network error. Please try again." : (e?.message || "Something went wrong.")); }
  finally { if (btn) { btn.disabled = false; btn.textContent = old; } }
}

// ===== LANGUAGE =====
const T = { en:{home:"Home",books:"Books",about:"About",contact:"Contact",orders:"My Orders",explore:"Explore Books",browse:"Browse Books",browseSub:"Free reads and paid editions, all in one place.",soon:"Coming Soon",soonSub:"Stories on their way to your shelf.",author:"About the Author",reviews:"Reader Reviews",reviewsSub:"What readers are saying.",contactT:"Write to us",contactSub:"Questions, feedback or a book request? We read every message.",send:"Send Message",search:"Search books, authors, stories...",name:"Name",email:"Email",phone:"Phone",message:"Message",all:"All",free:"Free Books",paid:"Paid Books",details:"View Details",download:"Download",cart:"Add to Cart",cartT:"Your Cart",empty:"Your cart is empty.",checkout:"Checkout",none:"No books found. Try another search.",sent:"Your message has been sent successfully.",total:"Total"},
hi:{home:"होम",books:"किताबें",about:"परिचय",contact:"संपर्क",orders:"मेरे ऑर्डर",explore:"किताबें देखें",browse:"किताबें खोजें",browseSub:"मुफ़्त और सशुल्क किताबें, एक ही जगह।",soon:"जल्द आ रही हैं",soonSub:"जल्द ही आपकी अलमारी में।",author:"लेखक के बारे में",reviews:"पाठकों की राय",reviewsSub:"पाठक क्या कह रहे हैं।",contactT:"हमें लिखें",contactSub:"सवाल, सुझाव या किताब का अनुरोध? हम हर संदेश पढ़ते हैं।",send:"संदेश भेजें",search:"किताबें, लेखक, कहानियाँ खोजें...",name:"नाम",email:"ईमेल",phone:"फ़ोन",message:"संदेश",all:"सभी",free:"मुफ़्त किताबें",paid:"सशुल्क किताबें",details:"विवरण देखें",download:"डाउनलोड",cart:"कार्ट में जोड़ें",cartT:"आपका कार्ट",empty:"आपका कार्ट खाली है।",checkout:"चेकआउट",none:"कोई किताब नहीं मिली। दूसरा शब्द आज़माएँ।",sent:"आपका संदेश सफलतापूर्वक भेज दिया गया है।",total:"कुल"}};
let lang = ls("kg_lang", "en");
Object.assign(T.en,{signin:"Sign In",create:"Create Account",hi:"Hi"}); Object.assign(T.hi,{signin:"साइन इन",create:"खाता बनाएँ",hi:"नमस्ते"});
const t = k => T[lang][k] || T.en[k] || k;
function applyLang() {
  document.querySelectorAll("[data-i]").forEach(e => e.textContent = t(e.dataset.i));
  document.querySelectorAll("[data-p]").forEach(e => e.placeholder = t(e.dataset.p));
  $("#lBtn").textContent = lang === "en" ? "हिंदी" : "English"; document.documentElement.lang = lang;
  if (S.books.length) { renderTabs(); renderBooks(); renderSoon(); }
  if (typeof updateAcct === "function") updateAcct();
}

// ===== THEME =====
function applyTheme(th) { document.documentElement.dataset.theme = th; $("#tBtn").textContent = th === "dark" ? "☀️" : "🌙"; localStorage.setItem("kg_theme", th); }
applyTheme(localStorage.getItem("kg_theme") || "light");
$("#tBtn").onclick = () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
$("#lBtn").onclick = () => { lang = lang === "en" ? "hi" : "en"; save("kg_lang", lang); applyLang(); };

// ===== DEMO FALLBACK (shown if Supabase is not connected yet) =====
const U = id => `https://images.unsplash.com/${id}?w=600&q=80`;
const DEMO = {
 settings:{site_name:"KitabGhar",author_name:"Aarav Mehta",about_author:"Aarav Mehta writes quiet, honest stories about family, memory and the small decisions that shape a life.",contact_email:"hello@kitabghar.in",contact_phone:"+91 98765 43210",upi_id:"6268138217@ybl",hero_heading:"Stories worth keeping on your shelf",hero_description:"Read free books by Aarav Mehta, or own the latest digital editions. New stories, every season.",
  hero_1:"photo-1507842217343-583bb7270b66",hero_2:"photo-1495446815901-a7297e633e8d",hero_3:"photo-1456513080510-7bf3a84b82f8",hero_4:"photo-1481627834876-b7833e8f5570",hero_5:"photo-1455390582262-044cdead277a",hero_6:"photo-1512820790803-83ca734da794",footer_text:"Independent stories, written with care and shared with readers everywhere.",footer_email:"hello@kitabghar.in"},
 books:[
 {id:"d1",icon:"📜",title:"The Silent Pages",author:"Aarav Mehta",cover_url:U("photo-1544947950-fa07a98d237f"),short_description:"A retired teacher finds a stranger's diary inside a library book.",about:"A gentle, slow-burning novel about listening.",category:"free",price:0,rating:4.8,review_count:126,published_date:"2024-01-15"},
 {id:"d2",icon:"🧭",title:"A Journey Within",author:"Aarav Mehta",cover_url:U("photo-1519682337058-a94d519337bc"),short_description:"Essays on solitude, travel and learning to sit with yourself.",about:"Twelve reflective essays written on train journeys across India.",category:"free",price:0,rating:4.6,review_count:94,published_date:"2024-06-02"},
 {id:"d3",icon:"✉️",title:"Letters to Tomorrow",author:"Aarav Mehta",cover_url:U("photo-1474932430478-367dbb6832c1"),short_description:"Poems written as letters to the person you are becoming.",about:"Forty short poems, each addressed to a future self.",category:"free",price:0,rating:4.9,review_count:152,published_date:"2024-09-10"},
 {id:"d4",icon:"🪶",title:"The Power of Words",author:"Aarav Mehta",cover_url:U("photo-1512820790803-83ca734da794"),short_description:"How the sentences we say shape our relationships and our days.",about:"Part memoir, part practical guide to speaking and writing with care.",category:"paid",price:199,rating:4.8,review_count:211,published_date:"2025-02-14"},
 {id:"d5",icon:"🌿",title:"Beyond the Ordinary",author:"Aarav Mehta",cover_url:U("photo-1589998059171-988d887df646"),short_description:"A novel about three siblings, one old house and a decision to stay.",about:"Over one monsoon month, old rivalries soften.",category:"paid",price:249,rating:4.5,review_count:87,published_date:"2025-07-20"},
 {id:"d6",icon:"🕯️",title:"Stories That Stay",author:"Aarav Mehta",cover_url:U("photo-1543002588-bfa74002ed7e"),short_description:"Fifteen short stories you will think about long after the last page.",about:"A tea-seller, a night-shift nurse, a girl with a borrowed camera.",category:"paid",price:299,rating:4.7,review_count:138,published_date:"2025-11-05"}],
 coming:[
 {id:"c1",title:"The Last Monsoon",author:"Aarav Mehta",cover_url:U("photo-1476275466078-4007374efbbe"),description:"A family saga along the Shipra during one rainy season.",release_date:"2026-12-01",status:"Coming Soon"},
 {id:"c2",title:"Notes from a Quiet Mind",author:"Aarav Mehta",cover_url:U("photo-1491841550275-ad7854e35ca6"),description:"Short daily reflections for calmer mornings.",release_date:"2027-02-14",status:"Coming Soon"},
 {id:"c3",title:"Chai and Chapters",author:"Aarav Mehta",cover_url:U("photo-1532012197267-da84d127e765"),description:"Light stories and recipes from favourite tea stalls.",release_date:"2027-04-20",status:"Coming Soon"}],
 reviews:[
 {book_id:"d4",name:"Priya Sharma",rating:5,comment:"I underlined half of this book. The chapter on apologies alone was worth the price."},
 {book_id:"d1",name:"Neha Kulkarni",rating:5,comment:"Finished it in one evening. The ending stayed with me for days."},
 {book_id:"d3",name:"Sana Ali",rating:5,comment:"These poems feel like a hand on the shoulder. Beautiful."},
 {book_id:"d6",name:"Anjali Desai",rating:5,comment:"Every story is small and perfect. The tea-seller one made me cry."}]};
DEMO.settings = Object.fromEntries(Object.entries(DEMO.settings).map(([k, v]) => [k, k.startsWith("hero_") && !v.startsWith("http") ? `https://images.unsplash.com/${v}?w=1600&q=80` : v]));

const S = { books:[], coming:[], reviews:[], set:{}, cat:"all", q:"", demo:false };

// ===== LOAD DATA =====
async function loadAll() {
  try {
    if (!sb) throw new Error("no-supabase");
    const [b, c, r, s] = await Promise.all([
      sb.from("books").select("*").order("published_date"), sb.from("coming_books").select("*").order("release_date"),
      sb.from("reviews").select("*").order("created_at", {ascending:false}), sb.from("site_settings").select("*")]);
    if (b.error || !b.data?.length) throw new Error("empty");
    S.books = b.data; S.coming = c.data || []; S.reviews = r.data || []; S.set = Object.fromEntries((s.data || []).map(x => [x.key, x.value]));
    S.demo = false; cart = cart.filter(c => S.books.some(b => b.id === c.id)); saveCart();
  } catch (e) { console.warn("Using demo data:", e?.message || e); if (sb) toast("Showing demo data: could not load books from Supabase. Run supabase.sql and refresh."); S.demo = true; S.books = DEMO.books; S.coming = DEMO.coming; S.reviews = DEMO.reviews; S.set = DEMO.settings; }
  renderSite(); applyLang();
}
const pubUrl = (bucket, path) => path ? sb.storage.from(bucket).getPublicUrl(path).data.publicUrl : "";

// ===== RENDER =====
function renderSite() {
  const s = S.set, g = k => s[k] || DEMO.settings[k] || "";
  $("#siteName").textContent = $("#fName").textContent = g("site_name"); document.title = g("site_name") + " — Stories worth keeping";
  $("#hH").textContent = g("hero_heading"); $("#hD").textContent = g("hero_description");
  $("#auName").textContent = g("author_name"); $("#auBio").textContent = g("about_author");
  $("#cEmail").textContent = g("contact_email"); $("#cPhone").textContent = g("contact_phone");
  $("#fText").textContent = g("footer_text"); $("#fMail").textContent = g("footer_email");
  $("#sIg").href = g("instagram") || "#"; $("#sFb").href = g("facebook") || "#"; $("#sYt").href = g("youtube") || "#";
  $("#slides").innerHTML = [1,2,3,4,5,6].map(i => `<div class="slide" style="background-image:url('${esc(g("hero_" + i))}')"></div>`).join("");
  $("#dots").innerHTML = [0,1,2,3,4,5].map(i => `<i data-i="${i}"></i>`).join("");
  goSlide(0); renderReviews();
}
function renderTabs() {
  $("#tabs").innerHTML = [["all","all"],["free","free"],["paid","paid"],["soon","soon"]].map(([k, l]) => `<button class="tab ${S.cat === k ? "on" : ""}" data-c="${k}">${t(l)}</button>`).join("");
}
function stars(r) { return `<span class="star">★</span> ${Number(r).toFixed(1)}`; }
function bookCard(b) {
  const free = b.category === "free";
  return `<article class="card"><div class="cov" style="background-image:url('${esc(b.cover_url)}')"><span class="tag ${free ? "free" : "paid"}">${free ? "Free" : "Paid"}</span><span class="ic">${esc(b.icon)}</span></div>
  <div class="cb"><h3>${esc(b.title)}</h3><div class="mu">${esc(b.author)}</div><p class="mu">${esc(b.short_description)}</p>
  <div>${stars(b.rating)} <span class="mu">(${b.review_count})</span> ${free ? "" : `<span class="price" style="float:right">${money(b.price)}</span>`}</div>
  <div class="row"><button class="btn ghost sm" data-d="${b.id}">${t("details")}</button>${free ? `<button class="btn sm" data-dl="${b.id}">${t("download")}</button>` : `<button class="btn sm" data-add="${b.id}">${t("cart")}</button>`}</div></div></article>`;
}
function soonCard(b) {
  return `<article class="card"><div class="cov" style="background-image:url('${esc(b.cover_url)}')"><span class="tag soon">${esc(b.status || "Coming Soon")}</span></div>
  <div class="cb"><h3>${esc(b.title)}</h3><div class="mu">${esc(b.author)}</div><p class="mu">${esc(b.description)}</p><div class="mu">📅 ${esc(b.release_date)}</div><div class="row"><button class="btn sm" disabled>Coming Soon</button></div></div></article>`;
}
function renderBooks() {
  const q = S.q.toLowerCase().trim();
  let list = S.cat === "soon" ? [] : S.books.filter(b => S.cat === "all" || b.category === S.cat);
  let soon = (S.cat === "all" || S.cat === "soon") ? S.coming : [];
  if (q) { list = list.filter(b => [b.title, b.author, b.short_description, b.category].join(" ").toLowerCase().includes(q)); soon = soon.filter(b => [b.title, b.author, b.description].join(" ").toLowerCase().includes(q)); }
  $("#grid").innerHTML = (list.length || (S.cat === "soon" && soon.length)) ? (S.cat === "soon" ? soon.map(soonCard) : list.map(bookCard)).join("") : `<p>${t("none")}</p>`;
}
function renderSoon() { $("#soonGrid").innerHTML = S.coming.map(soonCard).join("") || "<p class='mu'>New titles are on the way.</p>"; }
function renderReviews() {
  $("#rvGrid").innerHTML = S.reviews.slice(0, 6).map(r => `<div class="rv"><div>${"★".repeat(r.rating).replace(/★/g, '<span class="star">★</span>')}</div><p>“${esc(r.comment)}”</p><div class="mu">— ${esc(r.name)}</div></div>`).join("");
}
$("#tabs").onclick = e => { const c = e.target.dataset.c; if (c) { S.cat = c; renderTabs(); renderBooks(); } };
$("#q").oninput = e => { S.q = e.target.value; renderBooks(); if (S.q) location.hash = "#books"; };
$("#sBtn").onclick = () => { $("#sbar").classList.toggle("on"); $("#q").focus(); };
$("#burger").onclick = () => $("#nav").classList.toggle("on");
$("#nav").onclick = () => $("#nav").classList.remove("on");

// ===== HERO SLIDER =====
let si = 0, st, paused = false;
function goSlide(n) {
  const sl = document.querySelectorAll(".slide"), dt = document.querySelectorAll("#dots i"); if (!sl.length) return;
  si = (n + 6) % 6; sl.forEach((s, i) => s.classList.toggle("on", i === si)); dt.forEach((d, i) => d.classList.toggle("on", i === si));
  $("#cnt").textContent = `${si + 1} / 6`;
}
$("#prev").onclick = () => goSlide(si - 1); $("#next").onclick = () => goSlide(si + 1);
$("#dots").onclick = e => { if (e.target.dataset.i) goSlide(+e.target.dataset.i); };
$("#hero").onmouseenter = () => paused = true; $("#hero").onmouseleave = () => paused = false;
setInterval(() => { if (!paused && !document.hidden) goSlide(si + 1); }, 5000);
let tx = 0; $("#hero").addEventListener("touchstart", e => tx = e.touches[0].clientX, {passive:true});
$("#hero").addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) goSlide(si + (d < 0 ? 1 : -1)); });
document.addEventListener("keydown", e => { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === "ArrowLeft") goSlide(si - 1); if (e.key === "ArrowRight") goSlide(si + 1); if (e.key === "Escape") closeOv(); });

// ===== MODAL =====
function openOv(html) { $("#ovB").innerHTML = html; $("#ov").classList.add("on"); }
function closeOv() { $("#ov").classList.remove("on"); }
$("#ovX").onclick = closeOv; $("#ov").onclick = e => { if (e.target.id === "ov") closeOv(); };

// ===== BOOK DETAIL + REVIEWS =====
function showBook(id) {
  const b = S.books.find(x => x.id === id); if (!b) return; const free = b.category === "free";
  const rv = S.reviews.filter(r => r.book_id === id);
  openOv(`<div class="dt"><div class="cov" style="background-image:url('${esc(b.cover_url)}')"></div><div>
  <h2>${esc(b.icon)} ${esc(b.title)}</h2><div class="mu">by ${esc(b.author)} · ${esc(b.category)} · Published ${esc(b.published_date)}</div>
  <p style="margin:8px 0">${stars(b.rating)} <span class="mu">(${b.review_count} reviews)</span> ${free ? "<b>Free</b>" : `<b class="price">${money(b.price)}</b>`}</p>
  <p><i>${esc(b.short_description)}</i></p><h3 style="margin:12px 0 4px">About the book</h3><p>${esc(b.about)}</p>
  <div class="row" style="margin-top:14px">${free ? `<button class="btn" data-dl="${b.id}">View / Download</button>` : `<button class="btn ghost" data-pv="${b.id}">View 10 Pages</button><button class="btn" data-add="${b.id}">${t("cart")}</button>`}</div></div></div>
  <h3 style="margin:22px 0 8px">Reviews</h3>${rv.map(r => `<div class="rv" style="margin-bottom:8px"><span class="star">${"★".repeat(r.rating)}</span> <b>${esc(r.name)}</b><p>${esc(r.comment)}</p></div>`).join("") || "<p class='mu'>No reviews yet. Be the first.</p>"}
  <h3 style="margin:16px 0 6px">Write a review</h3><input id="rn" placeholder="Your name"><select id="rr"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select><textarea id="rc" rows="3" placeholder="Your comment"></textarea><button class="btn" data-rv="${b.id}">Submit Review</button>`);
}
async function submitReview(id, btn) {
  const name = $("#rn").value.trim(), comment = $("#rc").value.trim(), rating = +$("#rr").value;
  if (!name || !comment) return toast("Please enter your name and comment.");
  await safe(async () => {
    if (!sb) throw new Error("Connect Supabase to post reviews.");
    const { error } = await sb.from("reviews").insert({ book_id:id, name, rating, comment }); if (error) throw error;
    toast("Thank you! Your review is live."); const r = await sb.from("reviews").select("*").order("created_at", {ascending:false}); S.reviews = r.data || S.reviews; renderReviews(); showBook(id);
  }, btn, "Processing...");
}

// ===== FREE DOWNLOAD / PREVIEW =====
function freeDownload(id) { const b = S.books.find(x => x.id === id); if (!b?.full_pdf_path || !sb) return toast("Download file is not available yet."); window.open(pubUrl("free-books", b.full_pdf_path), "_blank"); }
function previewPdf(id) { const b = S.books.find(x => x.id === id); if (!b?.preview_pdf_path || !sb) return toast("Download file is not available yet."); window.open(pubUrl("book-previews", b.preview_pdf_path), "_blank"); }

// ===== CART =====
let cart = ls("kg_cart", []);
const saveCart = () => { save("kg_cart", cart); $("#cBadge").textContent = cart.reduce((a, c) => a + c.qty, 0); };
function addCart(id) { const c = cart.find(x => x.id === id); c ? c.qty = Math.min(c.qty + 1, 5) : cart.push({ id, qty:1 }); saveCart(); toast("Added to cart"); }
function showCart() {
  const rows = cart.map(c => ({ ...c, b: S.books.find(x => x.id === c.id) })).filter(c => c.b);
  const total = rows.reduce((a, c) => a + c.b.price * c.qty, 0);
  openOv(`<h2>${t("cartT")}</h2>` + (rows.length ? rows.map(c => `<div class="ci"><div style="font-size:1.6rem">${esc(c.b.icon)}</div><div><b>${esc(c.b.title)}</b><div class="mu">${money(c.b.price)}</div></div><div class="q"><button data-q="${c.id}:-1">−</button> ${c.qty} <button data-q="${c.id}:1">+</button></div><button class="ib" data-rm="${c.id}">🗑</button></div>`).join("") +
  `<p style="margin:14px 0"><b>${t("total")}: ${money(total)}</b></p><button class="btn" data-co="1">${t("checkout")}</button>` : `<p class="mu" style="margin-top:12px">${t("empty")}</p>`));
}
$("#cBtn").onclick = showCart; saveCart();

// ===== CHECKOUT & PAYMENT FLOW =====
function showCheckout() {
  openOv(`<h2>${t("checkout")}</h2><label>Full Name</label><input id="kn"><label>Phone</label><input id="kp" inputmode="tel"><label>Email</label><input id="ke" type="email"><button class="btn" id="kGo">Place Order</button>`);
  $("#kn").value = prof?.full_name || ""; $("#kp").value = prof?.phone || ""; $("#ke").value = user?.email || "";
  $("#kGo").onclick = e => placeOrder(e.target);
}
async function placeOrder(btn) {
  const n = $("#kn").value.trim(), p = $("#kp").value.trim(), em = $("#ke").value.trim();
  if (n.length < 2) return toast("Please enter your full name.");
  if (!/^[0-9+\s-]{10,15}$/.test(p)) return toast("Please enter a valid phone number.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return toast("Please enter your email");
  await safe(async () => {
    if (!sb) throw new Error("Connect Supabase to place orders.");
    if (S.demo) throw new Error("Books are not loaded from Supabase yet. Run supabase.sql, then refresh.");
    const items = cart.map(c => ({ book_id:c.id, quantity:c.qty }));
    const { data, error } = await sb.rpc("place_order", { p_session:sess(), p_name:n, p_phone:p, p_email:em, p_items:items });
    if (error) { if (/sign in/i.test(error.message)) { pendingCheckout = true; authModal("in"); throw new Error("Please sign in or create an account to continue checkout."); } throw error; }
    cart = []; saveCart(); showPay(data);
  }, btn, "Processing...");
}
function showPay(o) {
  // The UPI deep link is only a convenience. Payment stays Pending until the admin clicks Mark Paid.
  // FUTURE GATEWAY: replace this link with a Razorpay/Cashfree checkout, and let their webhook call admin_set_payment/UPDATE orders server-side.
  const upi = S.set.upi_id || DEMO.settings.upi_id, name = S.set.site_name || "KitabGhar";
  const link = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(name)}&am=${o.amount}&cu=INR&tn=${encodeURIComponent("Order " + o.order_number)}`;
  openOv(`<h2>Complete your payment</h2><p><b>Order #${o.order_number}</b></p><p>Amount: <b class="price">${money(o.amount)}</b></p><p>UPI ID: <b>${esc(upi)}</b></p>
  <div class="row" style="margin:14px 0"><a class="btn" href="${link}">Pay Now</a><button class="btn ghost" id="chk">Check Payment</button></div>
  <p class="mu">On a computer? Open your UPI app on your phone and pay this amount to the UPI ID above, with the order number in the note.</p><p class="mu">Your order stays <b>Pending</b> until payment is verified. You can check it any time in My Orders.</p><div id="payRes"></div>`);
  $("#chk").onclick = async e => { const r = await refreshOrder(o.order_id, o.token, e.target); if (r) $("#payRes").innerHTML = orderCard(r, o.token); };
}

// ===== MY ORDERS =====
const STEPS = ["Payment Pending", "Payment Verified", "Order Confirmed", "Book Ready", "Download Available"];
const ORD = {};
async function refreshOrder(id, token, btn) {
  return await safe(async () => {
    if (!sb) throw new Error("Connect Supabase first.");
    const { data, error } = await sb.rpc("my_order_status", { p_session:sess(), p_order_id:id }); if (error) throw error;
    if (!data) throw new Error("Order not found."); if (data.payment_status === "Pending") toast("Payment is pending verification"); return data;
  }, btn, "Checking Payment...");
}
function orderCard(o, token) {
  ORD[o.order_id] = { ...o, token };
  const paid = o.payment_status === "Paid", cancelled = o.payment_status === "Cancelled", idx = paid ? 4 : 0;
  const items = o.items.map(i => `<div class="oi">${i.cover_url ? `<img src="${esc(i.cover_url)}" alt="">` : ""}<span>${esc(i.icon || "")} ${esc(i.title)} × ${i.quantity} · ${money(i.price)}</span></div>`).join("");
  return `<div class="rv" id="oc-${o.order_id}" style="margin-bottom:14px"><b>Order #${o.order_number}</b> · ${money(o.amount)} · <span class="mu">${new Date(o.created_at).toLocaleDateString()}</span>${items}
  <div class="steps">${(cancelled ? ["Cancelled"] : STEPS).map((s, i) => `<span class="${i <= idx ? "d" : ""}">${s}</span>`).join("")}</div>
  <p>Payment: <b>${o.payment_status}</b> · Status: ${esc(o.order_status)}</p>
  ${paid ? `<p style="color:#2f7d4f"><b>Payment Successful</b><br><span class="mu">Your book is ready.</span></p><div class="ordbtns">` + o.items.map(i => `<button class="btn sm" data-gd="${o.order_id}||${i.book_id}">Download Book — ${esc(i.title)}</button>`).join("") + `</div>`
   : cancelled ? `<p><b>Order Cancelled</b></p>`
   : `<p class="mu"><b>Payment Pending</b> — waiting for payment verification.</p><div class="ordbtns"><button class="btn sm" data-pay="${o.order_id}">Pay Now</button><button class="btn sm ghost" data-ck="${o.order_id}">Check Payment</button></div>`}</div>`;
}
const needLogin = what => `<p class="mu">Please sign in to see ${what}.</p><button class="btn" data-auth="in">Sign In</button>`;
async function myOrders() { const { data, error } = await sb.rpc("my_orders", { p_session:sess() }); if (error) throw error; return data || []; }
async function loadOrders() {
  const box = $("#ordList"); if (!user) { box.innerHTML = needLogin("your orders"); return; }
  box.textContent = "Loading Orders...";
  try { const list = await myOrders(); box.innerHTML = list.map(o => orderCard(o, "")).join("") || "<p class='mu'>No orders yet.</p>"; }
  catch (e) { console.error(e); box.innerHTML = "<p>Something went wrong.</p>"; }
}
// Secure download: the Edge Function checks the signed-in owner + Paid status + book in order.
async function getDownload(id, bookId, btn) {
  await safe(async () => {
    if (!sess()) throw new Error("Please sign in first.");
    const r = await fetch(`${SUPABASE_URL}/functions/v1/get-download`, { method:"POST", headers:{ "Content-Type":"application/json", apikey:SUPABASE_ANON_KEY, Authorization:"Bearer " + SUPABASE_ANON_KEY }, body:JSON.stringify({ session:sess(), order_id:id, book_id:bookId }) });
    const d = await r.json(); if (!r.ok) throw new Error(d.error || "Something went wrong."); window.open(d.url, "_blank");
  }, btn, "Processing...");
}

// ===== USER ACCOUNT (Supabase Auth) =====
let user = null, prof = null, authReady = false, pendingCheckout = false, manualOut = false;
function authErr(e) {
  if (/^(This email|Invalid email|Too many|Password must|Please enter)/.test(e?.message || "")) return e.message;
  const m = (e?.message || "").toLowerCase(); console.warn("Auth error:", e?.message);
  if (m.includes("email rate limit")) return "Too many sign-up emails sent. Please wait about an hour, or ask the owner to turn off email confirmation.";
  if (m.includes("invalid login")) return "Invalid email or password.";
  if (m.includes("already")) return "This email is already registered.";
  if (m.includes("at least") || m.includes("weak")) return "Password must be at least 6 characters.";
  if (m.includes("not confirmed")) return "Please verify your email.";
  if (m.includes("fetch") || m.includes("network")) return "Network error. Please try again.";
  if (m.includes("rate") || m.includes("seconds")) return "Too many attempts. Please wait a minute.";
  return "Something went wrong. Please try again.";
}
async function loadProfile() {
  user = null; prof = null; const s = localStorage.getItem("kg_sess");
  if (s) { try { const { data } = await sb.rpc("user_me", { p_session:s }); if (data) { user = data; prof = data; } else localStorage.removeItem("kg_sess"); } catch (e) { console.warn(e); } }
}
const sess = () => localStorage.getItem("kg_sess") || "";
function updateAcct() {
  const first = (prof?.full_name || user?.email || "").split(/[ @]/)[0];
  const menu = $("#aMenu"), nav = $("#navAcct"); if (!menu) return;
  if (user) {
    const items = `<a href="#orders">${t("orders")}</a><a href="#profile">My Profile</a><button data-lo="1">Logout</button>`;
    $("#aBtn").textContent = `${t("hi")}, ${first} 👋`; menu.innerHTML = items; nav.innerHTML = `<b>${t("hi")}, ${esc(first)} 👋</b>` + items;
  } else {
    $("#aBtn").textContent = t("signin"); menu.innerHTML = "";
    nav.innerHTML = `<button class="btn sm" data-auth="in">${t("signin")}</button><button class="btn sm ghost" data-auth="up">${t("create")}</button>`;
  }
  menu.classList.remove("on");
}
function authModal(mode = "in") {
  if (!sb) return toast("Connect Supabase to use accounts.");
  const tabs = `<div class="tabs"><button class="tab ${mode === "up" ? "" : "on"}" data-auth="in">Sign In</button><button class="tab ${mode === "up" ? "on" : ""}" data-auth="up">Create Account</button></div>`;
  const pw = (id, l, ac) => `<label>${l}</label><input id="${id}" type="password" autocomplete="${ac}">`;
  const H = {
    in: `<h2>Welcome Back 👋</h2>${tabs}<label>Email</label><input id="lgE" type="email" autocomplete="email">${pw("lgP", "Password", "current-password")}<button class="btn" id="goIn">Sign In</button><p class="mu" style="margin-top:12px"><a href="#" data-auth="forgot">Forgot Password?</a></p><p class="mu">Don't have an account? <a href="#" data-auth="up">Create Account</a></p>`,
    up: `<h2>Create your KitabGhar account</h2>${tabs}<label>Full Name</label><input id="suN" autocomplete="name"><label>Email</label><input id="suE" type="email" autocomplete="email"><label>Phone</label><input id="suPh" inputmode="tel" autocomplete="tel">${pw("suP", "Password", "new-password")}${pw("suC", "Confirm Password", "new-password")}<button class="btn" id="goUp">Create Account</button><p class="mu" style="margin-top:12px">Already have an account? <a href="#" data-auth="in">Sign In</a></p>`,
    forgot: `<h2>Forgot Password</h2><p class="sub">Please contact us and we will reset your password.</p><p>✉ ${esc(S.set.contact_email || "")}<br>☎ ${esc(S.set.contact_phone || "")}</p><button class="btn ghost" data-auth="in">Back to Sign In</button>`,
  };
  const wc = $("#welcome").classList.contains("on"); if (wc) $("#wcForm").innerHTML = H[mode]; else openOv(H[mode]);
  enhanceAuth(wc ? $("#wcForm") : $("#ovB")); const on = (id, f) => { const e = $(id); if (e) e.onclick = ev => f(ev.target); };
  on("#goIn", signIn); on("#goUp", signUp); 
}
async function afterAuth(msg) {
  await loadProfile(); updateAcct(); closeOv(); hideWelcome(); toast(msg);
  if (pendingCheckout) { pendingCheckout = false; if (cart.length) showCheckout(); }
}
const okEmail = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
async function signIn(btn) {
  const email = $("#lgE").value.trim(), pass = $("#lgP").value;
  if (!okEmail(email)) return toast("Please enter your email"); if (!pass) return toast("Please enter your password.");
  await safe(async () => {
    const { data, error } = await sb.rpc("user_login", { p_email:email, p_password:pass }); if (error) throw new Error(authErr(error));
    if (data.error) throw new Error(data.error);
    localStorage.setItem("kg_sess", data.token); await afterAuth("Welcome back!");
  }, btn, "Processing...");
}
async function signUp(btn) {
  const full_name = $("#suN").value.trim(), email = $("#suE").value.trim(), phone = $("#suPh").value.trim(), pass = $("#suP").value;
  if (full_name.length < 2) return toast("Please enter your full name."); if (!okEmail(email)) return toast("Please enter your email");
  if (!/^[0-9+\s-]{10,15}$/.test(phone)) return toast("Please enter a valid phone number.");
  if (pass.length < 6) return toast("Password must be at least 6 characters."); if (pass !== $("#suC").value) return toast("Passwords do not match.");
  await safe(async () => {
    const { data, error } = await sb.rpc("user_signup", { p_name:full_name, p_email:email, p_phone:phone, p_password:pass }); if (error) throw new Error(authErr(error));
    localStorage.setItem("kg_sess", data.token); await afterAuth("Account created. Welcome 👋");
  }, btn, "Processing...");
}


async function logout() {
  const s = sess(); localStorage.removeItem("kg_sess"); try { if (s) await sb.rpc("user_logout", { p_session:s }); } catch {}
  user = null; prof = null; sessionStorage.removeItem("kg_guest"); Object.keys(ORD).forEach(k => delete ORD[k]);
  ["#ordList", "#profWrap", "#myBooks"].forEach(x => $(x).innerHTML = ""); updateAcct(); closeOv(); toast("Logged out"); location.hash = "#home"; route(); showWelcome();
}
async function renderProfile() {
  const box = $("#profWrap"), mb = $("#myBooks");
  if (!user) { box.innerHTML = needLogin("your profile"); mb.innerHTML = ""; return; }
  box.innerHTML = `<div class="fgrid"><div><label>Full Name</label><input id="pfN" value="${esc(prof?.full_name)}"></div><div><label>Email</label><input value="${esc(user.email)}" disabled></div><div><label>Phone</label><input id="pfP" value="${esc(prof?.phone)}"></div><div><label>Account Created</label><input value="${new Date(user.created_at).toLocaleDateString()}" disabled></div></div><button class="btn" data-ps="1">Save Changes</button>`;
  mb.textContent = "Loading Books...";
  try { // My Books = items from this user's Paid orders (no separate ownership table)
    const seen = {}; (await myOrders()).filter(o => o.payment_status === "Paid").forEach(o => o.items.forEach(i => { if (!seen[i.book_id]) seen[i.book_id] = { ...i, oid:o.order_id, at:o.created_at }; }));
    mb.innerHTML = Object.values(seen).map(i => `<div class="rv oi" style="margin-bottom:10px;justify-content:space-between"><span>${esc(i.icon || "📕")} <b>${esc(i.title)}</b><br><span class="mu">Purchased: ${new Date(i.at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span></span><button class="btn sm" data-gd="${i.oid}||${i.book_id}">Download</button></div>`).join("") || "<p class='mu'>No purchased books yet.</p>";
  } catch (e) { mb.innerHTML = "<p>Something went wrong.</p>"; }
}
async function saveProfile(btn) {
  const full_name = $("#pfN").value.trim(), phone = $("#pfP").value.trim(); if (full_name.length < 2) return toast("Please enter your full name.");
  await safe(async () => { const { error } = await sb.rpc("user_update_profile", { p_session:sess(), p_name:full_name, p_phone:phone }); if (error) throw new Error(authErr(error)); await loadProfile(); updateAcct(); toast("Profile updated successfully"); }, btn, "Processing...");
}
// ----- Welcome page (shown to visitors who are not signed in) -----
const showWelcome = () => { if (!sb) return; $("#welcome").classList.add("on"); document.body.style.overflow = "hidden"; if (!$("#wcForm").innerHTML) authModal("in"); };
const hideWelcome = () => { $("#welcome").classList.remove("on"); document.body.style.overflow = ""; };
function enhanceAuth(root) {
  root.querySelectorAll("input[type=password]").forEach(i => { const w = document.createElement("div"); w.className = "pwf"; i.parentNode.insertBefore(w, i); w.appendChild(i);
    const b = document.createElement("button"); b.type = "button"; b.className = "eye"; b.textContent = "👁"; b.setAttribute("aria-label", "Show password"); b.onclick = () => { i.type = i.type === "password" ? "text" : "password"; }; w.appendChild(b); });
  const p = root.querySelector("#suP");
  if (p) { const m = document.createElement("div"); m.className = "meter"; m.innerHTML = "<i></i>"; p.closest(".pwf").after(m);
    p.oninput = () => { const v = p.value, s = (v.length >= 6) + (v.length >= 10) + /[A-Z]/.test(v) + /\d/.test(v) + /[^\w]/.test(v); m.firstChild.style.width = s * 20 + "%"; m.firstChild.style.background = s < 2 ? "#c0392b" : s < 4 ? "#e0a030" : "#2f7d4f"; }; }
  root.onkeydown = e => { if (e.key === "Enter" && e.target.tagName === "INPUT") root.querySelector(".btn")?.click(); };
}
function initAuth() {
  $("#wGuest").onclick = () => { sessionStorage.setItem("kg_guest", "1"); hideWelcome(); };
  $("#aBtn").onclick = e => { e.stopPropagation(); user ? $("#aMenu").classList.toggle("on") : authModal("in"); };
  document.addEventListener("click", () => $("#aMenu").classList.remove("on"));
  if (!sb) { authReady = true; updateAcct(); route(); return; }
  if (!localStorage.getItem("kg_sess") && !sessionStorage.getItem("kg_guest")) showWelcome();
  (async () => { await loadProfile(); updateAcct(); authReady = true;
    if (user) hideWelcome(); else if (!sessionStorage.getItem("kg_guest")) showWelcome(); route(); })();
}

// ===== CONTACT =====
$("#cSend").onclick = async e => {
  const f = { name:$("#cn").value.trim(), email:$("#ce").value.trim(), phone:$("#cp").value.trim(), message:$("#cm").value.trim() };
  if (!f.name || !f.message) return toast("Please enter your name and message.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return toast("Please enter your email");
  await safe(async () => { if (!sb) throw new Error("Connect Supabase to send messages."); const { error } = await sb.from("contact_messages").insert(f); if (error) throw error; toast(t("sent")); ["#cn","#ce","#cp","#cm"].forEach(s => $(s).value = ""); }, e.target, "Processing...");
};

// ===== VISITOR COUNTER =====
async function visitor() {
  try {
    if (!sb) { $("#vis").textContent = "12,845"; return; }
    let r; if (!sessionStorage.getItem("kg_v")) { sessionStorage.setItem("kg_v", "1"); r = await sb.rpc("increment_visitor"); } else r = await sb.rpc("visitor_total");
    $("#vis").textContent = Number(r.data).toLocaleString("en-IN");
  } catch { $("#vis").textContent = "12,845"; }
}

// ===== GLOBAL CLICKS & ROUTING =====
document.addEventListener("click", e => {
  const d = e.target.closest("[data-d],[data-add],[data-dl],[data-pv],[data-rv],[data-q],[data-rm],[data-co],[data-gd],[data-pay],[data-ck],[data-auth],[data-lo],[data-ps]"); if (!d) return; const D = d.dataset;
  if (d.tagName === "A") e.preventDefault();
  if (D.auth) authModal(D.auth); else if (D.lo) logout(); else if (D.ps) saveProfile(d);
  else if (D.d) showBook(D.d); else if (D.add) addCart(D.add); else if (D.dl) freeDownload(D.dl); else if (D.pv) previewPdf(D.pv);
  else if (D.rv) submitReview(D.rv, d);
  else if (D.q) { const [id, n] = D.q.split(":"), c = cart.find(x => x.id === id); c.qty += +n; if (c.qty < 1) cart = cart.filter(x => x !== c); saveCart(); showCart(); }
  else if (D.rm) { cart = cart.filter(x => x.id !== D.rm); saveCart(); showCart(); }
  else if (D.co) { if (!user) { toast("Please sign in or create an account to continue checkout."); pendingCheckout = true; authModal("in"); } else showCheckout(); }
  else if (D.pay) { const o = ORD[D.pay]; if (o) showPay({ order_id:o.order_id, order_number:o.order_number, amount:o.amount, token:o.token }); }
  else if (D.ck) { const o = ORD[D.ck]; if (o) refreshOrder(o.order_id, o.token, d).then(r => { if (r) $("#oc-" + o.order_id).outerHTML = orderCard(r, o.token); }); }
  else if (D.gd) { const [a, , c] = D.gd.split("|"); getDownload(a, c, d); }
});
function route() {
  const h = location.hash, v = h === "#orders" ? "orders" : h === "#profile" ? "profile" : "home";
  ["home", "orders", "profile"].forEach(x => $("#v-" + x).classList.toggle("on", x === v));
  if (v === "home" || !authReady) return; v === "orders" ? loadOrders() : renderProfile();
}
window.addEventListener("hashchange", route); route();
initAuth(); loadAll(); visitor();

// ===== ADMIN AUTH =====
let adminTab = "dash", editing = null;
$("#adminLink").onclick = e => { e.preventDefault(); openAdmin(); };
async function openAdmin() {
  $("#admin").classList.add("on");
  if (!sb) return adminShell(`<div style="margin:auto;max-width:360px"><h2>Admin</h2><p>Connect Supabase in index.html first.</p><button class="btn" onclick="closeAdmin()">← Back to Website</button></div>`, true);
  await safe(async () => { const { data } = await sb.auth.getUser(); data.user ? await checkAdmin() : loginForm(); });
}
const closeAdmin = () => $("#admin").classList.remove("on");
function adminShell(html, plain) { $("#admin").innerHTML = plain ? html : `<aside id="side"><div class="logo" style="font-size:1.3rem;margin-bottom:10px">Admin</div>${[["dash","Dashboard"],["books","Add Books"],["soon","Coming Books"],["pay","Payment"],["msg","Contact"],["set","Settings"]].map(([k, l]) => `<button data-t="${k}" class="${adminTab === k ? "on" : ""}">${l}</button>`).join("")}<button id="aOut">Logout</button><button onclick="closeAdmin()">← Back to Website</button></aside><div id="am">${html}</div>`;
  document.querySelectorAll("#side [data-t]").forEach(b => b.onclick = () => { adminTab = b.dataset.t; editing = null; renderAdmin(); });
  $("#aOut") && ($("#aOut").onclick = async () => { await sb.auth.signOut(); loginForm(); });
}
function loginForm() {
  adminShell(`<div style="margin:auto;max-width:340px;padding:20px"><h2>Admin Login</h2><p class="sub">Authorised users only.</p><input id="ae" type="email" placeholder="Email"><input id="ap" type="password" placeholder="Password"><button class="btn" id="aGo">Login</button> <button class="btn ghost" onclick="closeAdmin()">← Back</button></div>`, true);
  $("#aGo").onclick = async e => { const em = $("#ae").value.trim(); if (!em) return toast("Please enter your email");
    await safe(async () => { const { error } = await sb.auth.signInWithPassword({ email:em, password:$("#ap").value }); if (error) throw new Error("Invalid login credentials"); await checkAdmin(); }, e.target, "Processing..."); };
}
async function checkAdmin() {
  const { data: u } = await sb.auth.getUser(); const { data } = await sb.from("profiles").select("role").eq("id", u.user.id).maybeSingle();
  if (data?.role !== "admin") { toast("You are not authorized"); return loginForm(); }
  renderAdmin();
}
async function renderAdmin() { adminShell("<p>Loading...</p>"); await safe(async () => { const fn = { dash:aDash, books:aBooks, soon:aSoon, pay:aPay, msg:aMsg, set:aSet }[adminTab]; $("#am").innerHTML = await fn(); bindAdmin(); }); }
const cnt = async (t, f) => { let q = sb.from(t).select("*", { count:"exact", head:true }); if (f) q = f(q); return (await q).count ?? 0; };
async function aDash() {
  const v = await sb.from("visitor_stats").select("total").single();
  const s = [["Total Books", await cnt("books")], ["Free Books", await cnt("books", q => q.eq("category","free"))], ["Paid Books", await cnt("books", q => q.eq("category","paid"))], ["Coming Soon Books", await cnt("coming_books")], ["Total Orders", await cnt("orders")], ["Pending Payments", await cnt("orders", q => q.eq("payment_status","Pending"))], ["Paid Orders", await cnt("orders", q => q.eq("payment_status","Paid"))], ["Total Visitors", v.data?.total ?? 0], ["Contact Messages", await cnt("contact_messages")], ["Total Users", await cnt("app_users")]];
  const us = (await sb.from("app_users").select("full_name,email,phone,created_at").order("created_at", { ascending:false }).limit(50)).data || [];
  return `<h2>Dashboard</h2><div class="stats" style="margin-top:16px">${s.map(([l, n]) => `<div class="stat"><b>${n}</b>${l}</div>`).join("")}</div>
  <h3 style="margin:26px 0 10px">Users</h3><div class="tw"><table><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>${us.map(u => `<tr><td>${esc(u.full_name)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td>user</td><td>${new Date(u.created_at).toLocaleDateString()}</td></tr>`).join("") || "<tr><td>No users yet.</td></tr>"}</table></div>`;
}

// ===== STORAGE =====
async function upload(bucket, file, label) {
  if (!file) return null; toast(label);
  const path = Date.now() + "-" + file.name.replace(/[^\w.-]/g, "_");
  const { error } = await sb.storage.from(bucket).upload(path, file); if (error) throw new Error("File upload failed"); return path;
}
const rmFile = (bucket, path) => path && sb.storage.from(bucket).remove([path]).catch(() => {});
const field = (id, l, v = "", type = "text") => `<div><label>${l}</label><input id="${id}" type="${type}" value="${esc(v)}"></div>`;

// ===== BOOK MANAGEMENT =====
const TPL = { novel:["📖","A gripping novel of family, memory and choices.","A story about ordinary people facing extraordinary decisions."], poetry:["🪶","A collection of short, honest poems.","Poems for slow mornings and quiet evenings."], stories:["🕯️","Short stories that stay with you.","A set of short stories about everyday moments."], self:["🧭","A practical guide to calmer, clearer living.","Simple ideas and exercises you can start using today."] };
async function aBooks() {
  const { data } = await sb.from("books").select("*").order("created_at", { ascending:false }); const b = editing ? data.find(x => x.id === editing) || {} : {};
  window._bk = data;
  return `<h2>${editing ? "Edit Book" : "Add Books"}</h2><div class="fgrid" style="margin-top:14px">
  <div><label>Quick Template</label><select id="bt"><option value="">— choose —</option><option value="novel">Novel</option><option value="poetry">Poetry</option><option value="stories">Stories</option><option value="self">Self-help</option></select></div>
  ${field("bi","Icon / Emoji",b.icon || "📖")}${field("btl","Book Title",b.title)}${field("ba","Author",b.author || S.set.author_name || "")}
  <div><label>Cover Image</label><input id="bc" type="file" accept="image/*"></div>${field("bs","Short Description",b.short_description)}
  <div><label>About Book</label><textarea id="bab" rows="3">${esc(b.about)}</textarea></div>
  <div><label>Category</label><select id="bcat"><option value="free" ${b.category === "free" ? "selected" : ""}>Free</option><option value="paid" ${b.category === "paid" ? "selected" : ""}>Paid</option></select></div>
  ${field("bp","Price (₹)",b.price ?? 0,"number")}${field("br","Rating",b.rating ?? 4.5,"number")}${field("bd","Published Date",b.published_date || new Date().toISOString().slice(0,10),"date")}
  <div><label>Full PDF</label><input id="bf" type="file" accept="application/pdf"></div><div><label>Preview PDF</label><input id="bpv" type="file" accept="application/pdf"></div></div>
  <button class="btn" id="bSave">${editing ? "Update Book" : "Add Book"}</button> ${editing ? `<button class="btn ghost" id="bCancel">Cancel</button>` : ""}
  <h3 style="margin:26px 0 10px">All Books</h3><input id="bq" placeholder="Search books..."><div class="tw"><table id="bTbl"></table></div>`;
}
function bookRows(f = "") { return (window._bk || []).filter(b => (b.title + b.author).toLowerCase().includes(f.toLowerCase())).map(b => `<tr><td>${esc(b.icon)} <b>${esc(b.title)}</b><br><span class="mu">${esc(b.author)}</span></td><td>${b.category}${b.category === "paid" ? " " + money(b.price) : ""}</td><td><button class="btn sm ghost" data-be="${b.id}">✏️ Edit</button> <button class="btn sm red" data-bd="${b.id}">🗑️ Delete</button></td></tr>`).join("") || "<tr><td>No books found.</td></tr>"; }
async function saveBook(btn) {
  const old = editing ? window._bk.find(x => x.id === editing) : null, v = id => $(id).value.trim(), cat = v("#bcat");
  if (!v("#btl") || !v("#ba")) return toast("Please enter title and author.");
  const fp = $("#bf").files[0], pp = $("#bpv").files[0];
  if (cat === "paid" && (!(fp || old?.full_pdf_path) || !(pp || old?.preview_pdf_path))) return toast("Paid books need a full PDF and a preview PDF.");
  if (cat === "free" && !(fp || old?.full_pdf_path)) return toast("Free books need a full PDF.");
  await safe(async () => {
    const row = { icon:v("#bi"), title:v("#btl"), author:v("#ba"), short_description:v("#bs"), about:v("#bab"), category:cat, price:cat === "paid" ? +v("#bp") : 0, rating:+v("#br"), published_date:v("#bd") };
    const cover = await upload("book-covers", $("#bc").files[0], "Uploading Cover..."); if (cover) { row.cover_url = sb.storage.from("book-covers").getPublicUrl(cover).data.publicUrl; }
    const fb = cat === "paid" ? "paid-books" : "free-books";
    const full = await upload(fb, fp, "Uploading PDF..."); if (full) { row.full_pdf_path = full; if (old?.full_pdf_path) rmFile(old.category === "paid" ? "paid-books" : "free-books", old.full_pdf_path); }
    const prev = await upload("book-previews", pp, "Uploading PDF..."); if (prev) { row.preview_pdf_path = prev; if (old?.preview_pdf_path) rmFile("book-previews", old.preview_pdf_path); }
    const { error } = editing ? await sb.from("books").update(row).eq("id", editing) : await sb.from("books").insert(row); if (error) throw error;
    toast(editing ? "Book updated successfully" : "Book added successfully"); editing = null; await loadAll(); renderAdmin();
  }, btn, editing ? "Updating Book..." : "Adding Book...");
}
async function delBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  await safe(async () => { const b = window._bk.find(x => x.id === id); const { error } = await sb.from("books").delete().eq("id", id); if (error) throw error;
    rmFile(b.category === "paid" ? "paid-books" : "free-books", b.full_pdf_path); rmFile("book-previews", b.preview_pdf_path); toast("Book deleted successfully"); await loadAll(); renderAdmin(); });
}

// ===== COMING BOOKS =====
async function aSoon() {
  const { data } = await sb.from("coming_books").select("*").order("release_date"); window._cb = data; const b = editing ? data.find(x => x.id === editing) || {} : {};
  return `<h2>${editing ? "Edit" : "Add"} Coming Book</h2><div class="fgrid" style="margin-top:14px">${field("st","Title",b.title)}${field("sa","Author",b.author || S.set.author_name || "")}<div><label>Cover</label><input id="sc" type="file" accept="image/*"></div>${field("sd","Description",b.description)}${field("sr","Expected Release Date",b.release_date,"date")}${field("ss","Status",b.status || "Coming Soon")}</div>
  <button class="btn" id="sSave">${editing ? "Update" : "Add"}</button><div class="tw" style="margin-top:20px"><table>${data.map(x => `<tr><td><b>${esc(x.title)}</b><br><span class="mu">${esc(x.release_date)} · ${esc(x.status)}</span></td><td><button class="btn sm ghost" data-se="${x.id}">✏️ Edit</button> <button class="btn sm red" data-sd="${x.id}">🗑️ Delete</button></td></tr>`).join("")}</table></div>`;
}
async function saveSoon(btn) {
  const v = id => $(id).value.trim(); if (!v("#st")) return toast("Please enter a title.");
  await safe(async () => { const row = { title:v("#st"), author:v("#sa"), description:v("#sd"), release_date:v("#sr") || null, status:v("#ss") };
    const c = await upload("book-covers", $("#sc").files[0], "Uploading Cover..."); if (c) row.cover_url = sb.storage.from("book-covers").getPublicUrl(c).data.publicUrl;
    const { error } = editing ? await sb.from("coming_books").update(row).eq("id", editing) : await sb.from("coming_books").insert(row); if (error) throw error;
    toast("Saved successfully"); editing = null; await loadAll(); renderAdmin(); }, btn, "Processing...");
}

// ===== ADMIN PAYMENT =====
async function aPay() {
  const { data, error } = await sb.from("orders").select("*, order_items(title)").order("created_at", { ascending:false }); if (error) throw error;
  return `<h2>Payment</h2><div class="tw" style="margin-top:14px"><table><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Email</th><th>Book(s)</th><th>Amount</th><th>Date</th><th>Payment</th><th>Status</th><th></th></tr>${data.map(o => `<tr><td>#${o.order_number}</td><td>${esc(o.customer_name)}</td><td>${esc(o.phone)}</td><td>${esc(o.email)}</td><td>${o.order_items.map(i => esc(i.title)).join(", ")}</td><td>${money(o.amount)}</td><td>${new Date(o.created_at).toLocaleDateString()}</td><td><b>${o.payment_status}</b></td><td>${esc(o.order_status)}</td><td>${o.payment_status === "Pending" ? `<button class="btn sm" data-pp="${o.id}|Paid">Mark Paid</button> <button class="btn sm red" data-pp="${o.id}|Cancelled">Cancel</button>` : ""}</td></tr>`).join("") || "<tr><td>No orders yet.</td></tr>"}</table></div>`;
}
async function setPay(id, st) {
  if (!confirm(st === "Paid" ? "Confirm you received this payment?" : "Cancel this order?")) return;
  await safe(async () => { const { error } = await sb.rpc("admin_set_payment", { p_order_id:id, p_status:st }); if (error) throw error; toast(st === "Paid" ? "Payment verified successfully" : "Order cancelled"); renderAdmin(); });
}

// ===== ADMIN CONTACT & SETTINGS =====
async function aMsg() {
  const { data, error } = await sb.from("contact_messages").select("*").order("created_at", { ascending:false }); if (error) throw error;
  const rv = (await sb.from("reviews").select("*, books(title)").order("created_at", { ascending:false }).limit(100)).data || [];
  return `<h2>Contact</h2><div class="tw" style="margin-top:14px"><table><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th><th>Status</th></tr>${data.map(m => `<tr><td>${esc(m.name)}</td><td>${esc(m.email)}</td><td>${esc(m.phone)}</td><td>${esc(m.message)}</td><td>${new Date(m.created_at).toLocaleDateString()}</td><td><select data-ms="${m.id}">${["Unread","Read","Resolved"].map(s => `<option ${m.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("") || "<tr><td>No messages yet.</td></tr>"}</table></div>
  <h3 style="margin:26px 0 10px">Reviews</h3><div class="tw"><table><tr><th>Book</th><th>Name</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr>${rv.map(r => `<tr><td>${esc(r.books?.title)}</td><td>${esc(r.name)}</td><td>${"★".repeat(r.rating)}</td><td>${esc(r.comment)}</td><td>${new Date(r.created_at).toLocaleDateString()}</td><td><button class="btn sm red" data-rd="${r.id}">🗑️ Delete</button></td></tr>`).join("") || "<tr><td>No reviews yet.</td></tr>"}</table></div>`;
}
const SET = [["site_name","Website Name"],["author_name","Author Name"],["about_author","About Author"],["contact_email","Contact Email"],["contact_phone","Contact Phone"],["upi_id","UPI ID"],["hero_heading","Hero Heading"],["hero_description","Hero Description"],["hero_1","Hero Image 1"],["hero_2","Hero Image 2"],["hero_3","Hero Image 3"],["hero_4","Hero Image 4"],["hero_5","Hero Image 5"],["hero_6","Hero Image 6"],["footer_text","Footer Text"],["instagram","Instagram"],["facebook","Facebook"],["youtube","YouTube"],["footer_email","Footer Email"]];
async function aSet() {
  const { data } = await sb.from("site_settings").select("*"); const s = Object.fromEntries(data.map(x => [x.key, x.value]));
  return `<h2>Settings</h2><div class="fgrid" style="margin-top:14px">${SET.map(([k, l]) => field("s_" + k, l, s[k] || "") + (k.startsWith("hero_") ? `<div><label>or upload ${l}</label><input type="file" accept="image/*" data-hu="${k}"></div>` : "")).join("")}</div><button class="btn" id="setSave">Save Settings</button>`;
}
async function saveSet(btn) {
  await safe(async () => {
    const rows = []; for (const [k] of SET) { let v = $("#s_" + k).value.trim(); const f = document.querySelector(`[data-hu="${k}"]`)?.files[0];
      if (f) { const p = await upload("hero-images", f, "Uploading Cover..."); v = sb.storage.from("hero-images").getPublicUrl(p).data.publicUrl; } rows.push({ key:k, value:v }); }
    const { error } = await sb.from("site_settings").upsert(rows); if (error) throw error; toast("Settings saved"); await loadAll(); renderAdmin();
  }, btn, "Processing...");
}

function bindAdmin() {
  const m = $("#am"), on = (s, f) => { const e = m.querySelector(s); if (e) e.onclick = ev => f(ev.target); };
  if ($("#bTbl")) { $("#bTbl").innerHTML = bookRows(); $("#bq").oninput = e => $("#bTbl").innerHTML = bookRows(e.target.value); }
  if ($("#bt")) $("#bt").onchange = e => { const p = TPL[e.target.value]; if (p) { $("#bi").value = p[0]; $("#bs").value = p[1]; $("#bab").value = p[2]; } };
  on("#bSave", saveBook); on("#bCancel", () => { editing = null; renderAdmin(); }); on("#sSave", saveSoon); on("#setSave", saveSet);
  m.onclick = ev => { const D = ev.target.dataset; if (D.be) { editing = D.be; renderAdmin(); } else if (D.bd) delBook(D.bd); else if (D.se) { editing = D.se; renderAdmin(); }
    else if (D.sd) { if (confirm("Are you sure you want to delete this?")) sb.from("coming_books").delete().eq("id", D.sd).then(() => { toast("Deleted successfully"); loadAll(); renderAdmin(); }); }
    else if (D.rd) { if (confirm("Delete this review?")) safe(async () => { const { error } = await sb.from("reviews").delete().eq("id", D.rd); if (error) throw error; toast("Review deleted"); const r = await sb.from("reviews").select("*").order("created_at", { ascending:false }); S.reviews = r.data || []; renderReviews(); renderAdmin(); }); }
    else if (D.pp) { const [i, s] = D.pp.split("|"); setPay(i, s); } };
  m.onchange = async ev => { const D = ev.target.dataset; if (D.ms) await safe(async () => { const { error } = await sb.from("contact_messages").update({ status:ev.target.value }).eq("id", D.ms); if (error) throw error; toast("Status updated"); }); };
}



