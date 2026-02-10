// Mixed Quiz Feature
let mixedQuizSettings = {
    selectedFolders: [], // Array of selected folder names
    totalQuestions: 10,
    timePerQuestion: 30, // seconds
    totalTime: 0, // Will be calculated
    questionPool: [], // Combined questions from all selected folders
    shuffleQuestions: true,
    equallyDistributed: true // Distribute questions equally among folders
};

let mixedQuizActive = false;
let mixedQuizTimer = null;
let mixedQuizTimeLeft = 0;
let mixedQuizCurrentQuestionIndex = 0;
let mixedQuizScore = 0;
let mixedQuizIncorrectQuestions = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add Mixed Quiz button to mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const mixedQuizBtn = document.createElement('button');
        mixedQuizBtn.className = 'button-quiz';
        mixedQuizBtn.textContent = 'Mixed Quiz';
        mixedQuizBtn.onclick = showMixedQuizSettings;
        mobileMenu.appendChild(mixedQuizBtn);
    }
});

// Show mixed quiz settings modal
// function showMixedQuizSettings() {
//     // Close mobile menu if open
//     toggleMenu();
    
//     // Create modal
//     const modal = document.createElement('div');
//     modal.className = 'mixed-quiz-modal';
//     modal.innerHTML = `
//         <div class="mixed-quiz-dialog">
//            <h3>Mixed Quiz Settings</h3>
        
//         <div class="form-group">
//             <div class="folder-selection-header">
//                 <h4>Select Folders</h4>
//                 <div class="folder-actions">
//                     <button class="select-all-btn">Select All</button>
//                     <button class="deselect-btn">Deselect All</button>
//                 </div>
//             </div>
            
//             <input type="text" id="folderSearchInput" class="folder-search" placeholder="Search folders...">
            
//             <div id="folderCheckboxContainer" class="folder-checkbox-container">
//                 <!-- Folders go here -->
//             </div>
            
//             <p class="selected-count" id="selectedCount">Selected: 0 folders</p>
//         </div>
            
//             <div class="form-group">
//                 <label>Total Questions:</label>
//                 <input type="number" id="mixedTotalQuestions" min="1" max="100" value="10">
//             </div>
            
//             <div class="form-group">
//                 <label>Time per Question (seconds):</label>
//                 <input type="number" id="mixedTimePerQuestion" min="5" max="120" value="30">
//             </div>
            
//             <div class="form-group">
//                 <label>
//                     <input type="checkbox" id="mixedShuffleQuestions" checked>
//                     Shuffle Questions
//                 </label>
//             </div>
            
//             <div class="form-group">
//                 <label>
//                     <input type="checkbox" id="mixedEquallyDistributed" checked>
//                     Equally Distribute Questions
//                 </label>
//                 <p class="form-hint">If checked, questions will be equally selected from each folder</p>
//             </div>
            
//             <div class="form-group">
//                 <p id="mixedQuizSummary">Summary will appear here</p>
//             </div>
            
//             <div class="button-group">
//                 <button class="quiz-btn" onclick="startMixedQuiz()">Start Mixed Quiz</button>
//                 <button class="quiz-btn cancel-btn" onclick="document.querySelector('.mixed-quiz-modal').remove()">Cancel</button>
//             </div>
//         </div>
//     `;
    
//     document.body.appendChild(modal);
    
//     // Populate folder checkboxes
//     populateFolderCheckboxes();
    
//     // Update summary when inputs change
//     modal.querySelector('#mixedTotalQuestions').addEventListener('input', updateMixedQuizSummary);
//     modal.querySelector('#mixedTimePerQuestion').addEventListener('input', updateMixedQuizSummary);
    
//     // Initial summary update
//     updateMixedQuizSummary();
// }
// Show mixed quiz settings modal
// function showMixedQuizSettings() {
//     // Close mobile menu if open
//     toggleMenu();
    
//     // Create modal
//     const modal = document.createElement('div');
//     modal.className = 'mixed-quiz-modal';
//     modal.innerHTML = `
//         <div class="mixed-quiz-dialog">
//            <h3>Mixed Quiz Settings</h3>
        
//         <div class="form-group">
//             <div class="folder-selection-header">
//                 <h4>Select Folders</h4>
//                 <div class="folder-actions">
//                     <button class="select-all-btn">Select All</button>
//                     <button class="deselect-btn">Deselect All</button>
//                 </div>
//             </div>
            
//             <input type="text" id="folderSearchInput" class="folder-search" placeholder="Search folders...">
            
//             <div id="folderCheckboxContainer" class="folder-checkbox-container">
//                 <!-- Folders go here -->
//             </div>
            
//             <p class="selected-count" id="selectedCount">Selected: 0 folders</p>
//         </div>
            
//             <div class="form-group">
//                 <label>Total Questions:</label>
//                 <input type="number" id="mixedTotalQuestions" min="1" max="100" value="10">
//             </div>
            
//             <div class="form-group">
//                 <label>Time per Question (seconds):</label>
//                 <input type="number" id="mixedTimePerQuestion" min="5" max="120" value="30">
//             </div>
            
//             <div class="form-group">
//                 <label>
//                     <input type="checkbox" id="mixedShuffleQuestions" checked>
//                     Shuffle Questions
//                 </label>
//             </div>
            
//             <div class="form-group">
//                 <label>
//                     <input type="checkbox" id="mixedEquallyDistributed" checked>
//                     Equally Distribute Questions
//                 </label>
//                 <p class="form-hint">If checked, questions will be equally selected from each folder</p>
//             </div>
            
//             <div class="form-group">
//                 <p id="mixedQuizSummary">Summary will appear here</p>
//             </div>
            
//             <div class="button-group">
//                 <button class="quiz-btn" onclick="startMixedQuiz()">Start Mixed Quiz</button>
//                 <button class="quiz-btn cancel-btn" onclick="document.querySelector('.mixed-quiz-modal').remove()">Cancel</button>
//             </div>
//         </div>
//     `;
    
//     document.body.appendChild(modal);
    
//     // Populate folder checkboxes
//     populateFolderCheckboxes();
    
//     // Update summary when inputs change
//     modal.querySelector('#mixedTotalQuestions').addEventListener('input', updateMixedQuizSummary);
//     modal.querySelector('#mixedTimePerQuestion').addEventListener('input', updateMixedQuizSummary);
    
//     // Initial summary update
//     updateMixedQuizSummary();

//     // ─── Folder search, select all, count ─────────────────────────────────
//     const searchInput = modal.querySelector('#folderSearchInput');
//     const container = modal.querySelector('#folderCheckboxContainer');
//     const countDisplay = modal.querySelector('#selectedCount');
//     const selectAllBtn = modal.querySelector('.select-all-btn');
//     const deselectBtn = modal.querySelector('.deselect-btn');

//     // Update selected count
//     function updateSelectedCount() {
//         const checked = container.querySelectorAll('input[type="checkbox"]:checked').length;
//         countDisplay.textContent = `Selected: ${checked} folder${checked !== 1 ? 's' : ''}`;
//     }

//     // Live search
//     searchInput.addEventListener('input', (e) => {
//         const term = e.target.value.toLowerCase().trim();
       
//         container.querySelectorAll('.folder-checkbox-item').forEach(item => {
//             const label = item.querySelector('label').textContent.toLowerCase();
//             item.style.display = label.includes(term) ? '' : 'none';
//         });
//     });

//     // Select / Deselect All
//     selectAllBtn.addEventListener('click', () => {
//         container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
//             if (cb.offsetParent !== null) { // only visible ones
//                 cb.checked = true;
//             }
//         });
//         updateSelectedCount();
//         updateMixedQuizSummary();
//     });

//     deselectBtn.addEventListener('click', () => {
//         container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
//             cb.checked = false;
//         });
//         updateSelectedCount();
//         updateMixedQuizSummary();
//     });

//     // Update count when any checkbox changes
//     container.addEventListener('change', (e) => {
//         if (e.target.type === 'checkbox') {
//             updateSelectedCount();
//             updateMixedQuizSummary();
//         }
//     });

//     // Initial count
//     updateSelectedCount();
// }
// Show mixed quiz settings modal
function showMixedQuizSettings() {
    // Close mobile menu only if it's currently open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('show')) {
        toggleMenu(); // केवल तभी close करें जब menu खुला हो
    }
    
    // Rest of your existing code remains the same...
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'mixed-quiz-modal';
    modal.innerHTML = `
        <div class="mixed-quiz-dialog">
           <h3>Mixed Quiz Settings</h3>
        
        <div class="form-group">
            <div class="folder-selection-header">
                <h4>Select Folders</h4>
                <div class="folder-actions">
                    <button class="select-all-btn">Select All</button>
                    <button class="deselect-btn">Deselect All</button>
                </div>
            </div>
            
            <input type="text" id="folderSearchInput" class="folder-search" placeholder="Search folders...">
            
            <div id="folderCheckboxContainer" class="folder-checkbox-container">
                <!-- Folders go here -->
            </div>
            
            <p class="selected-count" id="selectedCount">Selected: 0 folders</p>
        </div>
            
            <div class="form-group">
                <label>Total Questions:</label>
                <input type="number" id="mixedTotalQuestions" min="1" max="100" value="10">
            </div>
            
            <div class="form-group">
                <label>Time per Question (seconds):</label>
                <input type="number" id="mixedTimePerQuestion" min="5" max="120" value="30">
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="mixedShuffleQuestions" checked>
                    Shuffle Questions
                </label>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="mixedEquallyDistributed" checked>
                    Equally Distribute Questions
                </label>
                <p class="form-hint">If checked, questions will be equally selected from each folder</p>
            </div>
            
            <div class="form-group">
                <p id="mixedQuizSummary">Summary will appear here</p>
            </div>
            
            <div class="button-group">
                <button class="quiz-btn" onclick="startMixedQuiz()">Start Mixed Quiz</button>
                <button class="quiz-btn cancel-btn" onclick="document.querySelector('.mixed-quiz-modal').remove()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Populate folder checkboxes
    populateFolderCheckboxes();
    
    // Update summary when inputs change
    modal.querySelector('#mixedTotalQuestions').addEventListener('input', updateMixedQuizSummary);
    modal.querySelector('#mixedTimePerQuestion').addEventListener('input', updateMixedQuizSummary);
    
    // Initial summary update
    updateMixedQuizSummary();

    // ─── Folder search, select all, count ─────────────────────────────────
    const searchInput = modal.querySelector('#folderSearchInput');
    const container = modal.querySelector('#folderCheckboxContainer');
    const countDisplay = modal.querySelector('#selectedCount');
    const selectAllBtn = modal.querySelector('.select-all-btn');
    const deselectBtn = modal.querySelector('.deselect-btn');

    // Update selected count
    function updateSelectedCount() {
        const checked = container.querySelectorAll('input[type="checkbox"]:checked').length;
        countDisplay.textContent = `Selected: ${checked} folder${checked !== 1 ? 's' : ''}`;
    }

    // Live search
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
       
        container.querySelectorAll('.folder-checkbox-item').forEach(item => {
            const label = item.querySelector('label').textContent.toLowerCase();
            item.style.display = label.includes(term) ? '' : 'none';
        });
    });

    // Select / Deselect All
    selectAllBtn.addEventListener('click', () => {
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb.offsetParent !== null) { // only visible ones
                cb.checked = true;
            }
        });
        updateSelectedCount();
        updateMixedQuizSummary();
    });

    deselectBtn.addEventListener('click', () => {
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        updateSelectedCount();
        updateMixedQuizSummary();
    });

    // Update count when any checkbox changes
    container.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateSelectedCount();
            updateMixedQuizSummary();
        }
    });

    // Initial count
    updateSelectedCount();
}
// Populate folder checkboxes
function populateFolderCheckboxes() {
    const container = document.getElementById('folderCheckboxContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const folders = Object.keys(quizzes).filter(f => !f.includes('_Incorrect'));
    
    if (folders.length === 0) {
        container.innerHTML = '<p>No folders available. Please create folders first.</p>';
        return;
    }
    
    folders.forEach(folder => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'folder-checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `folder-${folder}`;
        checkbox.value = folder;
        checkbox.checked = folder === currentFolder; // Auto-check current folder
        
        const label = document.createElement('label');
        label.htmlFor = `folder-${folder}`;
        label.textContent = `${folder} (${quizzes[folder].length} questions)`;
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        container.appendChild(checkboxContainer);
        
        // Add event listener to update summary
        checkbox.addEventListener('change', updateMixedQuizSummary);
    });
}
// ─── Folder search, select all, count ─────────────────────────────────

const searchInput = modal.querySelector('#folderSearchInput');
const container = modal.querySelector('#folderCheckboxContainer');
const countDisplay = modal.querySelector('#selectedCount');
const selectAllBtn = modal.querySelector('.select-all-btn');
const deselectBtn = modal.querySelector('.deselect-btn');

// Update selected count
function updateSelectedCount() {
    const checked = container.querySelectorAll('input[type="checkbox"]:checked').length;
    countDisplay.textContent = `Selected: ${checked} folder${checked !== 1 ? 's' : ''}`;
}

// Live search
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    
    container.querySelectorAll('.folder-checkbox-item').forEach(item => {
        const label = item.querySelector('label').textContent.toLowerCase();
        item.style.display = label.includes(term) ? '' : 'none';
    });
});

// Select / Deselect All
selectAllBtn.addEventListener('click', () => {
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.offsetParent !== null) { // only visible ones
            cb.checked = true;
        }
    });
    updateSelectedCount();
    updateMixedQuizSummary();
});

deselectBtn.addEventListener('click', () => {
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    updateSelectedCount();
    updateMixedQuizSummary();
});

// Update count when any checkbox changes
container.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        updateSelectedCount();
        updateMixedQuizSummary();
    }
});

// Initial count
updateSelectedCount();
// Update mixed quiz summary
function updateMixedQuizSummary() {
    const summaryElement = document.getElementById('mixedQuizSummary');
    if (!summaryElement) return;
    
    // Get selected folders
    const selectedFolders = getSelectedFolders();
    const totalQuestions = parseInt(document.querySelector('#mixedTotalQuestions').value) || 10;
    const timePerQuestion = parseInt(document.querySelector('#mixedTimePerQuestion').value) || 30;
    const equallyDistributed = document.querySelector('#mixedEquallyDistributed').checked;
    
    if (selectedFolders.length === 0) {
        summaryElement.textContent = 'Please select at least one folder.';
        summaryElement.style.color = '#e74c3c';
        return;
    }
    
    // Calculate total available questions
    let totalAvailableQuestions = 0;
    selectedFolders.forEach(folder => {
        totalAvailableQuestions += quizzes[folder].length;
    });
    
    if (totalQuestions > totalAvailableQuestions) {
        summaryElement.textContent = `Warning: Only ${totalAvailableQuestions} questions available across selected folders.`;
        summaryElement.style.color = '#f39c12';
        return;
    }
    
    // Calculate distribution
    let distributionText = '';
    if (equallyDistributed && selectedFolders.length > 0) {
        const questionsPerFolder = Math.floor(totalQuestions / selectedFolders.length);
        const remainder = totalQuestions % selectedFolders.length;
        
        distributionText = 'Distribution: ';
        selectedFolders.forEach((folder, index) => {
            const questionsFromThisFolder = questionsPerFolder + (index < remainder ? 1 : 0);
            const maxQuestions = quizzes[folder].length;
            const actualQuestions = Math.min(questionsFromThisFolder, maxQuestions);
            
            distributionText += `${folder}: ${actualQuestions}, `;
        });
        distributionText = distributionText.slice(0, -2); // Remove trailing comma
    }
    
    const totalTime = totalQuestions * timePerQuestion;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    summaryElement.innerHTML = `
        <strong>Quiz Summary:</strong><br>
        • Selected Folders: ${selectedFolders.join(', ')}<br>
        • Total Questions: ${totalQuestions}<br>
        • Time per Question: ${timePerQuestion} seconds<br>
        • Total Time: ${minutes}m ${seconds}s<br>
        • ${distributionText}
    `;
    summaryElement.style.color = '#333';
}

// Get selected folders from checkboxes
function getSelectedFolders() {
    const checkboxes = document.querySelectorAll('.folder-checkbox-container input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Start mixed quiz
function startMixedQuiz() {
    // Get settings
    const selectedFolders = getSelectedFolders();
    const totalQuestions = parseInt(document.querySelector('#mixedTotalQuestions').value) || 10;
    const timePerQuestion = parseInt(document.querySelector('#mixedTimePerQuestion').value) || 30;
    const shuffleQuestions = document.querySelector('#mixedShuffleQuestions').checked;
    const equallyDistributed = document.querySelector('#mixedEquallyDistributed').checked;
    
    // Validate inputs
    if (selectedFolders.length === 0) {
        alert('Please select at least one folder.');
        return;
    }
    
    // Calculate total available questions
    let totalAvailableQuestions = 0;
    selectedFolders.forEach(folder => {
        totalAvailableQuestions += quizzes[folder].length;
    });
    
    if (totalQuestions > totalAvailableQuestions) {
        alert(`Only ${totalAvailableQuestions} questions available across selected folders. Please reduce the number of questions.`);
        return;
    }
    
    if (totalQuestions < 1) {
        alert('Please enter a valid number of questions.');
        return;
    }
    
    // Save settings
    mixedQuizSettings = {
        selectedFolders,
        totalQuestions,
        timePerQuestion,
        totalTime: totalQuestions * timePerQuestion,
        shuffleQuestions,
        equallyDistributed,
        questionPool: []
    };
    
    // Create question pool
    createMixedQuestionPool();
    
    // Remove modal
    const modal = document.querySelector('.mixed-quiz-modal');
    if (modal) modal.remove();
    
    // Start the quiz
    startMixedQuizExecution();
}

// Create mixed question pool
// function createMixedQuestionPool() {
//     mixedQuizSettings.questionPool = [];
    
//     if (mixedQuizSettings.equallyDistributed) {
//         // Equally distribute questions among folders
//         const questionsPerFolder = Math.floor(mixedQuizSettings.totalQuestions / mixedQuizSettings.selectedFolders.length);
//         const remainder = mixedQuizSettings.totalQuestions % mixedQuizSettings.selectedFolders.length;
        
//         mixedQuizSettings.selectedFolders.forEach((folder, index) => {
//             const questionsFromThisFolder = questionsPerFolder + (index < remainder ? 1 : 0);
//             const folderQuestions = quizzes[folder];
            
//             // Shuffle folder questions if needed
//             const shuffledQuestions = mixedQuizSettings.shuffleQuestions ? 
//                 [...folderQuestions].sort(() => Math.random() - 0.5) : 
//                 [...folderQuestions];
            
//             // Take required number of questions
//             const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionsFromThisFolder, folderQuestions.length));
            
//             // Add to pool with folder info
//             selectedQuestions.forEach(q => {
//                 mixedQuizSettings.questionPool.push({
//                     ...q,
//                     sourceFolder: folder
//                 });
//             });
//         });
//     } else {
//         // Random selection from all folders combined
//         let allQuestions = [];
        
//         mixedQuizSettings.selectedFolders.forEach(folder => {
//             const folderQuestions = quizzes[folder].map(q => ({
//                 ...q,
//                 sourceFolder: folder
//             }));
//             allQuestions = allQuestions.concat(folderQuestions);
//         });
        
//         // Shuffle all questions if needed
//         if (mixedQuizSettings.shuffleQuestions) {
//             allQuestions.sort(() => Math.random() - 0.5);
//         }
        
//         // Take required number of questions
//         mixedQuizSettings.questionPool = allQuestions.slice(0, mixedQuizSettings.totalQuestions);
//     }
    
//     // Final shuffle of the entire pool (optional)
//     if (mixedQuizSettings.shuffleQuestions) {
//         mixedQuizSettings.questionPool.sort(() => Math.random() - 0.5);
//     }
// }
function createMixedQuestionPool() {
    mixedQuizSettings.questionPool = [];
    
    if (mixedQuizSettings.equallyDistributed) {
        const questionsPerFolder = Math.floor(mixedQuizSettings.totalQuestions / mixedQuizSettings.selectedFolders.length);
        const remainder = mixedQuizSettings.totalQuestions % mixedQuizSettings.selectedFolders.length;
        
        mixedQuizSettings.selectedFolders.forEach((folder, index) => {
            const takeCount = questionsPerFolder + (index < remainder ? 1 : 0);
            const folderQuestions = quizzes[folder] || [];
            
            // Pick and shuffle question order if enabled
            let selected = mixedQuizSettings.shuffleQuestions
                ? [...folderQuestions].sort(() => Math.random() - 0.5)
                : [...folderQuestions];
            
            selected = selected.slice(0, Math.min(takeCount, folderQuestions.length));
            
            // Add source folder info
            selected = selected.map(q => ({
                ...q,
                sourceFolder: folder
            }));
            
            mixedQuizSettings.questionPool.push(...selected);
        });
    } else {
        // Combined random selection
        let allQuestions = [];
        
        mixedQuizSettings.selectedFolders.forEach(folder => {
            if (!quizzes[folder]) return;
            const folderQuestions = quizzes[folder].map(q => ({
                ...q,
                sourceFolder: folder
            }));
            allQuestions.push(...folderQuestions);
        });
        
        if (mixedQuizSettings.shuffleQuestions) {
            allQuestions.sort(() => Math.random() - 0.5);
        }
        
        mixedQuizSettings.questionPool = allQuestions.slice(0, mixedQuizSettings.totalQuestions);
    }

    // ────────────────────────────────────────────────
    // Most important change: shuffle OPTIONS inside each question
    // ────────────────────────────────────────────────
    mixedQuizSettings.questionPool = prepareShuffledQuestions(mixedQuizSettings.questionPool);

    // Final shuffle of question order (optional – usually good to keep)
    if (mixedQuizSettings.shuffleQuestions) {
        mixedQuizSettings.questionPool.sort(() => Math.random() - 0.5);
    }
}
// Start mixed quiz execution
// Start mixed quiz execution
function startMixedQuizExecution() {
  mixedQuizActive = true;
  
  // Reset quiz state
  mixedQuizCurrentQuestionIndex = 0;
  mixedQuizScore = 0;
  mixedQuizIncorrectQuestions = [];
  mixedQuizTimeLeft = mixedQuizSettings.totalTime;
  
  // Hide other containers
  document.getElementById("quizContainer").classList.add("hidden");
  document.getElementById("flashcardContainer").classList.add("hidden");
  document.getElementById("analysisContainer").classList.add("hidden");
  document.getElementById("quizOptions").classList.add("hidden");
  
  // Clear any existing mixed quiz container
  const existingMixedQuiz = document.getElementById('mixedQuizContainer');
  if (existingMixedQuiz) {
    existingMixedQuiz.remove();
  }
  
  // Show mixed quiz container - Replace the entire container
  const mainContainer = document.querySelector('.container');
  mainContainer.innerHTML = `
    <div id="mixedQuizContainer">
      <div id="mixedQuizHeader">
        <div id="mixedQuizProgress">
          Question <span id="mixedCurrentQuestion">1</span> of ${mixedQuizSettings.totalQuestions}
        </div>
        <div id="mixedQuizTimer">
          Total Time Left: <span id="mixedTimerDisplay">${formatTime(mixedQuizTimeLeft)}</span>
        </div>
        <div id="mixedQuizScore">
          Score: <span id="mixedScoreDisplay">0</span> / ${mixedQuizSettings.totalQuestions}
        </div>
      </div>
      
      <div id="mixedQuizInfo">
        <div id="mixedQuizFolderInfo">
          Folder: <span id="mixedCurrentFolder">Loading...</span>
        </div>
      </div>
      
      <div id="mixedQuestionContainer">
        <h2 id="mixedQuestionText">Question will appear here</h2>
        <div id="mixedOptionsContainer"></div>
      </div>
      
      <div id="mixedQuizControls">
        <button class="quiz-btn" onclick="endMixedQuiz()">End Quiz</button>
        <button class="quiz-btn" onclick="goHome()">Home</button>
      </div>
    </div>
  `;
  
  // Start timer
  startMixedQuizTimer();
  
  // Load first question
  loadMixedQuestion();
}

// Start mixed quiz timer
function startMixedQuizTimer() {
    if (mixedQuizTimer) {
        clearInterval(mixedQuizTimer);
    }
    
    updateMixedTimerDisplay();
    
    mixedQuizTimer = setInterval(() => {
        mixedQuizTimeLeft--;
        updateMixedTimerDisplay();
        
        if (mixedQuizTimeLeft <= 0) {
            clearInterval(mixedQuizTimer);
            timeUpMixedQuiz();
        }
    }, 1000);
}

// Update mixed timer display
function updateMixedTimerDisplay() {
    const timerDisplay = document.getElementById('mixedTimerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(mixedQuizTimeLeft);
        
        if (mixedQuizTimeLeft <= 30) {
            timerDisplay.style.color = '#e74c3c';
            timerDisplay.parentElement.classList.add('warning');
        } else if (mixedQuizTimeLeft <= 60) {
            timerDisplay.style.color = '#f39c12';
        } else {
            timerDisplay.style.color = '';
            timerDisplay.parentElement.classList.remove('warning');
        }
    }
}

// Time up for mixed quiz
function timeUpMixedQuiz() {
    // Mark all remaining questions as incorrect
    while (mixedQuizCurrentQuestionIndex < mixedQuizSettings.questionPool.length) {
        const question = mixedQuizSettings.questionPool[mixedQuizCurrentQuestionIndex];
        question.timesIncorrect = (question.timesIncorrect || 0) + 1;
        question.selectedAnswer = "Time expired";
        question.sourceFolder = question.sourceFolder || "Unknown";
        mixedQuizIncorrectQuestions.push(question);
        mixedQuizCurrentQuestionIndex++;
    }
    
    showMixedQuizResults();
}

// Load mixed question
function loadMixedQuestion() {
    if (mixedQuizCurrentQuestionIndex >= mixedQuizSettings.questionPool.length) {
        showMixedQuizResults();
        return;
    }
    
    const question = mixedQuizSettings.questionPool[mixedQuizCurrentQuestionIndex];
    
    // Update UI
    document.getElementById('mixedCurrentQuestion').textContent = mixedQuizCurrentQuestionIndex + 1;
    document.getElementById('mixedScoreDisplay').textContent = mixedQuizScore;
    document.getElementById('mixedCurrentFolder').textContent = question.sourceFolder || "Unknown";
    document.getElementById('mixedQuestionText').textContent = question.question;
    
    // Create options
    const optionsContainer = document.getElementById('mixedOptionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn mixed-option-btn';
        button.textContent = option;
        button.onclick = () => selectMixedAnswer(index);
        optionsContainer.appendChild(button);
    });
}

// Select answer in mixed quiz
function selectMixedAnswer(selectedIndex) {
    const question = mixedQuizSettings.questionPool[mixedQuizCurrentQuestionIndex];
    const isCorrect = selectedIndex === question.correctIndex;
    
    if (isCorrect) {
        mixedQuizScore++;
        question.correctlyAnswered = true;
    } else {
        question.timesIncorrect = (question.timesIncorrect || 0) + 1;
        question.selectedAnswer = question.options[selectedIndex];
        question.sourceFolder = question.sourceFolder || "Unknown";
        mixedQuizIncorrectQuestions.push(question);
    }
    
    mixedQuizCurrentQuestionIndex++;
    
    if (mixedQuizCurrentQuestionIndex < mixedQuizSettings.questionPool.length) {
        loadMixedQuestion();
    } else {
        showMixedQuizResults();
    }
}

// Show mixed quiz results
// Show mixed quiz results
async function showMixedQuizResults() {
  if (mixedQuizTimer) {
    clearInterval(mixedQuizTimer);
    mixedQuizTimer = null;
  }
  
  mixedQuizActive = false; // IMPORTANT: Set to false when showing results
  
  // Calculate accuracy
  const accuracy = (mixedQuizScore / mixedQuizSettings.totalQuestions) * 100;
  
  // Group incorrect questions by folder
  const incorrectByFolder = {};
  mixedQuizIncorrectQuestions.forEach(question => {
    const folder = question.sourceFolder || "Unknown";
    if (!incorrectByFolder[folder]) {
      incorrectByFolder[folder] = [];
    }
    incorrectByFolder[folder].push(question);
  });
  
  // Create results HTML
  let resultsHTML = `
    <div id="mixedQuizResults">
      <h2>Mixed Quiz Completed!</h2>
      
      <div class="results-summary">
        <div class="result-stat">
          <h3>Score</h3>
          <p class="stat-value">${mixedQuizScore} / ${mixedQuizSettings.totalQuestions}</p>
        </div>
        <div class="result-stat">
          <h3>Accuracy</h3>
          <p class="stat-value">${accuracy.toFixed(1)}%</p>
        </div>
        <div class="result-stat">
          <h3>Time Taken</h3>
          <p class="stat-value">${formatTime(mixedQuizSettings.totalTime - mixedQuizTimeLeft)}</p>
        </div>
      </div>
  `;
  
  // Add breakdown by folder
  resultsHTML += `
    <div class="folder-breakdown">
      <h3>Performance by Folder</h3>
  `;
  
  // Calculate correct answers per folder
  const correctByFolder = {};
  mixedQuizSettings.questionPool.forEach(question => {
    const folder = question.sourceFolder || "Unknown";
    if (!correctByFolder[folder]) {
      correctByFolder[folder] = { total: 0, correct: 0 };
    }
    correctByFolder[folder].total++;
    if (question.correctlyAnswered) {
      correctByFolder[folder].correct++;
    }
  });
  
  // Display folder breakdown
  Object.keys(correctByFolder).forEach(folder => {
    const stats = correctByFolder[folder];
    const folderAccuracy = (stats.correct / stats.total) * 100;
    
    resultsHTML += `
      <div class="folder-stat">
        <span class="folder-name">${folder}:</span>
        <span class="folder-score">${stats.correct}/${stats.total}</span>
        <span class="folder-accuracy">(${folderAccuracy.toFixed(1)}%)</span>
      </div>
    `;
  });
  
  resultsHTML += `</div>`;
  
  // Add incorrect questions section
  if (mixedQuizIncorrectQuestions.length > 0) {
    resultsHTML += `
      <div class="incorrect-questions">
        <h3>Incorrect Questions (${mixedQuizIncorrectQuestions.length})</h3>
    `;
    
    Object.keys(incorrectByFolder).forEach(folder => {
      resultsHTML += `<h4>${folder}:</h4>`;
      incorrectByFolder[folder].forEach((question, index) => {
        resultsHTML += `
          <div class="incorrect-item">
            <p><strong>Question:</strong> ${question.question}</p>
            <p><span style="color: red;">❌ Your Answer:</span> ${question.selectedAnswer}</p>
            <p><span style="color: green;">✔ Correct Answer:</span> ${question.options[question.correctIndex]}</p>
            <p><strong>Explanation:</strong> ${formatExplanation(question.explanation)}</p>
            <hr>
          </div>
        `;
      });
    });
    
    resultsHTML += `</div>`;
  } else {
    resultsHTML += `
      <div class="perfect-score">
        <h3>🎉 Perfect Score! 🎉</h3>
        <p>You answered all questions correctly! Excellent work!</p>
      </div>
    `;
    
    // Trigger celebration
    if (typeof triggerHighAccuracyCelebration === 'function') {
      triggerHighAccuracyCelebration();
    }
  }
  
  // Add action buttons - FIXED: Use onclick with function call
  resultsHTML += `
    <div class="results-actions">
      <button class="quiz-btn" id="restartMixedQuizBtn">Restart Mixed Quiz</button>
      <button class="quiz-btn" id="goHomeBtn">Home</button>
    </div>
  `;
  
  resultsHTML += `</div>`;
  
  // Display results in the main container
  const container = document.querySelector('.container');
  if (container) {
    container.innerHTML = resultsHTML;
    
    // Add event listeners to buttons AFTER they are added to DOM
    setTimeout(() => {
      const restartBtn = document.getElementById('restartMixedQuizBtn');
      const homeBtn = document.getElementById('goHomeBtn');
      
      if (restartBtn) {
        restartBtn.addEventListener('click', restartMixedQuiz);
      }
      
      if (homeBtn) {
        homeBtn.addEventListener('click', goHome);
      }
    }, 100);
  }
  
  // Save results to analytics
  await saveMixedQuizResults();
  
  // Track goal progress
  if (typeof trackGoalProgress === 'function') {
    await trackGoalProgress(mixedQuizScore, mixedQuizSettings.totalQuestions);
  }
}

// Save mixed quiz results to analytics
async function saveMixedQuizResults() {
    try {
        const transaction = db.transaction(["analytics"], "readwrite");
        const store = transaction.objectStore("analytics");
        
        const record = {
            folderName: "Mixed Quiz", // Special identifier for mixed quizzes
            date: new Date().toISOString().split("T")[0],
            startIndex: 0,
            endIndex: mixedQuizSettings.totalQuestions,
            totalQuestions: mixedQuizSettings.totalQuestions,
            correctAnswers: mixedQuizScore,
            timeTaken: mixedQuizSettings.totalTime - mixedQuizTimeLeft,
            questionTimes: [], // Not tracked in mixed quiz
            mode: "mixed",
            foldersUsed: mixedQuizSettings.selectedFolders.join(", "),
            correctQuestionIds: [] // Not tracked in mixed quiz
        };
        
        const request = store.add(record);
        request.onsuccess = () => console.log("Mixed quiz results saved");
        request.onerror = (event) => console.error("Error saving mixed quiz results:", event.target.error);
    } catch (error) {
        console.error("Error saving mixed quiz results:", error);
    }
}

// Restart mixed quiz
function restartMixedQuiz() {
    // Reset state
    mixedQuizCurrentQuestionIndex = 0;
    mixedQuizScore = 0;
    mixedQuizIncorrectQuestions = [];
    mixedQuizTimeLeft = mixedQuizSettings.totalTime;
    
    // Re-shuffle questions if needed
    if (mixedQuizSettings.shuffleQuestions) {
        mixedQuizSettings.questionPool.sort(() => Math.random() - 0.5);
    }
    
    // Restart quiz
    startMixedQuizExecution();
}

// End mixed quiz early
function endMixedQuiz() {
    if (confirm("Are you sure you want to end the mixed quiz? Your progress will be saved.")) {
        // Mark remaining questions as incorrect
        while (mixedQuizCurrentQuestionIndex < mixedQuizSettings.questionPool.length) {
            const question = mixedQuizSettings.questionPool[mixedQuizCurrentQuestionIndex];
            question.timesIncorrect = (question.timesIncorrect || 0) + 1;
            question.selectedAnswer = "Quiz ended early";
            question.sourceFolder = question.sourceFolder || "Unknown";
            mixedQuizIncorrectQuestions.push(question);
            mixedQuizCurrentQuestionIndex++;
        }
        
        showMixedQuizResults();
    }
}

// Helper function to format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update goHome function to handle mixed quiz cleanup
