document.addEventListener("DOMContentLoaded", () => {
    const questionsData = JSON.parse(sessionStorage.getItem("checkedQuestions"));
    const exerciseSection = document.getElementById("exercise-section");

    if (questionsData && exerciseSection) {
        questionsData.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p id="qNumber">Question ${index + 1}</p>
                <p id="hint">${question.hint}</p>
                <div class="editor" style="background-color: ${
                    question.isCorrect ? "lightgreen" : "lightcoral"
                };"> ${question.userAnswer}</div>
                <p><strong>Hint:</strong> ${question.question}</p>
                <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
                <hr>
            `;
            exerciseSection.appendChild(questionDiv);
        });
    } else {
        console.error("No data found for checked questions!");
    }
});

document.getElementById("answer-again-btn").addEventListener("click", function() {
    window.location.href = "exercise-list.html";
});