// ======================================= Import Supabase Config ============================================================
import { client } from "./subaConfig.js";

// ======================================= DOM Elements ======================================================================
const usersignup = document.getElementById("usersignup");
const userlogin = document.getElementById("userlogin");

const name = document.getElementById("name");
const useremail = document.getElementById("email");
const userpassword = document.getElementById("password");

const loginemail = document.getElementById("loginemail");
const loginpassword = document.getElementById("loginpassword");

const signupAcc = document.getElementById("signbtn");
const toggleSignup = document.querySelector(".toggleSignup");

const loginAcc = document.getElementById("loginbtn");
const toggleLogin = document.querySelector(".toggleLogin");
const logoutBtn = document.getElementById("logout");

// ======================================= Sign Up Handler ====================================================================
if (signupAcc) {
  signupAcc.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!name.value || !useremail.value || !userpassword.value) {
      Swal.fire("Oops!", "Please fill in all fields", "warning");
      return;
    }

    showLoader(); //  Show loader

    const { data, error } = await client.auth.signUp({
      email: useremail.value,
      password: userpassword.value,
    });

    if (error) {
      hideLoader();
      Swal.fire("Error", error.message, "error");
      return;
    }
    const { error: insertError } = await client.from("user_quizes").insert({
      id: data.user.id,
      full_name: name.value,
      email: useremail.value,
    });

    if (insertError) {
      Swal.fire("Error", insertError.message, "error");
      return;
    }

    Swal.fire(
      "Success! Signed up ",
      "You have signed up successfully! Please check your Email"
    );

    name.value = "";
    useremail.value = "";
    userpassword.value = "";
    // After everything
    hideLoader(); //  Hide loader
  });
}
// ======================================= Login Handler ======================================================================
if (loginAcc) {
  loginAcc.addEventListener("click", async (e) => {
    e.preventDefault();
    showLoader();

    const { data, error } = await client.auth.signInWithPassword({
      email: loginemail.value,
      password: loginpassword.value,
    });

    hideLoader();
    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    Swal.fire("Login", "Login successful!", "success");
    window.location.href = "quiz_app.html";
  });
}
// ======================================= loader Handle  =====================================================================

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// ======================================= Logout Handler =====================================================================

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    showLoader();

    const { error } = await client.auth.signOut();

    hideLoader();
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Logged Out", "You have been logged out!", "success");
      window.location.href = "index.html";
    }
  });
}

// ======================================= Form Switchers =====================================================================
if (toggleSignup) {
  toggleSignup.addEventListener("click", () => {
    userlogin.style.display = "none";
    usersignup.style.display = "block";
  });
}
if (toggleLogin) {
  toggleLogin.addEventListener("click", () => {
    usersignup.style.display = "none";
    userlogin.style.display = "block";
  });
}

// ======================================= Redirect on Auth Check =============================================================
async function checkAuth() {
  const {
    data: { session },
  } = await client.auth.getSession();
  const currentPage = window.location.pathname.split("/").pop();

  if (session && currentPage === "index.html") {
    window.location.href = "quiz_app.html";
  } else if (!session && currentPage === "quiz_app.html") {
    window.location.href = "index.html";
  }
}

const currentPage = window.location.pathname.split("/").pop();
if (currentPage === "quiz_app.html" || currentPage === "index.html") {
  checkAuth();
}

// add to quizes from quizestrt file strt
const questions = [
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "let", "const", "all of these"],
    answer: "all of these",
  },
  {
    question: "What is the correct syntax to call a function in JavaScript?",
    options: [
      "functionName()",
      "call(functionName)",
      "execute(functionName)",
      "run(functionName)",
    ],
    answer: "functionName()",
  },
  {
    question: "What does the '==' operator do in JavaScript?",
    options: ["Strict equality", "Loose equality", "Assignment", "Comparison"],
    answer: "Loose equality",
  },
  {
    question: "Which symbol is used to define an array in JavaScript?",
    options: ["{}", "[]", "()", "<>"],
    answer: "[]",
  },
  {
    question: "What does 'null' mean in JavaScript?",
    options: ["Undefined value", "Null value", "Empty string", "False"],
    answer: "Null value",
  },
  {
    question: "What is the purpose of the 'if' statement in JavaScript?",
    options: [
      "To run a loop",
      "To check a condition",
      "To define a function",
      "To declare a variable",
    ],
    answer: "To check a condition",
  },
  {
    question: "What is the purpose of a 'for' loop in JavaScript?",
    options: [
      "To repeat code",
      "To define a function",
      "To declare a variable",
      "To create an object",
    ],
    answer: "To repeat code",
  },
  {
    question: "What does 'console.log()' do in JavaScript?",
    options: [
      "Displays output",
      "Throws an error",
      "Defines a variable",
      "Creates a function",
    ],
    answer: "Displays output",
  },
  {
    question: "What does the 'typeof' operator do in JavaScript?",
    options: [
      "Checks data type",
      "Type casting",
      "Type conversion",
      "Deletes type",
    ],
    answer: "Checks data type",
  },
  {
    question: "What is the role of the 'return' statement in JavaScript?",
    options: [
      "To return a value from a function",
      "To stop the code",
      "To declare a variable",
      "To break a loop",
    ],
    answer: "To return a value from a function",
  },
];

let currentQuestionIndex = 0; // Abhi ka question number
let score = 0; // Score
let timerInterval; // Timer ke liye
let timeLeft = 10; // Har question ke liye 10 second

const showDiv = document.getElementById("showDiv");
const submitBtn = document.getElementById("submitBtn");
const startBtn = document.getElementById("startBtn");

// Question dikhaane ke liye function
function loadQuestion() {
  // Pehle saara content hata do
  showDiv.innerHTML = "";
  // Timer reset karo
  timeLeft = 10;
  clearInterval(timerInterval); // Pura timer band karo
  // Current question uthao
  const q = questions[currentQuestionIndex];
  // Question aur options banakar dikhao
  const show = `
    <div class="quiz-box">
      <div class="question">${currentQuestionIndex + 1}. ${q.question}</div>
      <div class="options">
        ${q.options
          .map(
            (opt) => `
          <label>
            <input type="radio" name="answer" value="${opt}">
            ${opt}
          </label>
        `
          )
          .join("")}
      </div>
      <div id="timer">⏱️ ${timeLeft} sec</div>
    </div>
  `;
  showDiv.innerHTML = show; // Naya question
  submitBtn.style.display = "inline-block"; // Submit button
  startTimer(); // Timer shuru
}

// Timer on
function startTimer() {
  // Timer display
  document.getElementById("timer").innerText = `⏱️ ${timeLeft} sec`;
  // Har second ke liye
  timerInterval = setInterval(() => {
    timeLeft--; // 1 second kam
    document.getElementById("timer").innerText = `⏱️ ${timeLeft} sec`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval); // Timer band
      checkAnswer(); // Time khatam hone ke baad answer check kara
    }
  }, 1000);
}

// Answer check karne ka function
function checkAnswer() {
  clearInterval(timerInterval); // Timer band kara
  const selectedRadio = document.querySelector('input[name="answer"]:checked'); // Jo answer select hai
  const userAnswer = selectedRadio ? selectedRadio.value : null; // Agar answer hai to uski value
  const correctAnswer = questions[currentQuestionIndex].answer; // Sahi answer
  if (userAnswer === correctAnswer) {
    score++; // Sahi answer pe score badhao
  }
  currentQuestionIndex++; // Next question ke liye badhao
  if (currentQuestionIndex < questions.length) {
    loadQuestion(); // Agla question dikhao
  } else {
    showResult(); // Sab questions ke baad result dikhao
  }
}

async function showResult() {
  showLoader();
  //  Get current user
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  try {
    //  Check if user is logged in
    if (!user) {
      Swal.fire("Oops!", "User is not logged in", "warning");
      return;
    }

    //  Fetch that user's quiz data
    const { data, error } = await client
      .from("user_quizes")
      .select()
      .eq("email", user.email);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    // ✅ Show Div Content
    showDiv.innerHTML = `
      <h2 class="result-title">🎉 Quiz Result</h2>
      <div class="result-container">
        <table class="result-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Total Questions</th>
              <th>Correct Answers</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody id="resultBody"></tbody>
        </table>
      </div>
    `;
    const resultBody = document.getElementById("resultBody");

    data.forEach((element) => {
      let message = "";
      let emoji = "";

      // Score ke hisaab se message aur emoji
      const percentage = (score / questions.length) * 100;

      if (percentage === 100) {
        emoji = "Passed 🎉";
      } else if (percentage >= 80) {
        emoji = "Passed ✅";
      } else if (percentage >= 50) {
        emoji = " Passed 🙂";
      } else {
        emoji = "Failed❌";
      }

      resultBody.innerHTML += `
    <tr>
      <td>${element.full_name}</td>
      <td>${questions.length}</td>
      <td>${score}</td>
      <td>${percentage}% ${emoji}</td>

    </tr>
  `;
    });

    // ✅ Hide the submit button
    submitBtn.style.display = "none";
    hideLoader();
  } catch (err) {
    console.error("Unexpected error:", err.message);
    hideLoader();
  }
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none"; // Start button chhupao
    loadQuestion(); // Pehla sawal dikhao
  });
}

if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    checkAnswer(); // Jawab check karo jab submit dabaya jaye
  });
}
