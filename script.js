let questions = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: 1
    },
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 1
    },
    // Add more questions as needed
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 45; // Timer starts at 45 seconds

// Start the quiz
function startQuiz() {
    // Hide the start section and show the quiz
    document.getElementById('student-info').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    
    // Display the first question
    displayQuestion();
    startTimer();
}

// Display the current question
function displayQuestion() {
    let question = questions[currentQuestionIndex];
    
    // Display the question and options
    document.getElementById('question').textContent = question.question;
    let options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.classList.remove('selected-option'); // Remove the highlight from any previous selection
    });
    
    // Hide the next button initially
    document.getElementById('next-btn').style.display = 'none';
}

// Start the timer for the current question
function startTimer() {
    timeLeft = 45; // Reset timer to 45 seconds
    document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
    
    timer = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer when it reaches 0
            nextQuestion(); // Proceed to the next question when time is up
        }
    }, 1000); // Update every second
}

// Select an option
function selectOption(index) {
    let options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected-option')); // Remove previous selection
    options[index].classList.add('selected-option'); // Highlight the selected option
    
    // Show the next button when an option is selected
    document.getElementById('next-btn').style.display = 'inline-block';
}

// Move to the next question
function nextQuestion() {
    // Stop the timer and evaluate the answer
    clearInterval(timer);
    
    let selectedOption = document.querySelector('.selected-option');
    if (selectedOption) {
        let selectedIndex = Array.from(selectedOption.parentElement.children).indexOf(selectedOption);
        let correctAnswer = questions[currentQuestionIndex].answer;

        if (selectedIndex === correctAnswer) {
            score++;
        }
    }

    // Go to the next question or finish the quiz
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        startTimer();
    } else {
        endQuiz();
    }
}

// End the quiz
function endQuiz() {
    // Hide the quiz section and show the result
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';

    // Display the score
    document.getElementById('score').textContent = score;
    
    // Save the student data and send it to Google Form
    saveStudentData();
}

// Save the student data and send it to Google Form
function saveStudentData() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let rollNumber = document.getElementById('roll-number').value;

    let studentRecord = { name, email, rollNumber, score };

    // Google Form Submit URL (replace with your form URL)
    const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLScX_tjZmO7EoHtNx9vA0Rxckv0VDEw3c99KvTd0hv_zdiH4XQ/formResponse";

    // Prepare the form data as a POST request using the updated entry IDs
    const formData = new FormData();
    formData.append("entry.1014193278", name);        // Name field
    formData.append("entry.551434709", email);         // Email field
    formData.append("entry.1304254405", rollNumber);   // Roll Number field
    formData.append("entry.907963779", score);         // Score field

    // Send the POST request to Google Form
    fetch(googleFormURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Form submitted successfully.");
        displayRecords(); // Update the records table in your app (if applicable)
    })
    .catch(error => {
        console.error("Error submitting form:", error);
    });
}


// Display the student records
function displayRecords() {
    let records = JSON.parse(localStorage.getItem('quizRecords')) || [];
    let tableBody = document.querySelector("#student-table tbody");
    tableBody.innerHTML = ""; // Clear existing records

    records.forEach((record, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.email}</td>
            <td>${record.rollNumber}</td>
            <td>${record.score}</td>
            <td><button onclick="deleteRecord(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete a student record
function deleteRecord(index) {
    let password = prompt("Enter password to delete record:");
    if (password === "2409") {
        let records = JSON.parse(localStorage.getItem('quizRecords')) || [];
        records.splice(index, 1); // Remove the record at the given index
        localStorage.setItem('quizRecords', JSON.stringify(records));
        displayRecords(); // Update the records table
    } else {
        alert("Incorrect password.");
    }
}

// Download the student records as an Excel file
function downloadExcel() {
    const records = JSON.parse(localStorage.getItem('quizRecords')) || [];
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Records");
    XLSX.writeFile(wb, "student_records.xlsx");
}

// Initialize the page by displaying existing records (if any)
displayRecords();
