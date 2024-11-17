// Lưu thông tin vào localStorage
function saveInitialData() {
    const income = document.getElementById("income").value;
    const year = document.getElementById("year").value;
    const assets = document.getElementById("assets").value;
    const spendMonthly = document.getElementById("spendMonthly").value;
    const financialGoals = document.getElementById("financialGoals").value;

    if (!income || !year || !assets || !spendMonthly || !financialGoals) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lưu vào localStorage
    localStorage.setItem("income", income);
    localStorage.setItem("year", year);
    localStorage.setItem("assets", assets);
    localStorage.setItem("spendMonthly", spendMonthly);
    localStorage.setItem("financialGoals", financialGoals);

    alert("Thông tin đã được lưu thành công!");

    // Hiển thị hộp chat và kích hoạt input
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("userInput").disabled = false;
    document.querySelector(".input-box button").disabled = false;
}

// Hàm gửi tin nhắn
async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    if (!userInput) return;

    displayMessage(userInput, "user-msg");
    document.getElementById("userInput").value = ""; // Clear the input box

    // Lấy thông tin từ localStorage
    const income = localStorage.getItem("income");
    const year = localStorage.getItem("year");
    const assets = localStorage.getItem("assets");
    const spendMonthly = localStorage.getItem("spendMonthly");
    const financialGoals = localStorage.getItem("financialGoals");

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
				    { role: "user", parts: [{ text: "Bạn là đơn vị cung cấp giải pháp đào tạo và đầu tư chuyên nghiệp, đáng tin cậy cho các cá nhân, giúp mỗi người tự nâng cao năng lực tài chính tự thân, nắm quyền làm chủ tài chính cũng như cuộc sống của mình." }] },
                    { role: "user", parts: [{ text: "Bạn hãy đóng vai trò coaching 1:1 giúp tôi tư vấn" }] },
                    { role: "user", parts: [{ text: "Thu nhập của tôi " + income + " triệu" }] },
                    { role: "user", parts: [{ text: "Năm sinh của tôi " + year }] },
                    { role: "user", parts: [{ text: "Tài sản hiện có " + assets }] },
                    { role: "user", parts: [{ text: "Chi tiêu hàng tháng " + spendMonthly }] },
                    { role: "user", parts: [{ text: "Mục tiêu tài chính " + financialGoals }] },
                    { role: "user", parts: [{ text: userInput }] }
                ]
            })
        });

        const data = await response.json();
        const botMessage = data.candidates[0].content.parts[0].text;

        displayMessage(botMessage, "bot-msg");

    } catch (error) {
        console.error("Error:", error);
        displayMessage("Xin lỗi, đã xảy ra lỗi.", "bot-msg");
    }
}

// Hiển thị tin nhắn trong giao diện
function displayMessage(text, className) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the bottom
}
