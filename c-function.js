
const userinput =document.querySelector(".user-input textarea");
const sendChatbtn= document.querySelector(".user-input span");
const chatbotToggler= document.querySelector(".chatbot-toggler");
const chatbox= document.querySelector(".chatbox");
const chatbotCloseBtn= document.querySelector(".close-btn");


let userMessage;
const API_KEY="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";
const inputInitHeight= userinput.scrollHeight;

const createChatLi =(message, className) => {
	// Create a chat <li> element with passed message and className
	const chatLi = document.createElement("li");
	chatLi.classList.add("chat", className);
	let chatContent = className === "chat-outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`; // Create the chat content
	chatLi.innerHTML = chatContent;
	chatLi.querySelector("p").textContent = message;
	return chatLi;
}

const generateResponse=(incoming) => {
	const API_URL= "https://api.openai.com/v1/chat/completions";
	const MessageElement= incoming.querySelector("p");

	const requestOptions ={
		method: "POST",
		headers:{
			"Content-Type": "application/json",
			"Authorization": `Bearer ${API_KEY}`
		},
		body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [{role: "user", content: userMessage}]
		})
	}

	//Send Post request to API, get response
	fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
		MessageElement.textContent = data.choices[0].message.content;
	}).catch((_error) =>{
		MessageElement.classList.add("error");
		MessageElement.textContent="Oops! Something was wrong. please try again";
	}).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
}

const handleChat =() =>{
	userMessage = userinput.value.trim();
	if (!userMessage) return;
	userinput.value ="";
	userinput.style.height = `${inputInitHeight}px`;


	//Append the user's message to the chatbox
	chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
	chatbox.scrollTo(0, chatbox.scrollHeight);


	setTimeout(() =>{
		//Display "Responding..." msg while waiting for the response
		const incomingChatLi=createChatLi("Responding...", "incoming");
		chatbox.appendChild(incomingChatLi);
		chatbox.scrollTo(0, chatbox.scrollHeight);
		generateResponse(incomingChatLi);
	},300);
}

userinput.addEventListener("input", () => {
	// Adjust the height of the input textarea based on its content
	userinput.style.height = `${inputInitHeight}px`;
	userinput.style.height = `${userinput.scrollHeight}px`;
});

userinput.addEventListener("keydown", (e) => {
	// If Enter key is pressed without Shift key and the window
	// width is greater than 800px, handle the chat

	if(e.key==="Enter" && !e.shiftKey && window.innerWidth >800){
		e.preventDefault();
		handleChat();
	}
});

chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
sendChatbtn.addEventListener("click", handleChat);