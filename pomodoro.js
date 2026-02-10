
let pomodoroSettings = {
  questionsPerSection: 15,
  studyTimeMinutes: 25,
  quizTimeMinutes: 20,
  breakTimeMinutes: 5,
  autoAdvance: true,
  showProgressBar: true
};

let pomodoroState = {
  active: false,
  phase: "", // "study", "quiz", "break", "results"
  currentSection: 0,
  sections: [],
  totalSections: 0,
  timerInterval: null,
  timeLeft: 0,
  isPaused: false,
  currentQuestions: [],
  quizResults: []
};

// ────────────────────────────────────────────────
// 1. Modern Settings Modal
// ────────────────────────────────────────────────
function startPomodoroSetup() {
  if (!currentFolder || !quizzes[currentFolder]?.length) {
    alert("Select a folder with questions first!");
    return;
  }

  // Close menu if open
  if (document.getElementById('mobile-menu')?.classList.contains('show')) {
    toggleMenu();
  }

  const modal = document.createElement('div');
  modal.className = 'pomodoro-modal modern-modal';
  modal.innerHTML = `
    <div class="pomodoro-dialog modern-dialog">
      <div class="modal-header">
        <h3>🚀 Pomodoro Flow</h3>
        <p class="modal-subtitle">Continuous Learning with Smart Breaks</p>
      </div>
      
      <div class="modal-body">
        <div class="stats-summary">
          <div class="stat-card">
            <span class="stat-icon">📚</span>
            <span class="stat-value">${quizzes[currentFolder].length}</span>
            <span class="stat-label">Total Questions</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📊</span>
            <span class="stat-value" id="estimatedSections">0</span>
            <span class="stat-label">Sections</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⏱️</span>
            <span class="stat-value" id="totalTimeEstimate">0 min</span>
            <span class="stat-label">Total Time</span>
          </div>
        </div>

        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">📝</span>
              Questions per section
            </label>
            <div class="setting-control">
              <input type="range" id="pomoQPerSec" min="5" max="50" value="15" class="range-slider">
              <span class="range-value" id="qPerSecValue">15</span>
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">🎯</span>
              Study time (minutes)
            </label>
            <div class="setting-control">
              <input type="range" id="pomoStudyMin" min="5" max="60" value="25" class="range-slider">
              <span class="range-value" id="studyMinValue">25</span>
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">✏️</span>
              Quiz time (minutes)
            </label>
            <div class="setting-control">
              <input type="range" id="pomoQuizMin" min="5" max="60" value="20" class="range-slider">
              <span class="range-value" id="quizMinValue">20</span>
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">☕</span>
              Break time (minutes)
            </label>
            <div class="setting-control">
              <input type="range" id="pomoBreakMin" min="1" max="15" value="5" class="range-slider">
              <span class="range-value" id="breakMinValue">5</span>
            </div>
          </div>
        </div>

        <div class="advanced-settings">
          <label class="checkbox-label">
            <input type="checkbox" id="autoAdvance" checked>
            <span class="checkmark"></span>
            Auto-advance to next section
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="showProgress" checked>
            <span class="checkmark"></span>
            Show progress bar
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="modern-btn primary-btn" onclick="startPomodoroFlow()">
          <span class="btn-icon">🚀</span>
          Start Learning Flow
        </button>
        <button class="modern-btn secondary-btn" onclick="document.querySelector('.pomodoro-modal')?.remove()">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Initialize range sliders
  initializeRangeSliders();
  
  // Update estimates
  updatePomodoroEstimates();
}

function initializeRangeSliders() {
  const sliders = [
    { id: 'pomoQPerSec', valueId: 'qPerSecValue' },
    { id: 'pomoStudyMin', valueId: 'studyMinValue' },
    { id: 'pomoQuizMin', valueId: 'quizMinValue' },
    { id: 'pomoBreakMin', valueId: 'breakMinValue' }
  ];
  
  sliders.forEach(slider => {
    const input = document.getElementById(slider.id);
    const valueSpan = document.getElementById(slider.valueId);
    
    input.addEventListener('input', function() {
      valueSpan.textContent = this.value;
      updatePomodoroEstimates();
    });
  });
}

function updatePomodoroEstimates() {
  const qPerSec = parseInt(document.getElementById('pomoQPerSec')?.value || 15);
  const totalQuestions = quizzes[currentFolder]?.length || 0;
  const sections = Math.ceil(totalQuestions / qPerSec);
  
  const studyMin = parseInt(document.getElementById('pomoStudyMin')?.value || 25);
  const quizMin = parseInt(document.getElementById('pomoQuizMin')?.value || 20);
  const breakMin = parseInt(document.getElementById('pomoBreakMin')?.value || 5);
  
  const totalTime = sections * (studyMin + quizMin + breakMin);
  
  const sectionsEl = document.getElementById('estimatedSections');
  const timeEl = document.getElementById('totalTimeEstimate');
  
  if (sectionsEl) sectionsEl.textContent = sections;
  if (timeEl) timeEl.textContent = `${totalTime} min`;
}

// ────────────────────────────────────────────────
// 2. Start Full Flow with Modern UI
// ────────────────────────────────────────────────
function startPomodoroFlow() {
  const modal = document.querySelector('.pomodoro-modal');
  if (!modal) return;

  // Get settings
  pomodoroSettings.questionsPerSection = Math.max(5, parseInt(document.getElementById('pomoQPerSec')?.value) || 15);
  pomodoroSettings.studyTimeMinutes = Math.max(5, parseInt(document.getElementById('pomoStudyMin')?.value) || 25);
  pomodoroSettings.quizTimeMinutes = Math.max(5, parseInt(document.getElementById('pomoQuizMin')?.value) || 20);
  pomodoroSettings.breakTimeMinutes = Math.max(1, parseInt(document.getElementById('pomoBreakMin')?.value) || 5);
  pomodoroSettings.autoAdvance = document.getElementById('autoAdvance')?.checked || true;
  pomodoroSettings.showProgressBar = document.getElementById('showProgress')?.checked || true;

  modal.remove();

  // Split questions into sections
  const allQuestions = quizzes[currentFolder];
  pomodoroState.sections = [];
  for (let i = 0; i < allQuestions.length; i += pomodoroSettings.questionsPerSection) {
    pomodoroState.sections.push(allQuestions.slice(i, i + pomodoroSettings.questionsPerSection));
  }

  pomodoroState.totalSections = pomodoroState.sections.length;
  pomodoroState.currentSection = 0;
  pomodoroState.active = true;
  pomodoroState.isPaused = false;
  pomodoroState.quizResults = [];

  // Hide main containers
  document.querySelector('.container')?.classList.add('hidden');
  document.getElementById('analysisContainer')?.classList.add('hidden');
  document.getElementById('quizOptions')?.classList.add('hidden');

  // Setup Pomodoro Interface
  setupPomodoroInterface();
  
  // Start with study phase
  enterStudyPhase();
}

function setupPomodoroInterface() {
  // Create main pomodoro container
  const existing = document.getElementById('pomodoroContainer');
  if (existing) existing.remove();
  
  const container = document.createElement('div');
  container.id = 'pomodoroContainer';
  container.className = 'pomodoro-container';
  
  document.body.appendChild(container);
  
  // Add progress bar
  if (pomodoroSettings.showProgressBar) {
    const progressBar = document.createElement('div');
    progressBar.id = 'pomodoroProgressBar';
    progressBar.className = 'pomodoro-progress-bar';
    progressBar.innerHTML = `
      <div class="progress-fill" style="width: 0%"></div>
      <div class="progress-text">Section 1/${pomodoroState.totalSections}</div>
    `;
    document.body.appendChild(progressBar);
  }
}

// ────────────────────────────────────────────────
// 3. Study Phase - Modern Flashcards
// ────────────────────────────────────────────────
function enterStudyPhase() {
  if (!pomodoroState.active) return;
  
  pomodoroState.phase = "study";
  pomodoroState.timeLeft = pomodoroSettings.studyTimeMinutes * 60;
  pomodoroState.isPaused = false;
  pomodoroState.currentQuestions = [...pomodoroState.sections[pomodoroState.currentSection]];

  updatePomodoroUI("study");
  
  // Show flashcards for this section
  showSectionFlashcards(pomodoroState.currentSection);
  
  // Start timer with auto-advance
  startPomodoroTimer(() => {
    if (pomodoroState.active && !pomodoroState.isPaused && pomodoroSettings.autoAdvance) {
      // Auto-advance to quiz
      startQuizPhase();
    }
  });

  // Add manual controls
  addPomodoroControls();
  updateProgressBar();
}

// function showSectionFlashcards(sectionIndex) {
//   const questions = pomodoroState.sections[sectionIndex];
//   const container = document.getElementById('pomodoroContainer');
  
//   if (!container) return;
  
//   // Create flashcards container
//   const flashcardsHTML = `
//     <div class="pomodoro-flashcards">
//       <div class="flashcards-header">
//         <h2>📚 Study Session ${sectionIndex + 1}/${pomodoroState.totalSections}</h2>
//         <div class="section-stats">
//           <span class="stat"><span class="stat-icon">📝</span> ${questions.length} Questions</span>
//           <span class="stat"><span class="stat-icon">⏱️</span> ${pomodoroSettings.studyTimeMinutes} min</span>
//         </div>
//       </div>
      
//       <div class="flashcards-grid" id="flashcardsGrid">
//         ${questions.map((q, i) => `
//           <div class="flashcard-modern" onclick="flipFlashcard(${i})">
//             <div class="flashcard-inner" id="flashcard-${i}">
//               <div class="flashcard-front">
//                 <div class="flashcard-header">
//                   <span class="card-number">${i + 1}</span>
//                   <span class="card-tag">Study</span>
//                 </div>
//                 <div class="card-content">
//                   <p class="card-question">${q.question}</p>
//                   <div class="card-options">
//                     ${q.options.map((opt, idx) => `
//                       <div class="card-option ${idx === q.correctIndex ? 'correct-option' : ''}">
//                         <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
//                         <span class="option-text">${opt}</span>
//                       </div>
//                     `).join('')}
//                   </div>
//                 </div>
//                 <div class="card-footer">
//                   <span class="hint-text">Click to reveal answer</span>
//                 </div>
//               </div>
//               <div class="flashcard-back">
//                 <div class="flashcard-header">
//                   <span class="card-number">${i + 1}</span>
//                   <span class="card-tag correct">Correct Answer</span>
//                 </div>
//                 <div class="card-content">
//                   <div class="answer-highlight">
//                     <span class="answer-label">✅ Correct Answer:</span>
//                     <span class="answer-text">${q.options[q.correctIndex]}</span>
//                   </div>
//                   ${q.explanation ? `
//                     <div class="explanation-box">
//                       <span class="explanation-label">💡 Explanation:</span>
//                       <p class="explanation-text">${q.explanation}</p>
//                     </div>
//                   ` : ''}
//                 </div>
//                 <div class="card-footer">
//                   <button class="small-btn" onclick="markAsLearned(event, ${i})">✓ Mark as Learned</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         `).join('')}
//       </div>
      
//       <div class="study-actions">
//         <button class="modern-btn outline-btn" onclick="startQuizPhase()">
//           <span class="btn-icon">✏️</span>
//           Start Quiz Now
//         </button>
//         <button class="modern-btn" onclick="nextSection()">
//           <span class="btn-icon">⏭️</span>
//           Skip to Next Section
//         </button>
//       </div>
//     </div>
//   `;
  
//   container.innerHTML = flashcardsHTML;
// }
function showSectionFlashcards(sectionIndex) {
  const questions = pomodoroState.sections[sectionIndex];
  const container = document.getElementById('pomodoroContainer');
  
  if (!container) return;
  
  // Create flashcards container
  const flashcardsHTML = `
    <div class="pomodoro-flashcards">
      <div class="flashcards-header">
        <h2>📚 Study Session ${sectionIndex + 1}/${pomodoroState.totalSections}</h2>
        <div class="section-stats">
          <span class="stat"><span class="stat-icon">📝</span> ${questions.length} Questions</span>
          <span class="stat"><span class="stat-icon">⏱️</span> ${pomodoroSettings.studyTimeMinutes} min</span>
        </div>
      </div>
      
      <div class="flashcards-grid" id="flashcardsGrid">
        ${questions.map((q, i) => `
          <div class="flashcard-modern" onclick="flipFlashcard(this)">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <div class="flashcard-header">
                  <span class="card-number">${i + 1}</span>
                  <span class="card-tag">Study</span>
                </div>
                <div class="card-content">
                  <p class="card-question">${q.question}</p>
                  <div class="card-options">
                    ${q.options.map((opt, idx) => `
                      <div class="card-option ${idx === q.correctIndex ? 'correct-option' : ''}">
                        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                        <span class="option-text">${opt}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
                <div class="card-footer">
                  <span class="hint-text">Click to reveal answer</span>
                </div>
              </div>
              <div class="flashcard-back">
                <div class="flashcard-header">
                  <span class="card-number">${i + 1}</span>
                  <span class="card-tag correct">Correct Answer</span>
                </div>
                <div class="card-content">
                  <div class="answer-highlight">
                    <span class="answer-label">✅ Correct Answer:</span>
                    <span class="answer-text">${q.options[q.correctIndex]}</span>
                  </div>
                  ${q.explanation ? `
                    <div class="explanation-box">
                      <span class="explanation-label">💡 Explanation:</span>
                      <p class="explanation-text">${q.explanation}</p>
                    </div>
                  ` : ''}
                </div>
                <div class="card-footer">
                  <button class="small-btn" onclick="markAsLearned(event, this)">✓ Mark as Learned</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="study-actions">
        <button class="modern-btn outline-btn" onclick="startQuizPhase()">
          <span class="btn-icon">✏️</span>
          Start Quiz Now
        </button>
        <button class="modern-btn" onclick="nextSection()">
          <span class="btn-icon">⏭️</span>
          Skip to Next Section
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = flashcardsHTML;
}

// Flip flashcard function
function flipFlashcard(cardElement) {
  const inner = cardElement.querySelector('.flashcard-inner');
  inner.classList.toggle('flipped');
  
  // Remove learned class when flipping
  cardElement.classList.remove('learned');
}

// Mark as learned function
function markAsLearned(event, buttonElement) {
  event.stopPropagation();
  
  const card = buttonElement.closest('.flashcard-modern');
  const cardTag = card.querySelector('.card-tag.correct');
  
  if (cardTag) {
    cardTag.textContent = '✓ Learned';
    card.classList.add('learned');
  }
}


function markAsLearned(event, index) {
  event.stopPropagation();
  const card = document.getElementById(`flashcard-${index}`);
  if (card) {
    card.classList.add('learned');
    card.querySelector('.card-tag.correct').textContent = '✓ Learned';
  }
}

// ────────────────────────────────────────────────
// 4. Quiz Phase - Modern Quiz Interface
// ────────────────────────────────────────────────
function startQuizPhase() {
  if (!pomodoroState.active) return;
  
  pomodoroState.phase = "quiz";
  pomodoroState.timeLeft = pomodoroSettings.quizTimeMinutes * 60;
  pomodoroState.isPaused = false;

  // Prepare quiz questions
  const sectionQuestions = pomodoroState.sections[pomodoroState.currentSection];
  currentQuiz = prepareShuffledQuestions([...sectionQuestions]);
  
  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  incorrectQuestions = [];
  questionTimes = [];
  totalQuizTime = 0;
  quizMode = "pomodoro_section";

  // Setup quiz interface
  setupQuizInterface();
  
  // Start timer
  startPomodoroTimer(() => {
    if (pomodoroState.active) {
      showQuizResults();
    }
  });

  updatePomodoroUI("quiz");
  updateProgressBar();
}

function setupQuizInterface() {
  const container = document.getElementById('pomodoroContainer');
  
  const quizHTML = `
    <div class="pomodoro-quiz">
      <div class="quiz-header">
        <h2>✏️ Quiz Session ${pomodoroState.currentSection + 1}/${pomodoroState.totalSections}</h2>
        <div class="quiz-stats">
          <span class="stat"><span class="stat-icon">📝</span> ${currentQuiz.length} Questions</span>
          <span class="stat"><span class="stat-icon">⏱️</span> ${pomodoroSettings.quizTimeMinutes} min</span>
        </div>
      </div>
      
      <div class="quiz-progress">
        <div class="progress-track">
          <div class="progress-fill" style="width: ${(currentQuestionIndex / currentQuiz.length) * 100}%"></div>
        </div>
        <div class="progress-text">
          Question <span id="quizCurrentQ">${currentQuestionIndex + 1}</span> / ${currentQuiz.length}
        </div>
      </div>
      
      <div class="quiz-question" id="pomodoroQuestionContainer">
        <!-- Question will be loaded here -->
      </div>
      
      <div class="quiz-actions">
        <button class="modern-btn outline-btn" onclick="endQuizEarly()">
          <span class="btn-icon">⏹️</span>
          End Quiz Early
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = quizHTML;
  
  // Load first question
  loadPomodoroQuestion();
}

function loadPomodoroQuestion() {
  const container = document.getElementById('pomodoroQuestionContainer');
  if (!container || currentQuestionIndex >= currentQuiz.length) {
    showQuizResults();
    return;
  }
  
  const question = currentQuiz[currentQuestionIndex];
  
  const questionHTML = `
    <div class="question-card">
      <div class="question-text">${question.question}</div>
      <div class="options-grid" id="pomodoroOptions">
        ${question.options.map((option, index) => `
          <button class="option-btn-modern" onclick="selectPomodoroAnswer(${index})">
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = questionHTML;
  
  // Update progress
  document.getElementById('quizCurrentQ').textContent = currentQuestionIndex + 1;
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = `${(currentQuestionIndex / currentQuiz.length) * 100}%`;
  }
}

function selectPomodoroAnswer(selectedIndex) {
  const question = currentQuiz[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correctIndex;
  
  // Visual feedback
  const options = document.querySelectorAll('.option-btn-modern');
  options.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === question.correctIndex) {
      btn.classList.add('correct-answer');
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add('wrong-answer');
    }
  });
  
  // Update score
  if (isCorrect) {
    score++;
  } else {
    question.timesIncorrect = (question.timesIncorrect || 0) + 1;
    incorrectQuestions.push(question);
  }
  
  // Next question after delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.length) {
      loadPomodoroQuestion();
    } else {
      showQuizResults();
    }
  }, 1000);
}

function showQuizResults() {
  clearPomodoroTimer();
  
  const accuracy = currentQuiz.length ? Math.round((score / currentQuiz.length) * 100) : 0;
  pomodoroState.quizResults.push({
    section: pomodoroState.currentSection + 1,
    score: score,
    total: currentQuiz.length,
    accuracy: accuracy
  });
  
  const container = document.getElementById('pomodoroContainer');
  
  const resultsHTML = `
    <div class="quiz-results">
      <div class="results-header">
        <h2>📊 Quiz Results</h2>
        <p>Section ${pomodoroState.currentSection + 1} of ${pomodoroState.totalSections}</p>
      </div>
      
      <div class="results-summary">
        <div class="result-card ${accuracy >= 80 ? 'success' : accuracy >= 60 ? 'warning' : 'error'}">
          <div class="result-icon">${accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '📝'}</div>
          <div class="result-content">
            <h3>${score} / ${currentQuiz.length}</h3>
            <p class="accuracy">${accuracy}% Accuracy</p>
          </div>
        </div>
        
        ${incorrectQuestions.length > 0 ? `
          <div class="incorrect-review">
            <h4>Review Incorrect Answers (${incorrectQuestions.length})</h4>
            ${incorrectQuestions.slice(0, 3).map((q, i) => `
              <div class="review-item">
                <p class="review-question">${q.question}</p>
                <p class="review-answer">✅ ${q.options[q.correctIndex]}</p>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="perfect-score">
            <div class="celebrate-icon">🎯</div>
            <h3>Perfect Score!</h3>
            <p>Excellent work! You mastered all questions.</p>
          </div>
        `}
      </div>
      
      <div class="results-actions">
        <button class="modern-btn outline-btn" onclick="restartSection()">
          <span class="btn-icon">🔄</span>
          Retry This Section
        </button>
        <button class="modern-btn primary-btn" onclick="nextSection()">
          <span class="btn-icon">➡️</span>
          Continue to ${pomodoroState.currentSection < pomodoroState.totalSections - 1 ? 'Next Section' : 'Break'}
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = resultsHTML;
  updatePomodoroUI("results");
  
  // Celebration for high accuracy
  if (accuracy >= 90) {
    triggerCelebration();
  }
}

function restartSection() {
  // Reset and go back to study phase
  currentQuestionIndex = 0;
  score = 0;
  incorrectQuestions = [];
  enterStudyPhase();
}

function endQuizEarly() {
  if (confirm("End quiz early and go to results?")) {
    showQuizResults();
  }
}

// ────────────────────────────────────────────────
// 5. Break Phase & Navigation
// ────────────────────────────────────────────────
function nextSection() {
  pomodoroState.currentSection++;
  
  if (pomodoroState.currentSection >= pomodoroState.totalSections) {
    finishPomodoro();
    return;
  }
  
  enterBreakPhase();
}

function enterBreakPhase() {
  pomodoroState.phase = "break";
  pomodoroState.timeLeft = pomodoroSettings.breakTimeMinutes * 60;
  pomodoroState.isPaused = false;

  const container = document.getElementById('pomodoroContainer');
  
  const breakHTML = `
    <div class="break-screen">
      <div class="break-content">
        <div class="break-icon">☕</div>
        <h2>Break Time!</h2>
        <p class="break-subtitle">Well done! Take a ${pomodoroSettings.breakTimeMinutes}-minute break</p>
        
        <div class="break-tips">
          <h3>💡 Quick Break Ideas:</h3>
          <ul>
            <li>Stretch your body for 2 minutes</li>
            <li>Drink a glass of water</li>
            <li>Look away from screen for 20 seconds</li>
            <li>Take 5 deep breaths</li>
          </ul>
        </div>
        
        <div class="progress-overview">
          <h3>Progress Overview</h3>
          <div class="progress-bars">
            ${pomodoroState.quizResults.map((result, idx) => `
              <div class="section-progress">
                <span class="section-name">Section ${idx + 1}</span>
                <div class="progress-bar-small">
                  <div class="progress-fill" style="width: ${result.accuracy}%"></div>
                </div>
                <span class="section-score">${result.score}/${result.total}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="break-actions">
        <button class="modern-btn outline-btn" onclick="skipBreak()">
          <span class="btn-icon">⏭️</span>
          Skip Break
        </button>
        <button class="modern-btn primary-btn" onclick="startBreakTimer()">
          <span class="btn-icon">⏱️</span>
          Start ${pomodoroSettings.breakTimeMinutes}-min Break
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = breakHTML;
  updatePomodoroUI("break");
  updateProgressBar();
}

function startBreakTimer() {
  pomodoroState.timerInterval = setInterval(() => {
    if (!pomodoroState.isPaused) {
      pomodoroState.timeLeft--;
      updatePomodoroUI("break");
      
      if (pomodoroState.timeLeft <= 0) {
        clearInterval(pomodoroState.timerInterval);
        enterStudyPhase();
      }
    }
  }, 1000);
}

function skipBreak() {
  clearPomodoroTimer();
  enterStudyPhase();
}

// ────────────────────────────────────────────────
// 6. Finish & Cleanup
// ────────────────────────────────────────────────
function finishPomodoro() {
  pomodoroState.active = false;
  clearPomodoroTimer();
  
  const container = document.getElementById('pomodoroContainer');
  
  // Calculate overall stats
  const totalQuestions = pomodoroState.quizResults.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = pomodoroState.quizResults.reduce((sum, r) => sum + r.score, 0);
  const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
  
  const finishHTML = `
    <div class="finish-screen">
      <div class="finish-content">
        <div class="finish-icon">🏆</div>
        <h2>Learning Flow Complete!</h2>
        <p class="finish-subtitle">You've mastered ${totalQuestions} questions across ${pomodoroState.totalSections} sections</p>
        
        <div class="final-stats">
          <div class="final-stat">
            <span class="stat-value">${overallAccuracy}%</span>
            <span class="stat-label">Overall Accuracy</span>
          </div>
          <div class="final-stat">
            <span class="stat-value">${totalCorrect}/${totalQuestions}</span>
            <span class="stat-label">Questions Correct</span>
          </div>
          <div class="final-stat">
            <span class="stat-value">${pomodoroState.totalSections}</span>
            <span class="stat-label">Sections Completed</span>
          </div>
        </div>
        
        <div class="section-breakdown">
          <h3>Section Performance</h3>
          <div class="breakdown-list">
            ${pomodoroState.quizResults.map((result, idx) => `
              <div class="breakdown-item ${result.accuracy >= 80 ? 'excellent' : result.accuracy >= 60 ? 'good' : 'needs-work'}">
                <span class="item-section">Section ${idx + 1}</span>
                <div class="item-progress">
                  <div class="progress-bar" style="width: ${result.accuracy}%"></div>
                </div>
                <span class="item-score">${result.score}/${result.total}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="finish-actions">
        <button class="modern-btn outline-btn" onclick="reviewIncorrectQuestions()">
          <span class="btn-icon">📝</span>
          Review Mistakes
        </button>
        <button class="modern-btn primary-btn" onclick="goHome()">
          <span class="btn-icon">🏠</span>
          Return Home
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = finishHTML;
  removePomodoroUI();
  
  // Celebration
  if (overallAccuracy >= 80) {
    triggerFinalCelebration();
  }
}

function reviewIncorrectQuestions() {
  // Collect all incorrect questions
  const allIncorrect = [];
  pomodoroState.sections.forEach((section, idx) => {
    // In a real app, you'd track which questions were incorrect per section
  });
  
  alert("In a full implementation, this would show all incorrect questions for review.");
}

// ────────────────────────────────────────────────
// 7. Timer & UI Management
// ────────────────────────────────────────────────
function startPomodoroTimer(onComplete) {
  clearPomodoroTimer();
  
  pomodoroState.timerInterval = setInterval(() => {
    if (!pomodoroState.isPaused) {
      pomodoroState.timeLeft--;
      updatePomodoroUI(pomodoroState.phase);
      
      if (pomodoroState.timeLeft <= 0) {
        clearPomodoroTimer();
        onComplete();
      }
    }
  }, 1000);
}

function updatePomodoroUI(phase) {
  // Update timer display
  const timerDisplay = document.getElementById('pomodoroTimerDisplay');
  if (!timerDisplay) {
    const timer = document.createElement('div');
    timer.id = 'pomodoroTimerDisplay';
    timer.className = 'modern-timer';
    document.body.appendChild(timer);
  }
  
  const minutes = Math.floor(pomodoroState.timeLeft / 60);
  const seconds = pomodoroState.timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const phaseTitles = {
    study: `📚 Study Session ${pomodoroState.currentSection + 1}/${pomodoroState.totalSections}`,
    quiz: `✏️ Quiz Session ${pomodoroState.currentSection + 1}/${pomodoroState.totalSections}`,
    break: `☕ Break Time`,
    results: `📊 Results`
  };
  
  const timerEl = document.getElementById('pomodoroTimerDisplay');
  timerEl.innerHTML = `
    <div class="timer-content">
      <div class="timer-phase">${phaseTitles[phase] || 'Pomodoro Flow'}</div>
      <div class="timer-display ${pomodoroState.timeLeft < 60 ? 'warning' : ''}">
        ${timeStr}
      </div>
      ${pomodoroState.isPaused ? '<div class="timer-status">⏸️ Paused</div>' : ''}
    </div>
  `;
}

function updateProgressBar() {
  const progressBar = document.getElementById('pomodoroProgressBar');
  if (!progressBar) return;
  
  const progress = ((pomodoroState.currentSection) / pomodoroState.totalSections) * 100;
  const fill = progressBar.querySelector('.progress-fill');
  const text = progressBar.querySelector('.progress-text');
  
  if (fill) fill.style.width = `${progress}%`;
  if (text) text.textContent = `Section ${pomodoroState.currentSection + 1}/${pomodoroState.totalSections}`;
}

function addPomodoroControls() {
  const existing = document.getElementById('pomodoroControls');
  if (existing) existing.remove();
  
  const controls = document.createElement('div');
  controls.id = 'pomodoroControls';
  controls.className = 'pomodoro-controls';
  
  controls.innerHTML = `
    <button class="control-btn pause-btn" onclick="togglePomodoroPause()">
      ${pomodoroState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
    </button>
    <button class="control-btn skip-btn" onclick="nextSection()">
      ⏭️ Skip
    </button>
    <button class="control-btn home-btn" onclick="exitPomodoro()">
      🏠 Exit
    </button>
  `;
  
  document.body.appendChild(controls);
}

function togglePomodoroPause() {
  pomodoroState.isPaused = !pomodoroState.isPaused;
  updatePomodoroUI(pomodoroState.phase);
  
  // Show pause overlay
  if (pomodoroState.isPaused) {
    const overlay = document.createElement('div');
    overlay.id = 'pauseOverlay';
    overlay.className = 'pause-overlay';
    overlay.innerHTML = '<div class="pause-message">⏸️ Paused</div>';
    document.body.appendChild(overlay);
  } else {
    document.getElementById('pauseOverlay')?.remove();
  }
}

function exitPomodoro() {
  if (confirm("Exit Pomodoro flow? Your progress will be saved.")) {
    pomodoroState.active = false;
    clearPomodoroTimer();
    removePomodoroUI();
    goHome();
  }
}

function clearPomodoroTimer() {
  if (pomodoroState.timerInterval) {
    clearInterval(pomodoroState.timerInterval);
    pomodoroState.timerInterval = null;
  }
}

function removePomodoroUI() {
  ['pomodoroContainer', 'pomodoroTimerDisplay', 'pomodoroControls', 
   'pomodoroProgressBar', 'pauseOverlay'].forEach(id => {
    document.getElementById(id)?.remove();
  });
}

// ────────────────────────────────────────────────
// 8. Celebration Effects
// ────────────────────────────────────────────────
function triggerCelebration() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
  
  // Add celebration message
  const celebration = document.createElement('div');
  celebration.className = 'celebration-message';
  celebration.textContent = '🎉 Great Job! 🎉';
  document.body.appendChild(celebration);
  
  setTimeout(() => celebration.remove(), 2000);
}

function triggerFinalCelebration() {
  if (typeof confetti === 'function') {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          angle: 45 + (i * 45),
          spread: 70,
          origin: { x: 0.5, y: 0.6 }
        });
      }, i * 300);
    }
  }
}

// Update goHome function
const originalGoHome = window.goHome;
window.goHome = function() {
  if (pomodoroState.active) {
    exitPomodoro();
    return;
  }
  originalGoHome();
};
function addPomodoroControls() {
  const existing = document.getElementById('pomodoroControls');
  if (existing) existing.remove();
  
  const controls = document.createElement('div');
  controls.id = 'pomodoroControls';
  controls.className = 'pomodoro-controls';
  
  controls.innerHTML = `
    <button class="control-btn pause-btn" onclick="togglePomodoroPause()" data-label="Pause"></button>
    <button class="control-btn skip-btn" onclick="nextSection()" data-label="Next"></button>
    <button class="control-btn home-btn" onclick="exitPomodoro()" data-label="Exit"></button>
  `;
  
  document.body.appendChild(controls);
  updateControlLabels();
  
  // Add pause class if needed
  if (pomodoroState.isPaused) {
    controls.classList.add('paused');
  }
}

/* 6. UPDATE TOGGLE FUNCTION */
function togglePomodoroPause() {
  pomodoroState.isPaused = !pomodoroState.isPaused;
  updatePomodoroUI(pomodoroState.phase);
  updateControlLabels();
  
  const controls = document.getElementById('pomodoroControls');
  if (controls) {
    controls.classList.toggle('paused', pomodoroState.isPaused);
  }
  
  // Show/hide pause overlay
  if (pomodoroState.isPaused) {
    const overlay = document.createElement('div');
    overlay.id = 'pauseOverlay';
    overlay.className = 'pause-overlay';
    overlay.innerHTML = '<div class="pause-message">⏸️</div>';
    document.body.appendChild(overlay);
  } else {
    document.getElementById('pauseOverlay')?.remove();
  }
}
