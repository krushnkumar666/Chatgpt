const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn i");
const deleteButton = document.querySelector("#delete-btn");
const NewchatButton = document.querySelector("#newchat-btn");
const upperSideBottom = document.querySelector(".upperSideBottom");

let userText = null;
let API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
  const themeColor = localStorage.getItem("theme-color");
  document.body.classList.toggle("light-mode", themeColor === "light_mode");
  themeButton.classList.toggle(
    "fa-moon",
    document.body.classList.contains("light-mode")
  );
  themeButton.classList.toggle(
    "fa-sun",
    !document.body.classList.contains("light-mode")
  );

  const defaultText = `<div class="default-text">
    <h1>CHATgpt</h1>
    <p>
      Start a conversation and explore the power of AI. <br />
      Your Chat History displayed here ...
    </p>
  </div>`;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
loadDataFromLocalstorage();

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
    console.log(error);
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.textContent = "copied";
  setTimeout(() => {
    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
  }, 1000);
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
    <div class="chat-details">
      <img src="chat-logo.png" alt="" class="logo" />
      <div class="typing-animation">
        <div class="typing-dot" style="--delay: 0.2s"></div>
        <div class="typing-dot" style="--delay: 0.3s"></div>
        <div class="typing-dot" style="--delay: 0.4s"></div>
      </div>
    </div>
    <span onclick="copyResponse(this)" class="material-symbols-rounded"
      ><i class="fa-regular fa-copy"></i
    ></span>
  </div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;
  const queryBtn = document.createElement("button");

  queryBtn.classList.add("query");
  queryBtn.innerHTML = `
    <img src="msgicon.png" alt="" class="queryimg" />
    ${userText}
  `;
  upperSideBottom.appendChild(queryBtn);

  chatInput.value = "";
  chatInput.style.height = `${initialHeight}px`;

  const html = `<div class="chat-content">
  <div class="chat-details">
    <img src="ME1.jpg" alt="" />
    <p>
    </p>
  </div>
</div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButton.innerText);
  if (document.body.classList.contains("light-mode")) {
    themeButton.classList.remove("fa-sun");
    themeButton.classList.add("fa-moon");
    upperSideBottom.querySelector(".query").style.color = "#343541";
  } else {
    themeButton.classList.remove("fa-moon");
    themeButton.classList.add("fa-sun");
    upperSideBottom.querySelector(".query").style.color = "#ffffff";
  }
});

deleteButton.addEventListener("click", () => {
  if (confirm("You are deleting all chats !")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});
NewchatButton.addEventListener("click", () => {
  if (confirm("You are Opening  new Chat Window!")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = initialHeight + "px";
  chatInput.style.height = chatInput.scrollHeight + "px";
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

sendButton.addEventListener("click", handleOutgoingChat);
