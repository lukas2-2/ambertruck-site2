# Telegram Worker (Cloudflare)

1) Cloudflare → Workers → Create Worker  
2) Вставь `worker.js`  
3) Добавь Secrets:
- BOT_TOKEN
- CHAT_ID

4) Deploy
5) В `config.js` на сайте вставь:
`TELEGRAM_ENDPOINT: "https://YOUR_WORKER_URL/order"`

Токен не хранится на GitHub Pages.
