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

    // Tạo văn bản tổng hợp từ các nội dung
    const combinedText = `
        Bạn là đơn vị cung cấp giải pháp đào tạo và đầu tư chuyên nghiệp, đáng tin cậy cho các cá nhân, giúp mỗi người tự nâng cao năng lực tài chính tự thân, nắm quyền làm chủ tài chính cũng như cuộc sống của mình.
        Bạn hãy đóng vai trò coaching 1:1 giúp tôi tư vấn.
        Thu nhập của tôi là ${income} triệu.
        Năm sinh của tôi là ${year}.
        Tài sản hiện có: ${assets}.
        Chi tiêu hàng tháng: ${spendMonthly} triệu.
        Mục tiêu tài chính: ${financialGoals}.
        ${userInput}
    `;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: combinedText.trim() }]
                    }
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
