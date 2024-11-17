document.getElementById("noteForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const noteInput = document.getElementById("noteInput").value;
    const flashcardsContainer = document.getElementById("flashcardsContainer");
    
    flashcardsContainer.innerHTML = '';

    const response = await fetch('/generate-flashcards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: noteInput }),
    });
    
    const flashcards = await response.json();

    flashcards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'flashcard';
        cardElement.innerHTML = `
            <div class="question">${card.question}</div>
            <div class="answer">${card.answer}</div>
        `;
        flashcardsContainer.appendChild(cardElement);
    });
});

