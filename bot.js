const TelegramBot = require('node-telegram-bot-api');

const token = '8741255779:AAHHLKPjqwJokR6pPMfWFbgdIIaGMe2eWjo';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
`أدخل المعلومات بهذا الشكل:

الاسم / الرقم / المنتج / السعر / النوع (S أو P) / الايميل / الباسورد (اختياري) / المبلغ المدفوع / تم الدفع (اختياري)`
    );
});

bot.on('message', (msg) => {
    if (msg.text.includes('/start')) return;

    const data = msg.text.split('/');

    if (data.length < 5) {
        bot.sendMessage(msg.chat.id, "❌ أدخل المعلومات بشكل صحيح");
        return;
    }

    const name = data[0]?.trim();
    const phone = data[1]?.trim();
    const product = data[2]?.trim();
    const price = parseFloat(data[3]?.trim()) || 0;
    const type = data[4]?.trim().toLowerCase();
    const email = data[5]?.trim();
    const password = data[6]?.trim();
    const paidAmount = parseFloat(data[7]?.trim()) || 0;
    const paidText = data[8]?.trim();

    // نوع الحساب
    let accountType = "";
    if (type === "s") accountType = "🟡 Secondary";
    else if (type === "p") accountType = "🟢 Primary";

    // الإيميل + الباسورد
    let accountInfo = "";
    if (email) {
        accountInfo += `E-mail:\n${email}\n`;
        if (password) {
            accountInfo += `Password:\n${password}\n`;
        }
    }

    // الحساب المالي
    const remaining = price - paidAmount;

    let paymentInfo = `
قيمة: ${price}
المبلغ المدفوع: ${paidAmount}
الباقي: ${remaining}
`;

    if (paidText) {
        paymentInfo += `تم الدفع: ${paidText}`;
    }

    const invoice = `
════════════════
👤 ${name}
📞 ${phone}
════════════════
Merchant: STech Store
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
════════════════
⭐ ${product}
════════════════
${accountType ? accountType : ""}
—————————————————
${accountInfo}
════════════════
${paymentInfo}
—————————————————
🛡️ الضمان 12 شهر
⚠️ ممنوع تغيير البيانات
════════════════
`;

    bot.sendMessage(msg.chat.id, invoice);
});