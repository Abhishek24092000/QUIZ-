const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: 2
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
        correctAnswer: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let studentName, studentEmail, studentRollNumber;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const timerElement = document.getElementById('timer');
const nextBtn = document.getElementById('next-btn');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');
const studentInfoElement = document.getElementById('student-info');
const quizElement = document.getElementById('quiz');
const studentTableBody = document.getElementById('student-table').getElementsByTagName('tbody')[0];

// Start Quiz after taking student info
function startQuiz() {
    studentName = document.getElementById('name').value;
    studentEmail = document.getElementById('email').value;
    studentRollNumber = document.getElementById('roll-number').value;

    if (!studentName || !studentEmail || !studentRollNumber) {
        alert("Please fill in all fields.");
        return;
    }

    studentInfoElement.style.display = 'none';
    quizElement.style.display = 'block';
    startTimer();
    loadQuestion();
}

// Timer logic
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        } else {
            timeLeft--;
            timerElement.innerHTML = `Time Left: ${timeLeft}s`;
        }
    }, 1000);
}

// Load a question
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    
    const options = currentQuestion.options;
    optionsElement.innerHTML = '';
    options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.classList.add('option');
        optionBtn.innerText = option;
        optionBtn.onclick = () => selectOption(index, optionBtn);
        optionsElement.appendChild(optionBtn);
    });
}

// Select an option
function selectOption(index, button) {
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;

    // Mark the selected option
    button.classList.add('selected-option');
    
    // Disable all other options
    const buttons = document.querySelectorAll('.option');
    buttons.forEach(btn => btn.disabled = true);

    // Check if the selected answer is correct
    if (index === correctAnswer) {
        score++;
    }

    nextBtn.style.display = 'block';
}

// Move to the next question or show results
function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        nextBtn.style.display = 'none';
        timeLeft = 30; // reset timer for the next question
    } else {
        showResult();
    }
}

// Show result and save record
function showResult() {
    resultElement.style.display = 'block';
    scoreElement.innerText = score;
    
    // Save the student record in localStorage
    const studentRecord = {
        name: studentName,
        email: studentEmail,
        rollNumber: studentRollNumber,
        score: score
    };
    saveRecord(studentRecord);

    // Hide quiz container
    quizElement.style.display = 'none';
}

// Save the student's record
function saveRecord(record) {
    let records = JSON.parse(localStorage.getItem('quizRecords')) || [];
    
    // Check if the student is already in the records
    const existingRecordIndex = records.findIndex(r => r.rollNumber === record.rollNumber);
    
    if (existingRecordIndex === -1) {
        // If student doesn't exist, add the new record
        records.push(record);
    } else {
        // If student exists, update their score
        records[existingRecordIndex].score = record.score;
    }

    localStorage.setItem('quizRecords', JSON.stringify(records));
    displayRecords(); // Update the records table
}

// Display student records in the table
function displayRecords() {
    const records = JSON.parse(localStorage.getItem('quizRecords')) || [];
    studentTableBody.innerHTML = ''; // Clear the existing table rows
    records.forEach((record, index) => {
        const row = studentTableBody.insertRow();
        row.insertCell(0).innerText = record.name;
        row.insertCell(1).innerText = record.email;
        row.insertCell(2).innerText = record.rollNumber;
        row.insertCell(3).innerText = record.score;

        // Add delete button to each record
        const deleteCell = row.insertCell(4);
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => deleteRecord(index);
        deleteCell.appendChild(deleteBtn);
    });
}

// Delete student record
function deleteRecord(index) {
    const password = prompt("Enter password to delete record:");
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
