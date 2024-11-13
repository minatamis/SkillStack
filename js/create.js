document.addEventListener('DOMContentLoaded', function() {
    let questionCounter = 1;

  
    const addQuestionButton = document.getElementById('add-question-button');
    const questionSection = document.getElementById('question-section');

   
    function addNewQuestion() {
        questionCounter++;  
        

        const newQuestionDiv = document.createElement('div');
        newQuestionDiv.classList.add('question-section');
        newQuestionDiv.innerHTML = `
            <h2>Question ${questionCounter}</h2>
            <div class="question-container">
                <input type="text" placeholder="Write a Question..." />
                <input type="text" placeholder="Answer" />
                <input type="text" placeholder="Hint" />
                <button class="delete-button">Delete Question</button>
            </div>
        `;
        
  
        const deleteButton = newQuestionDiv.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            newQuestionDiv.remove();  
        });
        

        questionSection.appendChild(newQuestionDiv);
    }


    addQuestionButton.addEventListener('click', function(e) {
        e.preventDefault();
        addNewQuestion();  
    });
});
