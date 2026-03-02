export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response("", { headers: cors() });
    }
    if (request.method !== "POST") {
      return new Response("Use POST", { status: 405, headers: cors() });
    }
    const url = new URL(request.url);
    if (!url.pathname.endsWith("/order")) {
      return new Response("Not found", { status: 404, headers: cors() });
    }

    const payload = await request.json();
    const { phone, comment, items, total, city } = payload || {};
    if (!phone || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ ok:false, error:"Bad payload" }), {
        status: 400,
        headers: { ...cors(), "content-type":"application/json" }
      });
    }

    const fmt = (n) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

    let text = "🛒 Заказ с сайта AMBERTRUCK JM93\n";
    text += `📞 Телефон: ${phone}\n`;
    if (city) text += `📍 Город: ${city}\n`;
    if (comment) text += `💬 Комментарий: ${comment}\n`;
    text += "\nСостав заказа:\n";
    items.forEach((it, i) => {
      text += `${i+1}) ${it.name} (код ${it.code || "-"}) • ${it.qty} шт • ${fmt(it.sum)}\n`;
    });
    text += `\nИтого: ${fmt(total)}\n`;

    const tgUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
    const res = await fetch(tgUrl, {
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text })
    });
    const data = await res.json();
    return new Response(JSON.stringify({ ok: !!data.ok }), {
      headers: { ...cors(), "content-type":"application/json" }
    });
  }
};

function cors(){
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
