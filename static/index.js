// <p> with question 
const questionTextForm = document.getElementById("question-text");
// buttons with answers
const answerButtons = document.getElementsByClassName("answer-button");

// This section prevents all the <a> tags I used from reloading the page
document.querySelectorAll('a').forEach(element => {
    element.onclick = (e) =>
    {
        e.preventDefault();
    }
});

// As soon as quiz data as JSON ir received, start the quiz
GetData().then(data => { 
    startQuiz(data);
});

// Function that receives questions and answers as JSON and returns it
async function GetData()
{
    const response = await fetch("https://opentdb.com/api.php?amount=5&category=15&difficulty=easy");
    const json = await response.json();
    return json.results;
}

var 
    data, // All five objects with questions, correct and incorrect answers
    questionIndex; // Index of a question a user is currently on

// Function that is called as soon as the data is received
function startQuiz(dataJSON)
{
    // Save all JSON data in a global variable
    data = dataJSON;
    console.log(data);
    
    // Start with the first question
    questionIndex = 0;
    
    // Add an eventlistener to each button which will detects an option a user chooses
    for(button of answerButtons)
    {
        button.addEventListener('click', submitAnswer);
    }

    // After everything is ready - display the first question
    displayQuestion(questionIndex);
}

var score = 0;
function submitAnswer(sender)
{
    // Get the button pressed
    let button = sender.target;

    // If the text of the pressed button is the same as correct answer - increment the score
    if (button.innerHTML == correctAnswer)
    {
        score++;
    }

    // If it was not the last question
    if (++questionIndex < 5)
    {
        // then display the next question
        displayQuestion(questionIndex)
    }
    else
    {
        // else display result and reload the page
        displayResult(score);
    }
}

// A variable that stores the correct answer
var correctAnswer;
function displayQuestion(i)
{
    // Display the question
    questionTextForm.innerHTML = data[i].question;

    // Save the correct answer
    correctAnswer = data[i].correct_answer;

    // Collect both incorrect and correct answers into an array 
    let answers = data[i].incorrect_answers.concat(correctAnswer);

    // shuffle the array
    answers = answers.sort(function () {
        return Math.random() - 0.5;
    });

    // Display the provided answers
    for(let j = 0; j < answerButtons.length; j++)
    {
        // if the answer is present 
        if (answers[j] != undefined)
        {
            // then display the answer in the button
            answerButtons[j].innerHTML = answers[j];

            // and ensure that the button is visible
            answerButtons[j].classList.remove("invisible");
        }
        else
        {
            // otherwise hide the button
            answerButtons[j].classList.add("invisible");
            
            // and clear its previous text
            answerButtons[j].innerHTML = "";

        }
    }
}

// A function that simply displays the score as an alert and reloads the page
function displayResult(score)
{
    alert("Total score: "+score);
    location.reload();
}