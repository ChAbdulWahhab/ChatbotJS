const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatBox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');

let userMessage;
const API_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
const inputInitHeight = chatInput.scrollHeight;

// Function to create chat message element
const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"><i class='bx bxs-message-square-dots'></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Function to generate response from API
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }

    // Send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        console.log(error);messageElement.textContent = "Oops! Something went wrong here. Please try again.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

// Function to handle user message
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    // Check question limit before sending message
    if (!handleQuestion(userMessage)) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`

    // Append the user's message to the chatbox
    chatBox.appendChild(createChatLi(userMessage, 'outgoing'));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Typing...", "incoming")
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// Event listeners
chatInput.addEventListener('input', () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${scrollHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
});

chatInput.addEventListener('keydown', (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, send the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener('click', handleChat);
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'));
chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));

const toggleFullScreen = () => {
    const chatbot = document.querySelector('.chatbot');
    chatbot.classList.toggle('fullscreen');

    // Add a class to indicate when fullscreen is active
    chatbot.classList.toggle('fullscreen-active');

    // Rotate the fullscreen button if fullscreen is active
    if (chatbot.classList.contains('fullscreen-active')) {
        fullscreenButton.style.transform = 'rotate(-180deg)';
    } else {
        fullscreenButton.style.transform = 'rotate(0deg)';
    }
}

const fullscreenButton = document.querySelector('.fullscreen-button');
fullscreenButton.addEventListener('click', toggleFullScreen);

// Constants for question limit
const MAX_QUESTIONS = 10; // Max questions allowed in 15 minutes
const WINDOW_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

// Variables for question limit
let questionCount = 0; // Keeps track of current question count
let lastQuestionTime = 0; // Timestamp of the last question

// Function to check if the question limit is reached
function isQuestionLimitReached() {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastQuestionTime;

    // Reset counter and timestamp if enough time has passed
    if (timeDifference > WINDOW_TIME) {
        questionCount = 0;
        lastQuestionTime = currentTime;
        return false;
    }

    // Check if user has reached the limit within the window
    return questionCount >= MAX_QUESTIONS;
}

// Function to handle user question and display error message
function handleQuestion(question) {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastQuestionTime;
    const notLimit = document.querySelector('.not-alert');

    // Reset counter and timestamp if enough time has passed
    if (timeDifference > WINDOW_TIME) {
        questionCount = 0;
        lastQuestionTime = currentTime;
    }

    if (questionCount >= MAX_QUESTIONS) {
        // Show the popup with animation
        notLimit.style.top = '9.5%';
        notLimit.style.opacity = '1';

        // Hide the popup after 3 seconds with fadeout animation
        setTimeout(() => {
            notLimit.style.top = '-100%';
            notLimit.style.opacity = '0';
        }, 3000);

        return false;
    }
    // Process user question and provide response logic here

    // Update question count and timestamp
    questionCount++;
    lastQuestionTime = currentTime;

    return true;
}

// Example usage:
handleQuestion("What is the weather like today?");
handleQuestion("What is the meaning of life?");
