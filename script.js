const $ = id => document.getElementById(id);
const missions = [
 {name:"Estudio creativo",title:"Crea la identidad de tu marca",intro:"Tu marca necesita una identidad coherente. Elige la propuesta que mejor conecte con el producto y el público que quieres atraer.",question:"Vas a crear una marca juvenil de accesorios. ¿Qué identidad visual sería más adecuada?",hint:"Piensa en una imagen actual, fácil de recordar y que conecte con jóvenes.",options:["Un logotipo moderno, colores vivos y tipografía clara","Un escudo clásico con letras difíciles de leer","Un diseño recargado con muchos colores sin relación"],correct:0,explain:"¡Muy bien! Una identidad moderna, legible y coherente ayuda a que una marca juvenil sea reconocible y se diferencie.",wrong:"Esta opción no comunica con claridad el estilo juvenil de la marca. Una identidad debe ser coherente, fácil de recordar y adecuada para el público.",reward:100,coins:80},
 {name:"Mercado comercial",title:"Conoce a tus clientes",intro:"Una marca crece cuando entiende a las personas a las que quiere llegar. Observa sus intereses antes de tomar una decisión.",question:"Tu producto son accesorios deportivos cómodos. ¿Qué público tendría mayor afinidad inicial?",hint:"Busca personas que practiquen actividad física y valoren la comodidad.",options:["Personas deportistas que entrenan varias veces por semana","Personas que buscan artículos de decoración para el hogar","Personas interesadas únicamente en libros antiguos"],correct:0,explain:"¡Excelente! Los deportistas tienen una necesidad relacionada con el producto. Después podrás investigar edad, presupuesto y hábitos de compra.",wrong:"El perfil elegido no tiene una relación directa con el producto. El público objetivo debe tener necesidades o intereses que tu marca pueda atender.",reward:120,coins:90},
 {name:"Agencia publicitaria",title:"Diseña una campaña efectiva",intro:"Tienes un presupuesto limitado. Elige el canal que te permita conectar mejor con el público definido en la misión anterior.",question:"Quieres promocionar accesorios deportivos entre jóvenes que usan contenido digital a diario. ¿Qué medio elegirías?",hint:"Piensa en el canal donde ese público descubre tendencias, creadores y productos.",options:["Videos cortos y publicaciones en redes sociales","Un aviso clasificado en un periódico antiguo","Un folleto entregado solo en oficinas empresariales"],correct:0,explain:"¡Campaña aprobada! El contenido en redes sociales puede facilitar el descubrimiento, la interacción y la demostración visual del producto.",wrong:"El canal puede tener alcance, pero no es el más alineado con los hábitos digitales del público definido. La publicidad debe adaptarse al cliente.",reward:150,coins:110},
 {name:"Centro de innovación",title:"Haz crecer tu emprendimiento",intro:"Tu primera campaña terminó. Revisa los resultados simulados y decide qué hacer para mejorar el negocio.",question:"La campaña tuvo muchas visitas, pero pocas personas compraron. ¿Qué deberías revisar primero?",hint:"Antes de gastar más, analiza si la oferta y la experiencia de compra responden a las expectativas.",options:["Revisar precio, descripción del producto y facilidad de compra","Invertir todo el presupuesto en más anuncios sin analizar","Cambiar el nombre de la marca cada semana"],correct:0,explain:"¡Decisión estratégica! Muchas visitas y pocas compras pueden indicar problemas en la oferta, el precio, la información o el proceso de compra.",wrong:"Aumentar la publicidad sin entender el problema puede desperdiciar recursos. Primero analiza los datos y detecta qué está frenando la compra.",reward:180,coins:140}
];
let completed = new Set();
let selected = null;
let currentMission = 0;
let attempts = 0;
let hintUsed = false;
let coins = 1000, xp = 0, level = 1;
let avatar = {character:1};
let currentProfile = "";
const avatarNames = ["Nova", "Alex", "Mika", "Leo", "Sam", "Dani"];

function getPlayerName(){
 return $("playerName").value.trim() || avatarNames[avatar.character - 1] || "Nova";
}

function updateHUD(){
 $("coins").textContent=coins.toLocaleString("es-CO");
 $("xp").textContent=xp;
 level=Math.floor(xp/250)+1;
 $("level").textContent=level;
 $("hudLevel").textContent=level;
 const playerName=getPlayerName();
 $("hudName").textContent=playerName;
 $("avatarName").textContent=playerName;
 const pct=completed.size/4*100;
 $("progressFill").style.width=pct+"%";
 $("progressText").textContent=`${completed.size} de 4 misiones completadas`;
 missions.forEach((m,i)=>{
  const mark=$("mark"+i);
  if(mark) mark.textContent=completed.has(i)?"⭐":(i===0||completed.has(i-1)?"🔓":"🔒");
  const btn=document.querySelector(`.building[data-mission="${i}"]`);
  if(btn) btn.classList.toggle("done",completed.has(i));
 });
 $("shopLevel").textContent=completed.size>=4?"Nivel 3 · Marca reconocida":completed.size>=2?"Nivel 2 · En crecimiento":"Nivel inicial";
 $("shopDescription").textContent=completed.size>=4?"¡Tu tienda es una marca reconocida en Market City!":completed.size>=2?"Tu negocio ya tiene identidad y una campaña activa.":"Una tienda vacía espera tu primera marca.";
 $("shopVisual").textContent=completed.size>=4?"🏬✨":completed.size>=2?"🏪🌟":"🏬";
}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openMission(index){
 if(index>0&&!completed.has(index-1)){showToast("Completa primero la misión anterior para desbloquear este lugar.");return;}
 if(completed.has(index)){showToast("¡Esta misión ya está completada! Puedes revisar otra zona.");return;}
 currentMission=index;selected=null;attempts=0;hintUsed=false;
 const m=missions[index];
 $("missionKicker").textContent=`MISIÓN ${index+1} · ${m.name.toUpperCase()}`;
 $("missionTitle").textContent=m.title;
 $("missionIntro").textContent=m.intro;
 $("missionProgress").style.width=(completed.size/4*100)+"%";
 $("feedbackBox").hidden=true;$("feedbackBox").className="feedback-box";
 $("missionBody").innerHTML=`<div class="question-label">${m.question}</div><div class="answer-options">${m.options.map((o,i)=>`<button type="button" class="answer-option" data-answer="${i}"><span class="letter">${String.fromCharCode(65+i)}</span>${o}</button>`).join("")}</div>`;
 document.querySelectorAll(".answer-option").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".answer-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=Number(b.dataset.answer);}));
 $("answerButton").textContent="COMPROBAR RESPUESTA";
 $("answerButton").onclick=checkAnswer;
 $("answerButton").disabled=false;
 $("hintButton").disabled=false;
 $("missionModal").classList.add("open");$("missionModal").setAttribute("aria-hidden","false");
}
function checkAnswer(){
 if(selected===null){showToast("Selecciona una respuesta antes de continuar.");return;}
 const m=missions[currentMission],box=$("feedbackBox");
 attempts++;
 document.querySelectorAll(".answer-option").forEach(x=>x.disabled=true);
 if(selected===m.correct){
  box.hidden=false;box.className="feedback-box good";box.innerHTML=`<b>✨ ¡Respuesta correcta!</b><br>${m.explain}<br><br><b>Recompensa:</b> +${m.reward} XP · +${m.coins} monedas`;
  document.querySelectorAll(".answer-option")[selected].classList.add("correct");
  if(!completed.has(currentMission)){completed.add(currentMission);xp+=m.reward;coins+=m.coins;updateHUD();}
  $("answerButton").textContent="CONTINUAR EXPLORANDO";
  $("answerButton").onclick=()=>{closeMission();showToast("¡Misión completada! Has desbloqueado nuevas oportunidades.");};
  $("hintButton").disabled=true;
 }else{
  box.hidden=false;box.className="feedback-box try";box.innerHTML=`<b>💡 ¡Puedes intentarlo otra vez!</b><br>${m.wrong}<br><br>Lee la pista y vuelve a elegir.`;
  document.querySelectorAll(".answer-option")[selected].classList.add("wrong");
  $("answerButton").textContent="INTENTAR DE NUEVO";
  $("answerButton").onclick=()=>{
   selected=null;
   document.querySelectorAll(".answer-option").forEach(x=>{x.disabled=false;x.classList.remove("selected","wrong");});
   box.hidden=true;
   $("answerButton").textContent="COMPROBAR RESPUESTA";
   $("answerButton").onclick=checkAnswer;
  };
 }
}
function closeMission(){$("missionModal").classList.remove("open");$("missionModal").setAttribute("aria-hidden","true");$("answerButton").onclick=checkAnswer;updateHUD();}
document.querySelectorAll("[data-mission]").forEach(btn=>btn.addEventListener("click",()=>openMission(Number(btn.dataset.mission))));
$("closeModal").addEventListener("click",closeMission);
$("missionModal").addEventListener("click",e=>{if(e.target===$("missionModal"))closeMission();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("missionModal").classList.contains("open"))closeMission();});
$("answerButton").onclick=checkAnswer;
$("hintButton").addEventListener("click",()=>{const m=missions[currentMission];const box=$("feedbackBox");box.hidden=false;box.className="feedback-box";box.innerHTML=`<b>🔎 Pista del asesor:</b><br>${m.hint}`;hintUsed=true;$("hintButton").disabled=true;});
function refreshAvatarPreview() {
 const image = $("avatarImage");
 if (image) image.src = `assets/avatar-${avatar.character}.png`;
 $("avatarName").textContent = getPlayerName();
}
document.querySelectorAll(".avatar-pick").forEach(btn => btn.addEventListener("click", () => {
 document.querySelectorAll(".avatar-pick").forEach(x => x.classList.remove("active"));
 btn.classList.add("active");
 avatar.character = Number(btn.dataset.avatar);
 const defaultName = avatarNames[avatar.character - 1];
 $("playerName").value = defaultName;
 refreshAvatarPreview();
 updateHUD();
 $("avatarNote").textContent = `Seleccionaste a ${defaultName}.`;
}));
$("playerName").addEventListener("input", () => {
 updateHUD();
});
$("saveAvatar").addEventListener("click", () => {
 updateHUD();
 refreshAvatarPreview();
 $("avatarNote").textContent = `¡${getPlayerName()} está listo para explorar Market City!`;
 showToast("¡Personaje confirmado!");
});
refreshAvatarPreview();

document.querySelectorAll(".character-card").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".character-card").forEach(card=>card.classList.remove("selected"));
 btn.classList.add("selected");
 showToast(`Rol seleccionado: ${btn.dataset.role}.`);
}));
document.querySelectorAll(".profile-card").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".profile-card").forEach(x=>x.classList.remove("active"));btn.classList.add("active");currentProfile=btn.dataset.profile;$("profileFeedback").textContent=currentProfile==="Estudiantes"?"Les interesan los precios accesibles, las tendencias y la personalización.":currentProfile==="Deportistas"?"Buscan comodidad, resistencia y productos que acompañen su entrenamiento.":"Valoran la calidad, el diseño funcional y una experiencia de compra sencilla."; }));
$("myShop").addEventListener("click",()=>{if(completed.size===0)showToast("Tu tienda está vacía. Empieza en el Estudio Creativo.");else showToast($("shopDescription").textContent);});
$("resetGame").addEventListener("click",()=>{if(confirm("¿Quieres reiniciar tu progreso en BrandQuest?")){completed=new Set();selected=null;currentMission=0;attempts=0;hintUsed=false;coins=1000;xp=0;updateHUD();showToast("Tu aventura en Market City comienza de nuevo.");}});
$("soundBtn").addEventListener("click",()=>showToast("La música estará disponible en una próxima versión."));
updateHUD();
