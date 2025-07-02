          //app page
let quizeStart = document.getElementById("startQuize");

if (quizeStart) {
  quizeStart.addEventListener("click", (e) => {
    e.preventDefault();
  let savelogin = localStorage.getItem('login')
   if(savelogin==='true'){
      window.location.href="quizstart.html"
    }
 else{   window.location.href = "index.html";
    console.log("start your  quizes");
    console.log(all)
    }
    
  });
}

//login page

let userlogin = document.getElementById("userlogin");
let loginemail = document.getElementById("loginemail");
let loginpassword = document.getElementById("loginpassword");

if (userlogin) {
  // userlogin.style.display = "block";
  // userlogin.style.display = "none";

  userlogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const signupData = JSON.parse(localStorage.getItem("usersignup"));
    
    if (
      signupData &&
      signupData.email === loginemail.value &&
      signupData.password === loginpassword.value
    ) {
      alert("Login successful");
      window.location.href = "quizstart.html";

      localStorage.setItem("login", "true");
    } else {
      alert("Invalid credentials or user not signed up");
    }

    

    // Clear inputs
    // lo.value = "";
    // passwordInput.value = "";
    userlogin.style.display = "none";
  });
}

//signup page

let usersignup = document.getElementById("usersignup");
let username = document.getElementById("username");
let useremail = document.getElementById("useremail");
let userpassword = document.getElementById("userpassword");
let userbatch = document.getElementById("userbatch");
let usercnic = document.getElementById("usercnic");

// let flag= false;

if (usersignup) {
  // usersignup.style.display="block"
  usersignup.addEventListener("submit", (e) => {
    e.preventDefault();
    let userstd = {
      name: username.value,
      email: useremail.value,
      password: userpassword.value,
      batch: userbatch.value,
      cnic: usercnic.value,
    };

    console.log(userstd);

    localStorage.setItem("usersignup", JSON.stringify(userstd));
    alert("Signup successful!");

    usersignup.style.display = "none";

    window.location.href = "index.html";
  });
}

let logout = document.getElementById("logout");
if(logout){
logout.addEventListener("click", function () {
  if (logout) {
    // const showDiv = document.getElementById("show");
    alert("Logout Your Account");
    window.location.href = "index.html";

    localStorage.removeItem("login");
  }
});


}



// add to quizes from quizestrt file strt
const questions =  [
  {
    question: "JavaScript mein variable declare karne ke liye konsa keyword use hota hai?",
    options: ["var", "let", "const", "sabhi"],
    answer: "sabhi"
  },
  {
    question: "JavaScript mein function ko call karne ke liye kis syntax ka istemal hota hai?",
    options: ["functionName()", "call(functionName)", "execute(functionName)", "run(functionName)"],
    answer: "functionName()"
  },
  {
    question: "JavaScript mein '==' operator kya karta hai?",
    options: ["Strict equality", "Loose equality", "Assignment", "Comparison"],
    answer: "Loose equality"
  },
  {
    question: "JavaScript mein array ko kis symbol se define karte hain?",
    options: ["{}", "[]", "()", "<>"],
    answer: "[]"
  },
  {
    question: "JavaScript mein 'null' ka matlab kya hota hai?",
    options: ["Undefined value", "Null value", "Empty string", "False"],
    answer: "Null value"
  },
  {
    question: "JavaScript mein 'if' statement kis liye use hoti hai?",
    options: ["Loop chalane ke liye", "Condition check karne ke liye", "Function define karne ke liye", "Variable declare karne ke liye"],
    answer: "Condition check karne ke liye"
  },
  {
    question: "JavaScript mein 'for' loop kis liye use hota hai?",
    options: ["Repeat code", "Define function", "Declare variable", "Create object"],
    answer: "Repeat code"
  },
  {
    question: "JavaScript mein 'console.log()' ka kya kaam hai?",
    options: ["Output dikhana", "Error throw karna", "Variable define karna", "Function banana"],
    answer: "Output dikhana"
  },
  {
    question: "JavaScript mein 'typeof' operator kya karta hai?",
    options: ["Type check", "Type cast", "Type convert", "Type delete"],
    answer: "Type check"
  },
  {
    question: "JavaScript mein 'return' statement ka kya role hota hai?",
    options: ["Function se value return karna", "Code ko stop karna", "Variable declare karna", "Loop ko break karna"],
    answer: "Function se value return karna"
  }
];        

                    
                    
                    
                    
                    

let currentQuestionIndex = 0; // Abhi ka question number
let score = 0; // Score
let timerInterval; // Timer ke liye
let timeLeft = 10; // Har question ke liye 10 second

// Question dikhaane ke liye function
function loadQuestion() {
  // Pehle saara content hata do
  showDiv.innerHTML = '';
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
        ${q.options.map(opt => `
          <label>
            <input type="radio" name="answer" value="${opt}">
            ${opt}
          </label>
        `).join('')}
      </div>
      <div id="timer">Time left: ${timeLeft} seconds</div>
    </div>
  `;
  showDiv.innerHTML = show; // Naya question dikhao
  submitBtn.style.display = 'inline-block'; // Submit button dikhao
  startTimer(); // Timer shuru karo
}

// Timer chalane ka function
function startTimer() {
  // Timer display
  document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
  // Har second ke liye
  timerInterval = setInterval(() => {
    timeLeft--; // 1 second kam karo
    document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`; // Dikhao
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

// Final score dikhane ka function
function showResult() {
  showDiv.innerHTML = `<h2>Your Score: ${score} / ${questions.length}</h2>`;
  // Submit button chup karo
  submitBtn.style.display = 'none';
}

let startBtn = document.getElementById('startBtn')
if(startBtn){
// Start button pe event lagao
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none'; // Start button chup
  loadQuestion(); // Pehla question dikhao
});

// Submit button pe event lagao
submitBtn.addEventListener('click', () => {
  checkAnswer(); // Answer check karo
});

          }














