
// Add to global variables
let markedDifficultQuestions = [];
let isQuestionMarked = false;

// Update the loadQuestion function to include mark button
function loadQuestion() {
  if (currentQuestionIndex >= currentQuiz.length) {
    if (quizTimer) clearInterval(quizTimer);
    
    // Always show results first, then add save button if needed
    showResults();
    return;
  }

  const questionData = currentQuiz[currentQuestionIndex];
  
  // Check if current question is already marked
  isQuestionMarked = markedDifficultQuestions.some(q => 
    q.question === questionData.question
  );

  // Update progress
  document.getElementById("current-question").textContent = currentQuestionIndex + 1;
  document.getElementById("total-questions").textContent = currentQuiz.length;

  // Show question text
  document.getElementById("question-text").textContent = questionData.question;
  
  // Clear previous options
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  // Create option buttons
  questionData.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = `${String.fromCharCode(65 + index)}. ${optionText}`;
    button.dataset.index = index;

    button.addEventListener("click", () => {
      // Disable all buttons
      optionsContainer.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.7";
      });

      // Highlight selected one temporarily
      button.style.backgroundColor = "#3498db";
      button.style.color = "white";

      setTimeout(() => {
        selectAnswer(index);
      }, 400);
    });

    optionsContainer.appendChild(button);
  });

  // Add "Mark as Difficult" button
  const markButton = document.createElement("button");
  markButton.id = "markDifficultBtn";
  markButton.className = `mark-difficult-btn ${isQuestionMarked ? 'marked' : ''}`;
  markButton.innerHTML = isQuestionMarked ? 
    '✅ Already Marked as Difficult' : 
    '⚠️ Mark as Difficult';
  markButton.onclick = toggleMarkAsDifficult;
  
  optionsContainer.appendChild(markButton);

  // Update question mark indicator
  const questionText = document.getElementById("question-text");
  if (isQuestionMarked) {
    questionText.classList.add("question-marked");
  } else {
    questionText.classList.remove("question-marked");
  }
}

// Function to toggle mark as difficult
function toggleMarkAsDifficult() {
  const currentQuestion = currentQuiz[currentQuestionIndex];
  const markButton = document.getElementById("markDifficultBtn");
  const questionText = document.getElementById("question-text");
  
  if (isQuestionMarked) {
    // Remove from marked questions
    markedDifficultQuestions = markedDifficultQuestions.filter(
      q => q.question !== currentQuestion.question
    );
    markButton.textContent = '⚠️ Mark as Difficult';
    markButton.classList.remove('marked');
    questionText.classList.remove("question-marked");
    isQuestionMarked = false;
  } else {
    // Add to marked questions
    markedDifficultQuestions.push({
      ...currentQuestion,
      markedIndex: currentQuestionIndex
    });
    markButton.textContent = '✅ Marked as Difficult';
    markButton.classList.add('marked');
    questionText.classList.add("question-marked");
    isQuestionMarked = true;
  }
  
  // Show notification
  showMarkNotification(isMarked);
}

// Function to show mark notification
function showMarkNotification(isMarked) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isMarked ? '#27ae60' : '#e74c3c'};
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.3s;
  `;
  notification.textContent = isMarked ? 
    '✅ Question marked as difficult!' : 
    '❌ Question removed from difficult list';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Function to add save button to results
function addSaveMarkedQuestionsButton() {
  if (markedDifficultQuestions.length === 0) {
    return;
  }
  
  const quizContainer = document.getElementById("quizContainer");
  const saveButton = document.createElement("button");
  saveButton.id = "saveMarkedQuestionsBtn";
  saveButton.className = "quiz-btn";
  saveButton.style.backgroundColor = "#e74c3c";
  saveButton.style.margin = "10px";
  saveButton.innerHTML = `💾 Save ${markedDifficultQuestions.length} Marked Questions`;
  saveButton.onclick = showDifficultCollectionDialog;
  
  // Find the button container or add after the Home button
  const homeBtn = quizContainer.querySelector('button[onclick="goHome()"]');
  if (homeBtn) {
    quizContainer.insertBefore(saveButton, homeBtn);
  } else {
    quizContainer.appendChild(saveButton);
  }
}

// Function to show dialog for collecting marked questions
function showDifficultCollectionDialog() {
  if (markedDifficultQuestions.length === 0) {
    alert("No marked questions to save!");
    return;
  }
  
  const dialog = document.createElement('div');
  dialog.className = 'difficult-collection-dialog';
  
  // Get all folders for selection
  const folderOptions = Object.keys(quizzes)
    .filter(f => !f.includes('_Incorrect'))
    .map(f => `<option value="${f}">${f}</option>`)
    .join('');
  
  dialog.innerHTML = `
    <h3>Save Marked Questions</h3>
    <p>You've marked ${markedDifficultQuestions.length} question(s) as difficult. Save them to:</p>
    
    <div class="folder-options">
      <label>
        <input type="radio" name="saveOption" value="existing" checked> 
        Existing folder:
        <select id="existingFolderSelect">
          <option value="">Select a folder</option>
          ${folderOptions}
        </select>
      </label>
      
      <label>
        <input type="radio" name="saveOption" value="new"> 
        New folder:
        <input type="text" id="newFolderName" placeholder="Enter folder name">
      </label>
    </div>
    
    <p>Questions to save:</p>
    <ul>
      ${markedDifficultQuestions.map((q, i) => `
        <li>
          <span>Q${q.markedIndex + 1}:</span> 
          ${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}
        </li>
      `).join('')}
    </ul>
    
    <div class="dialog-buttons">
      <button class="cancel-btn" onclick="skipSavingDifficultQuestions()">Cancel</button>
      <button class="save-btn" onclick="saveMarkedQuestions()">Save Questions</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Add event listeners for radio buttons
  const radioButtons = dialog.querySelectorAll('input[name="saveOption"]');
  const existingSelect = dialog.querySelector('#existingFolderSelect');
  const newFolderInput = dialog.querySelector('#newFolderName');
  
  // Initially show/hide based on selection
  if (radioButtons[0].checked) {
    existingSelect.style.display = 'block';
    newFolderInput.style.display = 'none';
  } else {
    existingSelect.style.display = 'none';
    newFolderInput.style.display = 'block';
  }
  
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'existing') {
        existingSelect.style.display = 'block';
        newFolderInput.style.display = 'none';
      } else {
        existingSelect.style.display = 'none';
        newFolderInput.style.display = 'block';
      }
    });
  });
}

// Function to save marked questions
async function saveMarkedQuestions() {
  const dialog = document.querySelector('.difficult-collection-dialog');
  if (!dialog) return;
  
  const saveOption = dialog.querySelector('input[name="saveOption"]:checked').value;
  
  let targetFolder;
  
  if (saveOption === 'existing') {
    const selectedFolder = dialog.querySelector('#existingFolderSelect').value;
    if (!selectedFolder) {
      alert('Please select a folder!');
      return;
    }
    targetFolder = selectedFolder;
  } else {
    const newFolderName = dialog.querySelector('#newFolderName').value.trim();
    if (!newFolderName) {
      alert('Please enter a folder name!');
      return;
    }
    
    if (quizzes[newFolderName]) {
      alert('Folder already exists!');
      return;
    }
    
    targetFolder = newFolderName;
    // Create new folder
    quizzes[targetFolder] = [];
  }
  
  try {
    // Add marked questions to target folder
    let savedCount = 0;
    markedDifficultQuestions.forEach(markedQuestion => {
      // Remove the markedIndex property before saving
      const { markedIndex, ...questionToSave } = markedQuestion;
      
      // Check if question already exists in the folder
      const existingQuestion = quizzes[targetFolder].find(
        q => q.question === questionToSave.question
      );
      
      if (!existingQuestion) {
        quizzes[targetFolder].push(questionToSave);
        savedCount++;
      }
    });
    
    // Save to IndexedDB
    await saveQuizzes();
    
    // Remove dialog
    dialog.remove();
    
    // Show success message
    alert(`✅ Successfully saved ${savedCount} question(s) to "${targetFolder}"!`);
    
    // Update UI
    updateFolderList();
    
    // Clear marked questions
    markedDifficultQuestions = [];
    
    // Remove the save button from results
    const saveButton = document.getElementById("saveMarkedQuestionsBtn");
    if (saveButton) saveButton.remove();
    
  } catch (error) {
    console.error('Error saving marked questions:', error);
    alert('Error saving questions. Please try again.');
  }
}

// Function to skip saving and just close dialog
function skipSavingDifficultQuestions() {
  const dialog = document.querySelector('.difficult-collection-dialog');
  if (dialog) dialog.remove();
}

// Update the showResults function to add save button
// Add this line in the showResults function where you create resultsHTML:
// After the buttons in showResults(), add this:
// Add this after creating the restart and home buttons in showResults()

// Fixed showResults function
async function showResults() {
  // Calculate average time threshold
  const avgTimeThreshold = totalQuizTime / currentQuiz.length;

  let timingHTML = `
      <h3>Time Statistics</h3>
      <p>Total Time: ${totalQuizTime.toFixed(1)} seconds</p>
      <p>Average Time: ${avgTimeThreshold.toFixed(1)} seconds per question</p>
      <div class="timing-stats">
          <h4>Time per Question:</h4>
          <ul>
  `;

  // Add timing for each question
  currentQuiz.forEach((question, index) => {
    const timeTaken = questionTimes[index] || 0;
    const isSlow = timeTaken > avgTimeThreshold * 1.5; // 50% slower than average
    timingHTML += `
          <li class="${isSlow ? "slow-time" : "fast-time"}">
              Q${index + 1}: ${timeTaken.toFixed(1)}s
              ${isSlow ? "⏱️" : "⚡"}
          </li>
      `;
  });

  timingHTML += `</ul></div>`;

  // Create results HTML
  let resultsHTML = `
      <h2>Quiz Completed!</h2>
      <p>Your Score: ${score} / ${currentQuiz.length}</p>
      ${timingHTML}
      <h3>Incorrect Questions:</h3>
      <div id="incorrect-answers"></div>
      <button class="quiz-btn" onclick="restartQuiz()">Restart Quiz</button>
      <button class="quiz-btn" onclick="goHome()">Home</button>
  `;

  document.getElementById("quizContainer").innerHTML = resultsHTML;

  const incorrectContainer = document.getElementById("incorrect-answers");

  if (incorrectQuestions.length === 0) {
    incorrectContainer.innerHTML = "<p>Great job! No incorrect answers 🎉</p>";
  } else {
    incorrectQuestions.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("incorrect-item");
      div.innerHTML = `
              <p><strong>Question:</strong> ${item.question}</p>
              <p><span style="color: red;">❌ Your Answer:</span> ${
                item.selectedAnswer
              }</p>
              <p><span style="color: green;">✔ Correct Answer:</span> ${
                item.options[item.correctIndex]
              }</p>
              <p><strong>Explanation:</strong> ${formatExplanation(item.explanation)}</p>
              <hr>
          `;
      incorrectContainer.appendChild(div);
    });
  }

  if (incorrectQuestions.length > 0 && quizMode === "complete") {
    await storeIncorrectQuestions();
  }
  
  // Save quiz result to analytics
  await saveQuizResult({
    totalQuestions: currentQuiz.length,
    correctAnswers: score,
    timeTaken: totalQuizTime,
    questionTimes: questionTimes,
    correctQuestionIds: currentQuiz
      .map((q, index) => index)
      .filter(index => currentQuiz[index].correctlyAnswered)
  });
  
  const accuracy = (score / currentQuiz.length) * 100;
  
  // Add celebration for high accuracy
  if (accuracy >= 90) {
    triggerHighAccuracyCelebration();
  }
  
  // Track goal progress
  await trackGoalProgress(score, currentQuiz.length);
  
  // Add save button for marked difficult questions
  if (markedDifficultQuestions && markedDifficultQuestions.length > 0) {
    addSaveMarkedQuestionsButton();
  }
}

// Function to add save button for marked questions
function addSaveMarkedQuestionsButton() {
  const quizContainer = document.getElementById("quizContainer");
  
  // Check if button already exists
  if (quizContainer.querySelector('#saveMarkedQuestionsBtn')) {
    return;
  }
  
  const saveButton = document.createElement("button");
  saveButton.id = "saveMarkedQuestionsBtn";
  saveButton.className = "quiz-btn";
  saveButton.style.backgroundColor = "#e74c3c";
  saveButton.style.margin = "10px";
  saveButton.innerHTML = `💾 Save ${markedDifficultQuestions.length} Marked Questions`;
  saveButton.onclick = showDifficultCollectionDialog;
  
  // Find the button container or add after the Home button
  const buttonsContainer = quizContainer.querySelector('.incorrect-items-container');
  const homeBtn = quizContainer.querySelector('button[onclick="goHome()"]');
  
  if (homeBtn) {
    // Insert before the Home button
    homeBtn.parentNode.insertBefore(saveButton, homeBtn);
  } else if (buttonsContainer) {
    buttonsContainer.appendChild(saveButton);
  } else {
    // Append at the end
    quizContainer.appendChild(saveButton);
  }
}

// Function to show dialog for saving marked questions
function showDifficultCollectionDialog() {
  if (!markedDifficultQuestions || markedDifficultQuestions.length === 0) {
    alert("No marked questions to save!");
    return;
  }
  
  const dialog = document.createElement('div');
  dialog.className = 'difficult-collection-dialog';
  
  // Get all folders for selection
  const folderOptions = Object.keys(quizzes)
    .filter(f => !f.includes('_Incorrect'))
    .map(f => `<option value="${f}">${f}</option>`)
    .join('');
  
  dialog.innerHTML = `
    <div class="dialog-content">
      <h3>Save Marked Questions</h3>
      <p>You've marked ${markedDifficultQuestions.length} question(s) as difficult. Save them to:</p>
      
      <div class="folder-options">
        <label>
          <input type="radio" name="saveOption" value="existing" checked> 
          Existing folder:
          <select id="existingFolderSelect">
            <option value="">Select a folder</option>
            ${folderOptions}
          </select>
        </label>
        
        <label>
          <input type="radio" name="saveOption" value="new"> 
          New folder:
          <input type="text" id="newFolderName" placeholder="Enter folder name">
        </label>
      </div>
      
      <p>Questions to save:</p>
      <ul>
        ${markedDifficultQuestions.map((q, i) => `
          <li>
            <span>Q${q.markedIndex + 1}:</span> 
            ${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}
          </li>
        `).join('')}
      </ul>
      
      <div class="dialog-buttons">
        <button class="cancel-btn" onclick="skipSavingDifficultQuestions()">Cancel</button>
        <button class="save-btn" onclick="saveMarkedQuestions()">Save Questions</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Add event listeners for radio buttons
  const radioButtons = dialog.querySelectorAll('input[name="saveOption"]');
  const existingSelect = dialog.querySelector('#existingFolderSelect');
  const newFolderInput = dialog.querySelector('#newFolderName');
  
  // Initially show/hide based on selection
  if (radioButtons[0].checked) {
    existingSelect.style.display = 'block';
    newFolderInput.style.display = 'none';
  } else {
    existingSelect.style.display = 'none';
    newFolderInput.style.display = 'block';
  }
  
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'existing') {
        existingSelect.style.display = 'block';
        newFolderInput.style.display = 'none';
      } else {
        existingSelect.style.display = 'none';
        newFolderInput.style.display = 'block';
      }
    });
  });
}

// Function to save marked questions
async function saveMarkedQuestions() {
  const dialog = document.querySelector('.difficult-collection-dialog');
  if (!dialog) return;
  
  const saveOption = dialog.querySelector('input[name="saveOption"]:checked').value;
  
  let targetFolder;
  
  if (saveOption === 'existing') {
    const selectedFolder = dialog.querySelector('#existingFolderSelect').value;
    if (!selectedFolder) {
      alert('Please select a folder!');
      return;
    }
    targetFolder = selectedFolder;
  } else {
    const newFolderName = dialog.querySelector('#newFolderName').value.trim();
    if (!newFolderName) {
      alert('Please enter a folder name!');
      return;
    }
    
    if (quizzes[newFolderName]) {
      alert('Folder already exists!');
      return;
    }
    
    targetFolder = newFolderName;
    // Create new folder
    quizzes[targetFolder] = [];
  }
  
  try {
    // Add marked questions to target folder
    let savedCount = 0;
    markedDifficultQuestions.forEach(markedQuestion => {
      // Remove the markedIndex property before saving
      const { markedIndex, ...questionToSave } = markedQuestion;
      
      // Check if question already exists in the folder
      const existingQuestion = quizzes[targetFolder].find(
        q => q.question === questionToSave.question
      );
      
      if (!existingQuestion) {
        quizzes[targetFolder].push(questionToSave);
        savedCount++;
      }
    });
    
    // Save to IndexedDB
    await saveQuizzes();
    
    // Remove dialog
    dialog.remove();
    
    // Show success message
    alert(`✅ Successfully saved ${savedCount} question(s) to "${targetFolder}"!`);
    
    // Update UI
    updateFolderList();
    
    // Clear marked questions
    markedDifficultQuestions = [];
    
    // Remove the save button from results
    const saveButton = document.getElementById("saveMarkedQuestionsBtn");
    if (saveButton) saveButton.remove();
    
  } catch (error) {
    console.error('Error saving marked questions:', error);
    alert('Error saving questions. Please try again.');
  }
}

// Function to skip saving and just close dialog
function skipSavingDifficultQuestions() {
  const dialog = document.querySelector('.difficult-collection-dialog');
  if (dialog) dialog.remove();
}

// Update the restartQuiz function to clear marked questions
function restartQuiz() {
  // Clear timer if active
  if (quizTimer) {
    clearInterval(quizTimer);
    quizTimer = null;
  }

  // Reset quiz state including marked questions
  currentQuestionIndex = 0;
  score = 0;
  incorrectQuestions = [];
  markedDifficultQuestions = [];
  questionTimes = [];
  totalQuizTime = 0;
  questionStartTime = Date.now();

  // Reset UI
  document.getElementById("quizContainer").innerHTML = `
      <div id="quiz-progress">
          <span id="current-question">1</span> / <span id="total-questions">${currentQuiz.length}</span>
      </div>
      <div id="quiz-timer">
          Time Left: <span id="time-display">00:00</span>
      </div>
      <h2 id="question-text">Question will appear here</h2>
      <div id="options"></div>
  `;

  // Restart with same settings
  loadQuestion();

  // Restart timer if it was enabled
  if (timerEnabled) {
    const minutes = Math.ceil(timeLeft / 60);
    startTimer(minutes);
  }
}

// Update the goHome function to clear marked questions
// Add this at the beginning of goHome()


// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .mark-difficult-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .mark-difficult-btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }
  
  .mark-difficult-btn.marked {
    background-color: #27ae60;
    transform: scale(0.95);
  }
  
  .mark-difficult-btn.marked:hover {
    background-color: #219653;
  }
  
  .question-marked {
    position: relative;
  }
  
  .question-marked::after {
    content: "⚠️ Difficult";
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(231, 76, 60, 0.9);
    color: white;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
  }
`;
document.head.appendChild(style);
