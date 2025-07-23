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

    // Field Validation
    if (!name.value || !useremail.value || !userpassword.value) {
      Swal.fire("Oops!", "Please fill in all fields", "warning");
      return;
    }

    // Supabase Auth SignUp
    const { data, error } = await client.auth.signUp({
      email: useremail.value,
      password: userpassword.value,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    // Optional: Insert Name into user_information Table
    const { error: insertError } = await client.from("user_quizes").insert({
      id: data.user.id,
      full_name: name.value,
      email: useremail.value,
    });

    if (insertError) {
      Swal.fire("Error", insertError.message, "error");
      return;
    }

    Swal.fire("Success!", "You have signed up successfully!", "success");

    // Clear Fields
    name.value = "";
    useremail.value = "";
    userpassword.value = "";

    // Switch to Login Form
    toggleLogin();
  });
}

// ======================================= Login Handler ======================================================================
if (loginAcc) {
  loginAcc.addEventListener("click", async (e) => {
    e.preventDefault();

    const { data, error } = await client.auth.signInWithPassword({
      email: loginemail.value,
      password: loginpassword.value,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    } else {
      Swal.fire("Login", "Login successful!", "success");
      window.location.href = "quiz_app.html";
    }
  });
}

// ======================================= Logout Handler =====================================================================

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const { error } = await client.auth.signOut();

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
    question:
      "JavaScript mein variable declare karne ke liye konsa keyword use hota hai?",
    options: ["var", "let", "const", "sabhi"],
    answer: "sabhi",
  },
  {
    question:
      "JavaScript mein function ko call karne ke liye kis syntax ka istemal hota hai?",
    options: [
      "functionName()",
      "call(functionName)",
      "execute(functionName)",
      "run(functionName)",
    ],
    answer: "functionName()",
  },
  {
    question: "JavaScript mein '==' operator kya karta hai?",
    options: ["Strict equality", "Loose equality", "Assignment", "Comparison"],
    answer: "Loose equality",
  },
  {
    question: "JavaScript mein array ko kis symbol se define karte hain?",
    options: ["{}", "[]", "()", "<>"],
    answer: "[]",
  },
  {
    question: "JavaScript mein 'null' ka matlab kya hota hai?",
    options: ["Undefined value", "Null value", "Empty string", "False"],
    answer: "Null value",
  },
  {
    question: "JavaScript mein 'if' statement kis liye use hoti hai?",
    options: [
      "Loop chalane ke liye",
      "Condition check karne ke liye",
      "Function define karne ke liye",
      "Variable declare karne ke liye",
    ],
    answer: "Condition check karne ke liye",
  },
  {
    question: "JavaScript mein 'for' loop kis liye use hota hai?",
    options: [
      "Repeat code",
      "Define function",
      "Declare variable",
      "Create object",
    ],
    answer: "Repeat code",
  },
  {
    question: "JavaScript mein 'console.log()' ka kya kaam hai?",
    options: [
      "Output dikhana",
      "Error throw karna",
      "Variable define karna",
      "Function banana",
    ],
    answer: "Output dikhana",
  },
  {
    question: "JavaScript mein 'typeof' operator kya karta hai?",
    options: ["Type check", "Type cast", "Type convert", "Type delete"],
    answer: "Type check",
  },
  {
    question: "JavaScript mein 'return' statement ka kya role hota hai?",
    options: [
      "Function se value return karna",
      "Code ko stop karna",
      "Variable declare karna",
      "Loop ko break karna",
    ],
    answer: "Function se value return karna",
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
  showDiv.innerHTML = show; // Naya question dikhao
  submitBtn.style.display = "inline-block"; // Submit button dikhao
  startTimer(); // Timer shuru karo
}

// Timer on
function startTimer() {
  // Timer display
  document.getElementById("timer").innerText = `⏱️ ${timeLeft} sec`;
  // Har second ke liye
  timerInterval = setInterval(() => {
    timeLeft--; // 1 second kam karo
    document.getElementById("timer").innerText = `⏱️ ${timeLeft} sec`; // Dikhao
    if (timeLeft <= 0) {
      clearInterval(timerInterval); // Timer band karo
      checkAnswer(); // Time khatam hone ke baad answer check karo
    }
  }, 1000);
}

// Answer check karne ka function
function checkAnswer() {
  clearInterval(timerInterval); // Timer band karo
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
  } catch (err) {
    console.error("Unexpected error:", err.message);
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
