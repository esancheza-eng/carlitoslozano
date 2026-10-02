const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
const searchInput=document.getElementById("searchInput");
const cards=[...document.querySelectorAll(".product-card")];
const noResults=document.getElementById("noResults");

menuToggle?.addEventListener("click",()=>mainNav.classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>mainNav.classList.remove("open")));

searchInput?.addEventListener("input",()=>{
  const q=searchInput.value.toLowerCase().trim();
  let visible=0;
  cards.forEach(card=>{
    const match=(card.dataset.name+" "+card.innerText).toLowerCase().includes(q);
    card.style.display=match?"":"none";
    if(match) visible++;
  });
  noResults.style.display=visible?"none":"block";
});

document.getElementById("year").textContent=new Date().getFullYear();
