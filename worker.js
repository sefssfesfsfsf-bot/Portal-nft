// Cloudflare Worker: принимает заказ с сайта и отправляет его в Telegram-бота.
// Секреты BOT_TOKEN и CHAT_ID задаются в настройках воркера, в код их вписывать не нужно.
const GIFTS={"Пряничное сердце": 481, "Шутовской колпак": 477, "Пасхальная корзина": 481, "Букет с купюрами": 481, "Дымящаяся сигара": 1303, "Сердце на кнопке": 549, "Бенгальский огонь": 481, "Золотая медаль": 460, "Пионы": 481, "Деревянный свиток": 481, "Обезьянка с тарелками": 687, "Ракета": 481, "Весёлая какашка": 481, "Змейка 2025": 400, "Новогодний носок": 445, "Леденцовая трость": 450, "Подарок 2025": 435, "Золотой значок": 481, "Happy B-Day": 481, "Тёмные носки": 470, "Змейка в шапке": 481, "Вишнёвый торт": 481, "Световой меч": 549, "Лунная мечеть": 481, "Факел": 481, "Статуя Свободы": 481, "Хоккейная маска": 857, "Пёс-рэпер": 481, "Фонарь": 481, "Лапша": 450, "Радужный леденец": 420, "Эскимо": 476, "Фламинго-круг": 479, "Пакетик": 481, "Рюкзак Telegram": 481, "Торт 8": 459};
const M=['Неон','Призрак','Кристалл','Лава','Нефрит','Мираж','Космос','Эхо'];
const C=[['Оникс','#52525e'],['Рубин','#e11d48'],['Сапфир','#2563eb'],['Изумруд','#10b981'],['Аметист','#8b5cf6'],['Янтарь','#f59e0b'],['Аквамарин','#22d3ee'],['Роза','#ff4fd8']];
const pick=a=>a[Math.floor(Math.random()*a.length)];
export default{async fetch(req,env){
  const cors={'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN||'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS'};
  const send=(c,o)=>new Response(JSON.stringify(o),{status:c,headers:{...cors,'Content-Type':'application/json'}});
  if(req.method==='OPTIONS')return new Response(null,{headers:cors});
  if(req.method!=='POST')return send(405,{error:'method'});
  try{
    const d=await req.json(),price=GIFTS[d.gift];
    const nick=String(d.nick||'').replace(/^@/,''),email=String(d.email||'').trim();
    if(!price||!/^[A-Za-z0-9_]{5,32}$/.test(nick)||!/^[^\s@<>&"']+@[^\s@<>&"']+\.[^\s@<>&"']{2,}$/.test(email))return send(400,{error:'bad'});
    const c=pick(C),r={model:pick(M),color:c[0],hex:c[1],number:'#'+String(Math.floor(Math.random()*99999)+1).padStart(5,'0')};
    const id=Date.now().toString(36).toUpperCase().slice(-6);
    const text=`🛒 Новый заказ ${id}\n\nПодарок: ${d.gift} (⭐ ${price}+)\nНик: @${nick}\nПочта: ${email}\n\n🎲 Рандомайзер\nМодель: ${r.model}\nЦвет: ${r.color}\nНомер: ${r.number}`;
    const tg=await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.CHAT_ID,text})});
    if(!tg.ok)return send(502,{error:'tg'});
    return send(200,r);
  }catch(e){return send(500,{error:'err'})}
}};
