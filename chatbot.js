function convertToHtml(text) {
    // Chuyển đổi các phần nhấn mạnh (bold) trong văn bản thành thẻ <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Chuyển đổi các phần danh sách (list) thành thẻ <ul> và <li>
    text = text.replace(/(?:\* (.*))/g, '<li>$1</li>');
    
    // Chuyển đổi các đoạn văn thành thẻ <p>
    text = text.replace(/\n/g, '<p></p>'); // Mỗi dòng mới sẽ là một đoạn <p>

    // Nếu bạn muốn thêm danh sách vào trong <ul>
    text = text.replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>');

    return text;
}

// Lưu thông tin vào localStorage
function saveInitialData() {
    const income = document.getElementById("income").value;
    const year = document.getElementById("year").value;
    const assets = document.getElementById("assets").value;
    const spendMonthly = document.getElementById("spendMonthly").value;
    const financialGoals = document.getElementById("financialGoals").value;

    

    // Lưu vào localStorage
    localStorage.setItem("income", income);
    localStorage.setItem("year", year);
    localStorage.setItem("assets", assets);
    localStorage.setItem("spendMonthly", spendMonthly);
    localStorage.setItem("financialGoals", financialGoals);

    // Hiển thị hộp chat và kích hoạt input
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("userInput").disabled = false;
    document.querySelector(".input-box button").disabled = false;

    // Gửi tin nhắn tự động sau khi lưu thông tin
    sendMessage();
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

    // Tạo văn bản tổng hợp từ các nội dung
    const combinedText = `
        Bạn là đơn vị cung cấp giải pháp đào tạo và đầu tư chuyên nghiệp, đáng tin cậy cho các cá nhân, giúp mỗi người tự nâng cao năng lực tài chính tự thân, nắm quyền làm chủ tài chính cũng như cuộc sống của mình.
        Bạn hãy đóng vai trò coaching 1:1 giúp tôi tư vấn.
        Thu nhập của tôi là ${income} triệu.
        Năm sinh của tôi là ${year}.
        Tài sản hiện có: ${assets}.
        Chi tiêu hàng tháng: ${spendMonthly} triệu.
        Rủi ro: ${financialGoals}.
        ${userInput}
    `;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCn4fx3boQ_qoWTrQIC_f1ZkZfW0VyEB5U", {
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
    messageDiv.innerHTML  = convertToHtml(text);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the bottom
}

// Lắng nghe sự kiện nhấn phím Enter để gửi tin nhắn
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Ngăn không cho tạo dòng mới khi nhấn Enter
        sendMessage();  // Gửi tin nhắn khi nhấn Enter
    }
});

// Lắng nghe sự kiện click vào nút "Send"
document.querySelector(".input-box button").addEventListener("click", function() {
    sendMessage();  // Gửi tin nhắn khi nhấn nút "Send"
});
