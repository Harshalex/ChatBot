const chatBody = document.querySelector(".chatbot-body");
const chatbotForm = document.querySelector(".chatbot-form");
const contactForm = document.querySelector(".contact-form")
const messageInput = document.querySelector(".input-text");
const sendMessage = document.getElementById("send-input");
const chatbotToggleer = document.querySelector("#chatbot-toggle") 
const closeChatbot = document.querySelector(".close-btn")
const chatbotMenu = document.querySelector(".chatbot-menu");
const chatbotBottom = document.querySelector(".chatbot-bottom");
const goBackButton = document.querySelector('#go-back');  
const goBackSecond = document.getElementById("go-back-second")
const contactButton = document.getElementById('contact');
const askingQues = document.getElementById("asking-ques");
const closeButton = document.getElementById("chatbot-close");

const API_KEY = "AIzaSyDmz0SIJ6AZKhAONgYrGQOhGqJtUHiSRxo"
const API_URl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
    message : null
}

const generateBotResponse = async (incomingMessageDiv) => {
    
    const messageElement = incomingMessageDiv.querySelector(".message-text")
    
    const requestOptions = {
        method : "POST",
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify({
            contents: [{
    parts:[{text: userData.message }]
    }]
        })
    }
      try {
        const response = await fetch(API_URl ,requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);
        const apiResponsetext = data.candidates[0].content.parts[0].text.trim(); 
        console.log(apiResponsetext)
        messageElement.innerText = apiResponsetext;
      } catch (error) {
         console.log(error)
      }
}

const createMessageElement = (content,...classes) => {
      const div = document.createElement("div");
      div.classList.add("common-message",...classes);
      div.innerHTML = content;
      return div;
}

const handelOutgoingMessage = (e) => {
    e.preventDefault();

    userData.message = messageInput.value.trim();
    messageInput.value = "";
    const messageContent = `<div class="message-text">${userData.message}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent,"user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);

    setTimeout(() => {
        const messageContent = ` <i class="ri-robot-3-fill"></i>
        <div class="message-text">
        <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
        </div>
        </div>`;

        const incomingMessageDiv = createMessageElement(messageContent,"bot-message","thinking");
        chatBody.appendChild(incomingMessageDiv)

        generateBotResponse(incomingMessageDiv);
    },600)
    
}


messageInput.addEventListener("keydown" , (e) => {
   const userMessage = e.target.value.trim();
   if(e.key ==="Enter" && userMessage){
       console.log(userMessage);
       handelOutgoingMessage(e);
   }
})

sendMessage.addEventListener("click",(e)=>{
     handelOutgoingMessage(e);
})
 
function goBackToMainMenu(){
    chatbotMenu.style.display = "block";
    contactForm.style.display = "none";
    chatBody.style.display = "none";
    chatbotBottom.style.display="none"
}

function contactUs(){
    chatbotMenu.style.display = "none";
    contactForm.style.display = "block";
    chatBody.style.display = "none";
    chatbotBottom.style.display="none"
}

function handelchatbody(){
    chatBody.style.display = "block";
    chatbotMenu.style.display = "none";
    contactForm.style.display = "none";
    chatbotBottom.style.display="block"
}

contactButton.addEventListener('click',contactUs);
askingQues.addEventListener('click',handelchatbody)
goBackButton.addEventListener('click',goBackToMainMenu)
goBackSecond.addEventListener('click',goBackToMainMenu)

const form = document.getElementById('input-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const contactInput = document.getElementById('contact-num');
const resumeInput = document.getElementById('resume');


// Event listener for form submission
const formData = new FormData();

// Event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the values from the inputs
    const name = nameInput.value;
    const email = emailInput.value;
    const contact = contactInput.value;
    const resume = resumeInput.files[0];

    // Check if a resume file is selected
    if (!resume) {
        alert("Please select a resume file.");
        return;
    }

    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("resume", resume);

    async function call() {
        const url = "http://localhost:3000/upload";
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData, // No need to set Content-Type, it will be handled by browser
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            alert('Email sent successfully!');
        } catch (error) {
            console.log(error)
            console.log('Error:', error.message);
            alert('There was an error sending your request.');
        }
    }
    call();
});

// console.log("Name:", name);
// console.log("Email:", email);
// console.log("Contact:", contact);
// console.log("Resume:", resume);

chatbotToggleer.addEventListener('click',() => {
    document.body.classList.toggle('show-chatbot');
})

closeButton.addEventListener('click',() => {
    document.body.classList.toggle('show-chatbot');
})

