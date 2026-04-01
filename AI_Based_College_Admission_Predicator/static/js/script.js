// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admission Predictor Ready!');
    console.log('👩‍💻 Developed by Sneha Chaudhari');
    
    initializeEventListeners();
    initializeRangeVisuals();
    initializeRatingStars();
    initializeStreamOptions();
});

// Switch between UG and PG modes
function switchMode(mode) {
    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'ug') {
        document.querySelector('.mode-btn:first-child').classList.add('active');
        document.getElementById('ug-section').classList.add('active');
        document.getElementById('pg-section').classList.remove('active');
    } else {
        document.querySelector('.mode-btn:last-child').classList.add('active');
        document.getElementById('ug-section').classList.remove('active');
        document.getElementById('pg-section').classList.add('active');
    }
    
    // Clear results
    resetForm();
}

// Initialize stream options
function initializeStreamOptions() {
    updateStreamOptions();
}

// Update stream options based on exam type
function updateStreamOptions() {
    const examType = document.getElementById('ug_exam_type').value;
    const streamSelect = document.getElementById('ug_stream');
    
    streamSelect.innerHTML = '<option value="" disabled selected>Select stream</option>';
    
    let streams = [];
    
    if (examType === 'neet') {
        streams = [
            'MBBS',
            'BDS',
            'BHMS',
            'BAMS',
            'Pharmacy',
            'Nursing',
            'Physiotherapy'
        ];
    } else if (examType === 'jee' || examType === 'jee_advanced' || examType === 'bitsat' || 
               examType === 'mhtcet' || examType === 'kcet' || examType === 'wbjee' || 
               examType === 'comedk' || examType === 'viteee' || examType === 'met') {
        streams = [
            'Computer Science Engineering',
            'Information Technology',
            'Electronics & Communication',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Chemical Engineering',
            'Biotechnology Engineering',
            'Aerospace Engineering',
            'Automobile Engineering'
        ];
    } else {
        streams = [
            'Computer Science',
            'Information Technology',
            'Electronics',
            'Electrical',
            'Mechanical',
            'Civil',
            'Chemical',
            'Biotechnology'
        ];
    }
    
    streams.forEach(stream => {
        const option = document.createElement('option');
        option.value = stream;
        option.textContent = stream;
        streamSelect.appendChild(option);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    document.getElementById('ug_entrance').addEventListener('input', function(e) {
        updateRangeFill('entrance', this.value);
        document.getElementById('entrance_value').textContent = this.value || 0;
    });
    
    document.getElementById('ug_board').addEventListener('input', function(e) {
        updateRangeFill('board', this.value);
        document.getElementById('board_value').textContent = (this.value || 0) + '%';
    });
    
    document.getElementById('ug_extracurricular').addEventListener('input', function(e) {
        updateStars(this.value);
        document.getElementById('extracurricular_value').textContent = this.value;
    });
}

// Initialize range visuals
function initializeRangeVisuals() {
    updateRangeFill('entrance', document.getElementById('ug_entrance').value || 0);
    updateRangeFill('board', document.getElementById('ug_board').value || 0);
}

// Update exam range based on selection
function updateExamRange() {
    const examType = document.getElementById('ug_exam_type').value;
    const entranceInput = document.getElementById('ug_entrance');
    const examRange = document.getElementById('exam_range');
    const examLabel = document.getElementById('exam_score_label');
    
    let maxScore = 360;
    let examName = '';
    
    switch(examType) {
        case 'jee':
        case 'jee_advanced':
            maxScore = 360;
            examName = 'JEE';
            break;
        case 'neet':
            maxScore = 720;
            examName = 'NEET';
            break;
        case 'bitsat':
            maxScore = 450;
            examName = 'BITSAT';
            break;
        case 'mhtcet':
            maxScore = 200;
            examName = 'MHT-CET';
            break;
        case 'kcet':
            maxScore = 180;
            examName = 'KCET';
            break;
        case 'wbjee':
            maxScore = 200;
            examName = 'WBJEE';
            break;
        case 'comedk':
            maxScore = 180;
            examName = 'COMEDK';
            break;
        case 'viteee':
            maxScore = 130;
            examName = 'VITEEE';
            break;
        case 'met':
            maxScore = 200;
            examName = 'MET';
            break;
        default:
            maxScore = 360;
            examName = 'Entrance';
    }
    
    entranceInput.max = maxScore;
    entranceInput.value = '';
    examRange.textContent = `0-${maxScore}`;
    examLabel.textContent = `${examName} Exam Score`;
    
    updateRangeFill('entrance', 0);
    document.getElementById('entrance_value').textContent = '0';
    
    entranceInput.classList.add('highlight');
    setTimeout(() => entranceInput.classList.remove('highlight'), 500);
}

// Update range fill
function updateRangeFill(type, value) {
    const fill = document.getElementById(`${type}_range_fill`);
    const max = type === 'entrance' ? 
        (parseInt(document.getElementById('ug_entrance').max) || 360) : 100;
    
    const percentage = (value / max) * 100;
    fill.style.width = Math.min(percentage, 100) + '%';
}

// Update rating stars
function updateStars(value) {
    const stars = document.querySelectorAll('.star');
    const rating = Math.round(value);
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

// Initialize rating stars click handlers
function initializeRatingStars() {
    const stars = document.querySelectorAll('.star');
    const slider = document.getElementById('ug_extracurricular');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            slider.value = value;
            updateStars(value);
            document.getElementById('extracurricular_value').textContent = value;
        });
    });
}

// Calculate UG admission chance with realistic logic
function calculateUGAdmission(entranceScore, boardPercentage, extracurricular, examType, category, stream) {
    const maxScores = {
        'jee': 360, 'jee_advanced': 360, 'neet': 720, 'bitsat': 450,
        'mhtcet': 200, 'kcet': 180, 'wbjee': 200, 'comedk': 180,
        'viteee': 130, 'met': 200
    };
    
    const maxScore = maxScores[examType] || 360;
    const entrancePercentage = (entranceScore / maxScore) * 100;
    
    const categoryFactors = {
        'General': 1.0,
        'OBC': 0.92,
        'SC': 0.85,
        'ST': 0.85,
        'EWS': 0.92
    };
    
    const streamFactors = {
        'Computer Science Engineering': 1.2,
        'Information Technology': 1.15,
        'Electronics & Communication': 1.1,
        'Electrical Engineering': 1.0,
        'Mechanical Engineering': 0.95,
        'Civil Engineering': 0.9,
        'Chemical Engineering': 0.85,
        'Biotechnology Engineering': 0.85,
        'Aerospace Engineering': 1.1,
        'Automobile Engineering': 0.9,
        'MBBS': 1.3,
        'BDS': 1.1,
        'Pharmacy': 0.8,
        'Nursing': 0.7
    };
    
    const entranceWeight = 0.6;
    const boardWeight = 0.25;
    const extraWeight = 0.15;
    
    let baseScore = (entrancePercentage * entranceWeight) + 
                    (boardPercentage * boardWeight) + 
                    (extracurricular * 10 * extraWeight);
    
    const categoryFactor = categoryFactors[category] || 1.0;
    const streamFactor = streamFactors[stream] || 1.0;
    
    let finalScore = (baseScore / categoryFactor) / streamFactor;
    finalScore = Math.min(100, Math.max(0, finalScore));
    
    const randomFactor = 0.97 + (Math.random() * 0.06);
    finalScore = finalScore * randomFactor;
    finalScore = Math.min(100, Math.max(0, finalScore));
    
    return Math.round(finalScore);
}

// Calculate PG admission chance
function calculatePGAdmission(gre, toefl, uniRating, sop, lor, cgpa, research) {
    const greNormalized = ((gre - 260) / 80) * 100;
    const toeflNormalized = (toefl / 120) * 100;
    const uniNormalized = (uniRating / 5) * 100;
    const cgpaNormalized = (cgpa / 10) * 100;
    const sopNormalized = (sop / 5) * 100;
    const lorNormalized = (lor / 5) * 100;
    
    const greWeight = 0.25;
    const toeflWeight = 0.15;
    const uniWeight = 0.10;
    const cgpaWeight = 0.25;
    const sopWeight = 0.10;
    const lorWeight = 0.10;
    const researchBonus = 5;
    
    let baseScore = (greNormalized * greWeight) + 
                    (toeflNormalized * toeflWeight) + 
                    (uniNormalized * uniWeight) + 
                    (cgpaNormalized * cgpaWeight) + 
                    (sopNormalized * sopWeight) + 
                    (lorNormalized * lorWeight);
    
    if (research) {
        baseScore += researchBonus;
    }
    
    baseScore = Math.min(100, Math.max(0, baseScore));
    
    const randomFactor = 0.97 + (Math.random() * 0.06);
    baseScore = baseScore * randomFactor;
    baseScore = Math.min(100, Math.max(0, baseScore));
    
    return Math.round(baseScore);
}

// UG Prediction
async function predictUG() {
    const examType = document.getElementById('ug_exam_type').value;
    const entrance = document.getElementById('ug_entrance').value;
    const board = document.getElementById('ug_board').value;
    const extracurricular = document.getElementById('ug_extracurricular').value;
    const category = document.getElementById('ug_category').value;
    const stream = document.getElementById('ug_stream').value;

    if (!examType || !entrance || !board || !extracurricular || !category || !stream) {
        showError('Please fill in all UG fields');
        return;
    }

    showLoading();

    const admissionProb = calculateUGAdmission(
        parseFloat(entrance),
        parseFloat(board),
        parseFloat(extracurricular),
        examType,
        category,
        stream
    );

    setTimeout(() => {
        displayResults({
            prediction: admissionProb >= 50 ? 'ADMITTED' : 'NOT ADMITTED',
            admission_probability: admissionProb,
            rejection_probability: 100 - admissionProb,
            confidence: Math.min(95, Math.round(admissionProb * 0.9 + 10)),
            features: {
                'Exam Type': examType.toUpperCase(),
                'Entrance Score': entrance + '/' + document.getElementById('ug_entrance').max,
                'Board Percentage': board + '%',
                'Extracurricular': extracurricular + '/10',
                'Category': category,
                'Stream': stream
            }
        }, 'UG');
    }, 1000);
}

// PG Prediction
async function predictPG() {
    const gre = document.getElementById('pg_gre').value;
    const toefl = document.getElementById('pg_toefl').value;
    const uniRating = document.getElementById('pg_uni_rating').value;
    const cgpa = document.getElementById('pg_cgpa').value;
    const sop = document.getElementById('pg_sop').value;
    const lor = document.getElementById('pg_lor').value;
    const research = document.getElementById('pg_research').checked;

    if (!gre || !toefl || !uniRating || !cgpa || !sop || !lor) {
        showError('Please fill in all PG fields');
        return;
    }

    showLoading();

    const admissionProb = calculatePGAdmission(
        parseFloat(gre),
        parseFloat(toefl),
        parseFloat(uniRating),
        parseFloat(sop),
        parseFloat(lor),
        parseFloat(cgpa),
        research
    );

    setTimeout(() => {
        displayResults({
            prediction: admissionProb >= 50 ? 'ADMITTED' : 'NOT ADMITTED',
            admission_probability: admissionProb,
            rejection_probability: 100 - admissionProb,
            confidence: Math.min(95, Math.round(admissionProb * 0.9 + 8)),
            features: {
                'GRE Score': gre + '/340',
                'TOEFL Score': toefl + '/120',
                'University Rating': uniRating + '/5',
                'CGPA': cgpa + '/10',
                'SOP': sop + '/5',
                'LOR': lor + '/5',
                'Research': research ? 'Yes' : 'No'
            }
        }, 'PG');
    }, 1000);
}

// Display results - FIXED (no glitch)
function displayResults(data, level) {
    document.getElementById('result-placeholder').classList.add('hidden');
    const resultContent = document.getElementById('result-content');
    resultContent.classList.remove('hidden');

    const resultHeader = document.getElementById('result-header');
    const isAdmitted = data.prediction === 'ADMITTED';
    
    resultHeader.className = `result-header ${isAdmitted ? 'admitted' : 'rejected'}`;
    resultHeader.innerHTML = `
        <div class="result-icon">${isAdmitted ? '🎉' : '😢'}</div>
        <div class="result-text">${isAdmitted ? 'Congratulations!' : 'Better luck next time'}</div>
        <div class="result-subtext">${data.prediction}</div>
    `;

    animateValue('admission-prob', 0, data.admission_probability, 1000, '%');
    animateValue('rejection-prob', 0, data.rejection_probability, 1000, '%');
    animateValue('confidence-value', 0, data.confidence, 1000, '%');

    document.getElementById('admission-bar').style.width = data.admission_probability + '%';
    document.getElementById('rejection-bar').style.width = data.rejection_probability + '%';
    document.getElementById('confidence-liquid').style.height = data.confidence + '%';

    const summary = document.getElementById('input-summary');
    let summaryHtml = '<h4>Your Input Summary</h4>';
    
    for (const [key, value] of Object.entries(data.features)) {
        summaryHtml += `
            <div class="summary-item">
                <span class="summary-label">${formatLabel(key)}:</span>
                <span class="summary-value">${value}</span>
            </div>
        `;
    }
    
    summary.innerHTML = summaryHtml;
}

// Animate value counting
function animateValue(elementId, start, end, duration, suffix = '') {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 10);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current) + suffix;
        }
    }, 10);
}

// Fill UG example
function fillUGExample(type) {
    switchMode('ug');
    
    const examSelect = document.getElementById('ug_exam_type');
    
    if (type === 'jee') {
        examSelect.value = 'jee';
        document.getElementById('ug_entrance').value = 340;
        document.getElementById('ug_board').value = 95;
        document.getElementById('ug_extracurricular').value = 9;
        document.getElementById('ug_category').value = 'General';
        updateStars(9);
    } else if (type === 'neet') {
        examSelect.value = 'neet';
        document.getElementById('ug_entrance').value = 680;
        document.getElementById('ug_board').value = 92;
        document.getElementById('ug_extracurricular').value = 8;
        document.getElementById('ug_category').value = 'OBC';
        updateStars(8);
    } else if (type === 'met') {
        examSelect.value = 'met';
        document.getElementById('ug_entrance').value = 150;
        document.getElementById('ug_board').value = 75;
        document.getElementById('ug_extracurricular').value = 7;
        document.getElementById('ug_category').value = 'General';
        updateStars(7);
    }
    
    updateExamRange();
    updateRangeFill('entrance', document.getElementById('ug_entrance').value);
    updateRangeFill('board', document.getElementById('ug_board').value);
    document.getElementById('entrance_value').textContent = document.getElementById('ug_entrance').value;
    document.getElementById('board_value').textContent = document.getElementById('ug_board').value + '%';
    
    updateStreamOptions();
    
    setTimeout(() => {
        const streamSelect = document.getElementById('ug_stream');
        if (type === 'neet') {
            streamSelect.value = 'MBBS';
        } else if (type === 'jee') {
            streamSelect.value = 'Computer Science Engineering';
        } else if (type === 'met') {
            streamSelect.value = 'Computer Science Engineering';
        }
    }, 100);
}

// Fill PG example
function fillPGExample(type) {
    switchMode('pg');
    
    if (type === 'strong') {
        document.getElementById('pg_gre').value = 330;
        document.getElementById('pg_toefl').value = 115;
        document.getElementById('pg_uni_rating').value = 5;
        document.getElementById('pg_cgpa').value = 9.2;
        document.getElementById('pg_sop').value = 4.5;
        document.getElementById('pg_lor').value = 4.5;
        document.getElementById('pg_research').checked = true;
    }
}

// Show loading state
function showLoading() {
    document.getElementById('result-placeholder').classList.add('hidden');
    document.getElementById('result-content').classList.remove('hidden');
    
    document.getElementById('result-header').innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Analyzing your profile...</div>
    `;
}

// Show error message
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Reset form
function resetForm() {
    document.getElementById('result-content').classList.add('hidden');
    document.getElementById('result-placeholder').classList.remove('hidden');
    
    const activeMode = document.querySelector('.mode-btn.active').textContent.includes('UG') ? 'ug' : 'pg';
    
    if (activeMode === 'ug') {
        document.getElementById('ug_exam_type').selectedIndex = 0;
        document.getElementById('ug_entrance').value = '';
        document.getElementById('ug_board').value = '';
        document.getElementById('ug_extracurricular').value = 5;
        document.getElementById('ug_category').selectedIndex = 0;
        
        updateStreamOptions();
        
        updateRangeFill('entrance', 0);
        updateRangeFill('board', 0);
        updateStars(5);
        document.getElementById('entrance_value').textContent = '0';
        document.getElementById('board_value').textContent = '0%';
        document.getElementById('extracurricular_value').textContent = '5.0';
    } else {
        document.getElementById('pg_gre').value = '';
        document.getElementById('pg_toefl').value = '';
        document.getElementById('pg_uni_rating').value = '';
        document.getElementById('pg_cgpa').value = '';
        document.getElementById('pg_sop').value = '';
        document.getElementById('pg_lor').value = '';
        document.getElementById('pg_research').checked = false;
    }
}

// Format label
function formatLabel(key) {
    return key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Make functions globally available
window.switchMode = switchMode;
window.updateExamRange = updateExamRange;
window.updateStreamOptions = updateStreamOptions;
window.predictUG = predictUG;
window.predictPG = predictPG;
window.fillUGExample = fillUGExample;
window.fillPGExample = fillPGExample;
window.resetForm = resetForm;