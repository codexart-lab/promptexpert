// Placeholder for interactive JavaScript functions

console.log("Prompt Power scripts loaded!");

// Function for simple multiple-choice quiz feedback
function checkAnswer(questionName, correctAnswer, feedbackElementId) {
    const feedbackElement = document.getElementById(feedbackElementId);
    const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);

    if (selectedOption) {
        if (selectedOption.value === correctAnswer) {
            feedbackElement.textContent = "Correct! Great job!";
            feedbackElement.style.color = "green";
        } else {
            feedbackElement.textContent = "Not quite! Try thinking about it again.";
            feedbackElement.style.color = "red";
        }
    } else {
        feedbackElement.textContent = "Please select an answer first!";
        feedbackElement.style.color = "orange";
    }
}

// --- Functions for Drag and Drop --- 
function allowDrop(ev) {
    ev.preventDefault(); // Necessary to allow dropping
}

function drag(ev) {
    // Store the id of the element being dragged
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text"); // Get the id of the dragged element
    const draggedElement = document.getElementById(data);
    const dropZone = ev.target;

    // Ensure we are dropping onto a valid drop zone div, not text inside it
    let targetZone = dropZone;
    if (!targetZone.hasAttribute("ondrop")) {
        targetZone = dropZone.closest("[ondrop]");
    }

    // Find the feedback element dynamically within the same drag-drop container
    const dragDropContainer = targetZone ? targetZone.closest(".drag-drop") : null;
    const feedbackElement = dragDropContainer ? dragDropContainer.querySelector("p[id^=\"feedback-\"][id$=\"-drag\"]") : null;
    const taskContainerId = dragDropContainer ? dragDropContainer.querySelector("div[id$='-drag-tasks'], div[id$='-drag-techs']").id : null;

    if (!feedbackElement) {
        console.error("Could not find feedback element for drag-drop.");
        return; 
    }

    if (targetZone && targetZone.dataset.task === data) {
        // Correct drop: Append the element and provide positive feedback
        // Prevent dropping multiple items in one zone if it already has a dragged item
        if (targetZone.children.length > 0 && targetZone.children[0].draggable === false) {
             feedbackElement.textContent = "This spot is already filled correctly!";
             feedbackElement.style.color = "orange";
             return;
        }
        // Clear existing content before appending (in case it was just placeholder text)
        while (targetZone.firstChild) {
            targetZone.removeChild(targetZone.firstChild);
        }
        targetZone.appendChild(draggedElement);
        draggedElement.style.backgroundColor = "#90ee90"; // Light green for correct
        draggedElement.style.cursor = "default";
        draggedElement.draggable = false; // Disable further dragging
        feedbackElement.textContent = "Correct Match!";
        feedbackElement.style.color = "green";

        // Check if all items are dropped correctly
        if (taskContainerId) {
            checkAllDropped(taskContainerId, feedbackElement.id);
        }
    } else if (targetZone) {
        // Incorrect drop: Provide negative feedback
        feedbackElement.textContent = "Oops! That doesn\"t seem right. Try again!";
        feedbackElement.style.color = "red";
    } else {
         // Dropped outside a valid zone
         feedbackElement.textContent = "Try dropping it in one of the boxes!";
         feedbackElement.style.color = "orange";
    }
}

function checkAllDropped(taskContainerId, feedbackElementId) {
    const taskContainer = document.getElementById(taskContainerId);
    const feedbackElement = document.getElementById(feedbackElementId);
    
    // Check if the task container only has its initial <p> element left (or is empty)
    let draggableItemsLeft = 0;
    if (taskContainer) {
        for (let i = 0; i < taskContainer.children.length; i++) {
            if (taskContainer.children[i].draggable) {
                draggableItemsLeft++;
            }
        }
    }

    if (draggableItemsLeft === 0 && feedbackElement) { 
         feedbackElement.textContent = "All matched correctly! Well done!";
         feedbackElement.style.color = "blue";
    }
}
// --- End Drag and Drop --- 

// Function for checking the improved prompt (Module 2)
function checkFixPrompt(textareaId, feedbackElementId) {
    const textareaElement = document.getElementById(textareaId);
    const feedbackElement = document.getElementById(feedbackElementId);
    const userPrompt = textareaElement.value.trim();

    // Basic check: Is it longer and more specific than "Tell me about dogs."?
    if (userPrompt.length > 20 && userPrompt.toLowerCase() !== "tell me about dogs.") {
        feedbackElement.textContent = "Great improvement! That gives the AI much more detail to work with.";
        feedbackElement.style.color = "green";
    } else if (userPrompt.length > 18) { // Slightly more than original
        feedbackElement.textContent = "Good start! Try adding even more specific details about *what* you want to know.";
        feedbackElement.style.color = "orange";
    } else {
        feedbackElement.textContent = "Try adding more details! What specifically about dogs interests you? (e.g., breeds, training, history)";
        feedbackElement.style.color = "red";
    }
}

// Function for Simple Chat Simulation
function sendChatMessage(moduleId) {
    const inputElement = document.getElementById(`chat-input-${moduleId}`);
    const chatBox = document.getElementById(`chat-${moduleId}`);
    const userMessage = inputElement.value.trim();

    if (userMessage) {
        // Display user message
        const userPara = document.createElement("p");
        userPara.innerHTML = `<strong>You:</strong> ${userMessage}`;
        chatBox.appendChild(userPara);

        // Simple canned responses from Sparky based on module
        let sparkyResponse = "That's interesting!"; // Default response
        if (moduleId === 'm1') {
            sparkyResponse = "Cool! Asking questions is how we learn about AI!";
        } else if (moduleId === 'm2') {
            if (userMessage.toLowerCase().includes("story") || userMessage.toLowerCase().includes("write")) {
                sparkyResponse = "Great start! Remember to add details like *what kind* of story!";
            } else {
                sparkyResponse = "Nice prompt idea! Specific details help me understand better.";
            }
        } else if (moduleId === 'm3') {
             if (userMessage.toLowerCase().includes("act as")) {
                sparkyResponse = "Ooh, a role-play! I like those! What should I do next?";
            } else if (userMessage.toLowerCase().includes("poem") || userMessage.toLowerCase().includes("list")) {
                 sparkyResponse = "Got it! Asking for a specific format is a smart move!";
            } else if (userMessage.toLowerCase().includes("explain")) {
                 sparkyResponse = "Explaining things is fun! Did my explanation make sense?";
            } else {
                sparkyResponse = "Keep experimenting! Trying different techniques is key.";
            }
        }
        // Add more module-specific logic later if needed for m4, m5

        // Display Sparky's response (with a slight delay)
        setTimeout(() => {
            const sparkyPara = document.createElement("p");
            sparkyPara.innerHTML = `<strong>Sparky:</strong> ${sparkyResponse}`;
            chatBox.appendChild(sparkyPara);
            // Scroll to bottom
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500); // 0.5 second delay

        // Clear input
        inputElement.value = "";
        // Scroll to bottom immediately for user message
        chatBox.scrollTop = chatBox.scrollHeight;
    }
      }
