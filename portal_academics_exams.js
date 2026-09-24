// portal_academics_exams.js

var editingClassIndex = -1, confirmDeleteClassIndex = -1;
var editingSubjectIndex = -1, confirmDeleteSubjectIndex = -1;

function renderManageAcademic(container) {
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 fade-in h-full flex flex-col md:grid">
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Manage Classes</h3>
                <div class="flex gap-2 mb-4 shrink-0">
                    <input type="text" id="new-class-input" placeholder="e.g. Class 1" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-w-0">
                    <button onclick="handleAddClass()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm shrink-0">Add</button>
                </div>
                <ul id="classes-list" class="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]"></ul>
            </div>

            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Manage Subjects</h3>
                <div class="flex gap-2 mb-4 shrink-0">
                    <input type="text" id="new-subject-input" placeholder="e.g. Accountancy" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm min-w-0">
                    <button onclick="handleAddSubject()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm shrink-0">Add</button>
                </div>
                <ul id="subjects-list" class="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]"></ul>
            </div>
        </div>
    `;
    updateAcademicLists();
}

function updateAcademicLists() {
    const classList = document.getElementById('classes-list');
    const subjectList = document.getElementById('subjects-list');
    if(!classList || !subjectList) return;

    classList.innerHTML = state.classes.map((c, index) => {
        if(editingClassIndex === index) {
            return `
            <li class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-blue-50 p-2 rounded-lg border border-blue-200 gap-2">
                <input type="text" id="edit-class-input-${index}" value="${c}" class="flex-1 px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white min-w-0">
                <div class="flex gap-1 justify-end shrink-0">
                    <button onclick="saveEditClass(${index}, '${c.replace(/'/g, "\\'")}')" class="text-green-600 hover:bg-green-100 p-2 rounded bg-white shadow-sm" title="Save"><i class="fas fa-check"></i></button>
                    <button onclick="cancelEditClass()" class="text-gray-500 hover:bg-gray-200 p-2 rounded bg-white shadow-sm" title="Cancel"><i class="fas fa-times"></i></button>
                </div>
            </li>`;
        }
        if(confirmDeleteClassIndex === index) {
            return `
            <li class="flex flex-col sm:flex-row justify-between items-center bg-red-50 p-3 rounded-lg border border-red-200 gap-2 text-sm">
                <span class="font-medium text-red-700 w-full sm:w-auto text-center sm:text-left truncate">Delete ${c}?</span>
                <div class="flex gap-2 w-full sm:w-auto justify-center">
                    <button onclick="executeDeleteClass(${index}, '${c.replace(/'/g, "\\'")}')" class="bg-red-600 text-white px-3 py-1 rounded">Yes</button>
                    <button onclick="cancelDeleteClass()" class="bg-gray-300 text-gray-800 px-3 py-1 rounded">No</button>
                </div>
            </li>`;
        }
        return `
        <li class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-100 group">
            <span class="text-sm font-medium text-gray-700 truncate mr-2">${c}</span>
            <div class="flex gap-2 shrink-0">
                <button onclick="startEditClass(${index})" class="text-blue-500 hover:text-blue-700 p-1"><i class="fas fa-edit"></i></button>
                <button onclick="startDeleteClass(${index})" class="text-red-400 hover:text-red-600 p-1"><i class="fas fa-trash"></i></button>
            </div>
        </li>`;
    }).join('');

    subjectList.innerHTML = state.subjects.map((s, index) => {
         if(editingSubjectIndex === index) {
            return `
            <li class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-green-50 p-2 rounded-lg border border-green-200 gap-2">
                <input type="text" id="edit-subject-input-${index}" value="${s}" class="flex-1 px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white min-w-0">
                <div class="flex gap-1 justify-end shrink-0">
                    <button onclick="saveEditSubject(${index}, '${s.replace(/'/g, "\\'")}')" class="text-green-600 hover:bg-green-100 p-2 rounded bg-white shadow-sm" title="Save"><i class="fas fa-check"></i></button>
                    <button onclick="cancelEditSubject()" class="text-gray-500 hover:bg-gray-200 p-2 rounded bg-white shadow-sm" title="Cancel"><i class="fas fa-times"></i></button>
                </div>
            </li>`;
        }
        if(confirmDeleteSubjectIndex === index) {
            return `
            <li class="flex flex-col sm:flex-row justify-between items-center bg-red-50 p-3 rounded-lg border border-red-200 gap-2 text-sm">
                <span class="font-medium text-red-700 w-full sm:w-auto text-center sm:text-left truncate">Delete?</span>
                <div class="flex gap-2 w-full sm:w-auto justify-center">
                    <button onclick="executeDeleteSubject(${index}, '${s.replace(/'/g, "\\'")}')" class="bg-red-600 text-white px-3 py-1 rounded">Yes</button>
                    <button onclick="cancelDeleteSubject()" class="bg-gray-300 text-gray-800 px-3 py-1 rounded">No</button>
                </div>
            </li>`;
        }
        return `
        <li class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-100 group">
            <span class="text-sm font-medium text-gray-700 truncate mr-2">${s}</span>
            <div class="flex gap-2 shrink-0">
                <button onclick="startEditSubject(${index})" class="text-green-500 hover:text-green-700 p-1"><i class="fas fa-edit"></i></button>
                <button onclick="startDeleteSubject(${index})" class="text-red-400 hover:text-red-600 p-1"><i class="fas fa-trash"></i></button>
            </div>
        </li>`;
    }).join('');
}

function handleAddClass() {
    const val = document.getElementById('new-class-input').value.trim();
    if(!val) return;
    if(state.classes.includes(val)) { showToast("Exists", "error"); return; }
    state.classes.push(val); document.getElementById('new-class-input').value = '';
    updateAcademicLists(); showToast("Added", "success");
}
function startEditClass(i) { editingClassIndex = i; confirmDeleteClassIndex = -1; updateAcademicLists(); }
function cancelEditClass() { editingClassIndex = -1; updateAcademicLists(); }
function saveEditClass(i, old) {
    const val = document.getElementById(`edit-class-input-${i}`).value.trim();
    if(val && val !== old && !state.classes.includes(val)) {
        state.classes[i] = val;
        state.students.forEach(s => { if(s.className===old) s.className=val; });
        state.teachers.forEach(t => {
            t.assignments.forEach(a => { if(a.className===old) a.className=val; });
            if(t.classTeacherOf) {
                const idx = t.classTeacherOf.indexOf(old);
                if(idx > -1) t.classTeacherOf[idx] = val;
            }
        });
    }
    cancelEditClass();
}
function startDeleteClass(i) { confirmDeleteClassIndex = i; editingClassIndex = -1; updateAcademicLists(); }
function cancelDeleteClass() { confirmDeleteClassIndex = -1; updateAcademicLists(); }
function executeDeleteClass(i) { 
    const deletedClass = state.classes[i];
    state.classes.splice(i, 1); 
    state.teachers.forEach(t => { 
        t.assignments = t.assignments.filter(a => a.className !== deletedClass); 
        if(t.classTeacherOf) t.classTeacherOf = t.classTeacherOf.filter(c => c !== deletedClass);
    });
    cancelDeleteClass(); 
}

function handleAddSubject() {
    const val = document.getElementById('new-subject-input').value.trim();
    if(val && !state.subjects.includes(val)) {
        state.subjects.push(val); document.getElementById('new-subject-input').value = '';
        updateAcademicLists();
    }
}
function startEditSubject(i) { editingSubjectIndex = i; confirmDeleteSubjectIndex = -1; updateAcademicLists(); }
function cancelEditSubject() { editingSubjectIndex = -1; updateAcademicLists(); }
function saveEditSubject(i, old) {
    const val = document.getElementById(`edit-subject-input-${i}`).value.trim();
    if(val && val !== old && !state.subjects.includes(val)) { state.subjects[i] = val; }
    cancelEditSubject();
}
function startDeleteSubject(i) { confirmDeleteSubjectIndex = i; editingSubjectIndex = -1; updateAcademicLists(); }
function cancelDeleteSubject() { confirmDeleteSubjectIndex = -1; updateAcademicLists(); }
function executeDeleteSubject(i) { state.subjects.splice(i, 1); cancelDeleteSubject(); }

function renderSubjectManagement(container) {
    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="flex overflow-x-auto border-b bg-gray-50 hide-scrollbar rounded-t-xl shrink-0 no-print">
                <button onclick="switchSubMgtTab('lower')" id="sub-tab-lower" class="sub-mgt-tab px-6 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap transition-colors">Basic Level (1-8)</button>
                <button onclick="switchSubMgtTab('higher')" id="sub-tab-higher" class="sub-mgt-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Secondary Level (9-12)</button>
                <button onclick="switchSubMgtTab('credit-hour')" id="sub-tab-credit-hour" class="sub-mgt-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Credit Hour Mgmt</button>
            </div>
            <div id="sub-mgt-content" class="flex-1 min-w-0 bg-white border border-gray-100 rounded-b-xl p-4 sm:p-6 shadow-sm overflow-y-auto">
            </div>
        </div>
    `;
    switchSubMgtTab('lower');
}

function switchSubMgtTab(level) {
    document.querySelectorAll('.sub-mgt-tab').forEach(el => {
        el.classList.remove('text-blue-600', 'border-blue-600', 'font-semibold');
        el.classList.add('text-gray-500', 'border-transparent', 'font-medium');
    });
    const activeTab = document.getElementById(`sub-tab-${level}`);
    if(activeTab) {
        activeTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        activeTab.classList.add('text-blue-600', 'border-blue-600', 'font-semibold');
    }
    const container = document.getElementById('sub-mgt-content');
    if(level === 'lower') renderSubMgtLower(container);
    else if(level === 'higher') renderSubMgtHigher(container);
    else if(level === 'credit-hour') renderCreditHourMgmt(container);
}

const isClassHigher = (c) => { const m = c.match(/\d+/); return m ? parseInt(m[0]) >= 9 : false; }
const isClassLower = (c) => !isClassHigher(c);

function renderSubMgtLower(container) {
    let classOptions = state.classes.filter(isClassLower).map(c => `<option value="${c}">${c}</option>`).join('');
    container.innerHTML = `
        <div class="fade-in max-w-4xl mx-auto flex flex-col h-full">
            <div class="mb-4 sm:mb-6 no-print shrink-0 w-full">
                <select id="exam-sub-class-lower" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" onchange="loadExamSubjectsLower()">
                    <option value="">Select Class (1-8)</option>
                    ${classOptions}
                </select>
            </div>
            <div id="exam-sub-container-lower" class="flex-1 min-h-0 relative">
                <p class="text-gray-500 text-center py-8">Select a class to configure subjects.</p>
            </div>
        </div>
    `;
}

function loadExamSubjectsLower() {
    const cls = document.getElementById('exam-sub-class-lower').value;
    const container = document.getElementById('exam-sub-container-lower');
    if(!cls) { container.innerHTML = ''; return; }

    if (!state.examSettings.classSubjects) state.examSettings.classSubjects = {};
    const selected = state.examSettings.classSubjects[cls] || [];
    
    let trs = state.subjects.map(s => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 w-16 text-center">
                <input type="checkbox" class="exam-sub-checkbox w-4 h-4 text-blue-600 rounded" value="${s}" ${selected.includes(s) ? 'checked' : ''}>
            </td>
            <td class="px-4 py-3 font-medium text-gray-700 text-sm">${s}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="bg-white border rounded-lg shadow-sm overflow-hidden mb-4 h-auto max-h-full flex flex-col">
            <div class="overflow-y-auto flex-1 custom-scrollbar">
                <table class="w-full text-left">
                    <thead class="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0">
                        <tr><th class="px-4 py-3 text-center">Select</th><th class="px-4 py-3">Subject</th></tr>
                    </thead>
                    <tbody>${trs}</tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-end mt-4 shrink-0">
            <button onclick="saveExamSubjects('${cls}')" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium">Save</button>
        </div>
    `;
}

function saveExamSubjects(cls) {
    const cbs = document.querySelectorAll('.exam-sub-checkbox:checked');
    if(!state.examSettings.classSubjects) state.examSettings.classSubjects = {};
    state.examSettings.classSubjects[cls] = Array.from(cbs).map(cb => cb.value);
    showToast("Saved", "success");
}

function renderSubMgtHigher(container) {
    let classOptions = state.classes.filter(isClassHigher).map(c => `<option value="${c}">${c}</option>`).join('');
    container.innerHTML = `
        <div class="fade-in max-w-4xl mx-auto flex flex-col h-full">
            <div class="mb-4 sm:mb-6 no-print shrink-0 w-full">
                <select id="exam-sub-class-higher" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" onchange="loadExamSubjectsHigher()">
                    <option value="">Select Class (9-12)</option>
                    ${classOptions}
                </select>
            </div>
            <div id="exam-sub-container-higher" class="flex-1 min-h-0 relative flex flex-col">
                <p class="text-gray-500 text-center py-8">Select a class to configure optional subjects.</p>
            </div>
        </div>
    `;
}

function loadExamSubjectsHigher() {
    const cls = document.getElementById('exam-sub-class-higher').value;
    const container = document.getElementById('exam-sub-container-higher');
    if(!cls) return;

    const students = state.students.filter(s => s.className === cls);
    if(students.length===0) { container.innerHTML = 'No students found.'; return; }

    let checkedCompulsory = (state.examSettings.compulsorySubjects && state.examSettings.compulsorySubjects[cls]) || [];
    
    let bulkHtml = `
        <div class="mb-4 p-3 border rounded-lg bg-gray-50 shrink-0">
            <h4 class="font-bold text-sm mb-2 text-gray-700">Bulk Assign Compulsory</h4>
            <div class="flex flex-wrap gap-2 mb-3">
                ${state.subjects.map(s => `
                    <label class="inline-flex items-center bg-white px-2 py-1 rounded border text-xs cursor-pointer shadow-sm">
                        <input type="checkbox" class="bulk-sub-cb form-checkbox h-3 w-3 text-blue-600 rounded mr-1" value="${s}" ${checkedCompulsory.includes(s)?'checked':''}>${s}
                    </label>`).join('')}
            </div>
            <button onclick="bulkAssignSubjects('${cls}')" class="bg-blue-800 text-white px-3 py-1.5 rounded text-xs">Apply to All</button>
        </div>
    `;

    let listHtml = students.map(s => {
        const assigned = (state.examSettings.studentSubjects && state.examSettings.studentSubjects[s.id]) || [];
        return `
        <div class="border rounded-lg p-3 bg-white mb-2 student-row shadow-sm" data-student-id="${s.id}">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-2 mb-2 gap-2">
                <span class="text-sm font-bold text-gray-800">${s.name} <span class="text-xs text-gray-500 font-normal">(${s.id})</span></span>
                <button onclick="saveStudentSubjects('${s.id}')" class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded w-full sm:w-auto">Save</button>
            </div>
            <div class="flex flex-wrap gap-2">
                ${state.subjects.map(sub => `
                    <label class="inline-flex items-center text-xs bg-gray-50 border rounded px-1.5 py-0.5">
                        <input type="checkbox" class="h-3 w-3 mr-1 student-sub-cb-${s.id}" value="${sub}" ${assigned.includes(sub)?'checked':''}>${sub}
                    </label>
                `).join('')}
            </div>
        </div>`;
    }).join('');

    container.innerHTML = `
        ${bulkHtml}
        <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
            ${listHtml}
        </div>
        <div class="mt-3 shrink-0">
             <button onclick="saveAllStudentSubjects('${cls}')" class="w-full bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">Save All Students</button>
        </div>
    `;
}

function bulkAssignSubjects(cls) {
    const selected = Array.from(document.querySelectorAll('.bulk-sub-cb:checked')).map(cb => cb.value);
    if (!state.examSettings.compulsorySubjects) state.examSettings.compulsorySubjects = {};
    state.examSettings.compulsorySubjects[cls] = selected;
    
    if (!state.examSettings.studentSubjects) state.examSettings.studentSubjects = {};
    state.students.filter(s => s.className === cls).forEach(s => {
        const row = document.querySelector(`.student-row[data-student-id="${s.id}"]`);
        if(row) {
            row.querySelectorAll(`input[type="checkbox"]`).forEach(cb => { if(selected.includes(cb.value)) cb.checked = true; });
        }
        const existing = state.examSettings.studentSubjects[s.id] || [];
        state.examSettings.studentSubjects[s.id] = Array.from(new Set([...existing, ...selected]));
    });
    showToast("Bulk applied");
}

function saveStudentSubjects(id) {
    if(!state.examSettings.studentSubjects) state.examSettings.studentSubjects = {};
    state.examSettings.studentSubjects[id] = Array.from(document.querySelectorAll(`.student-sub-cb-${id}:checked`)).map(cb=>cb.value);
    showToast("Saved");
}

function saveAllStudentSubjects(cls) {
    state.students.filter(s => s.className === cls).forEach(s => saveStudentSubjects(s.id));
}

function getSubjectsForClass(cls) {
    if(isClassHigher(cls)) {
        let all = new Set();
        state.students.filter(s=>s.className===cls).forEach(s => {
            ((state.examSettings.studentSubjects||{})[s.id]||[]).forEach(sub=>all.add(sub));
        });
        return Array.from(all);
    }
    return (state.examSettings.classSubjects||{})[cls] || [];
}

function renderCreditHourMgmt(container) {
    const levels = ['Class 1-3', 'Class 4-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];
    let options = levels.map(l => `<option value="${l}">${l}</option>`).join('');
    
    container.innerHTML = `
        <div class="fade-in max-w-4xl mx-auto flex flex-col h-full">
            <div class="mb-4 sm:mb-6 no-print shrink-0 w-full">
                <select id="credit-hour-level" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" onchange="loadCreditHours()">
                    <option value="">Select Class Level Group</option>
                    ${options}
                </select>
            </div>
            <div id="credit-hour-container" class="flex-1 min-h-0 relative flex flex-col">
                <p class="text-gray-500 text-center py-8">Select a level to configure credit hours.</p>
            </div>
        </div>
    `;
}

function loadCreditHours() {
    const level = document.getElementById('credit-hour-level').value;
    const container = document.getElementById('credit-hour-container');
    if(!level) { container.innerHTML = '<p class="text-gray-500 text-center py-8">Select a level to configure credit hours.</p>'; return; }

    const levelMap = {
        'Class 1-3': [1, 2, 3],
        'Class 4-5': [4, 5],
        'Class 6-8': [6, 7, 8],
        'Class 9-10': [9, 10],
        'Class 11-12': [11, 12]
    };
    
    const targetNums = levelMap[level];
    let levelClasses = state.classes.filter(c => {
        const m = c.match(/\d+/);
        return m && targetNums.includes(parseInt(m[0]));
    });

    let allSubjectsSet = new Set();
    levelClasses.forEach(c => {
        let subs = getSubjectsForClass(c);
        subs.forEach(s => allSubjectsSet.add(s));
    });
    
    let subjects = Array.from(allSubjectsSet);
    
    if(subjects.length === 0) {
        container.innerHTML = `<div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm"><i class="fas fa-info-circle mr-2"></i> No subjects are currently assigned to any classes in ${level}. Please assign subjects in the Basic or Secondary Level tabs first.</div>`;
        return;
    }

    if(!state.examSettings.creditHours) state.examSettings.creditHours = {};
    let existingData = state.examSettings.creditHours[level] || {};

    let trs = subjects.map(s => {
        let val = existingData[s] !== undefined ? existingData[s] : '';
        return `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-700 text-sm">${s}</td>
            <td class="px-4 py-3 w-40 text-center">
                <input type="number" step="0.5" min="0" class="credit-input w-24 px-2 py-1.5 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none" data-subject="${s.replace(/"/g, '&quot;')}" value="${val}" placeholder="e.g. 4">
            </td>
        </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-200 text-sm mb-4 shadow-sm">
            <i class="fas fa-clock mr-1"></i> Enter the Credit Hours (e.g., 4, 3, 1.5) for the subjects taught in ${level}.
        </div>
        <div class="bg-white border rounded-lg shadow-sm overflow-hidden mb-4 h-auto max-h-full flex flex-col">
            <div class="overflow-y-auto flex-1 custom-scrollbar">
                <table class="w-full text-left">
                    <thead class="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0">
                        <tr>
                            <th class="px-4 py-3">Subject Name</th>
                            <th class="px-4 py-3 text-center">Credit Hour</th>
                        </tr>
                    </thead>
                    <tbody>${trs}</tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-end mt-4 shrink-0">
            <button onclick="saveCreditHours('${level}')" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 justify-center transition-colors">
                <i class="fas fa-save"></i> Save Credit Hours
            </button>
        </div>
    `;
}

function saveCreditHours(level) {
    if(!state.examSettings.creditHours) state.examSettings.creditHours = {};
    state.examSettings.creditHours[level] = {};
    
    let savedCount = 0;
    document.querySelectorAll('.credit-input').forEach(inp => {
        const sub = inp.getAttribute('data-subject');
        const val = parseFloat(inp.value);
        if(!isNaN(val)) {
            state.examSettings.creditHours[level][sub] = val;
            savedCount++;
        }
    });
    showToast(`Credit hours successfully saved for ${savedCount} subjects in ${level}`, 'success');
}

function renderExamProcess(container) {
    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="flex overflow-x-auto border-b bg-gray-50 hide-scrollbar rounded-t-xl shrink-0 no-print">
                <button onclick="switchExamProcessTab('routine')" id="sub-tab-routine" class="exam-process-tab px-6 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap transition-colors">Exam Routine</button>
                <button onclick="switchExamProcessTab('term-mark-mgmt')" id="sub-tab-term-mark-mgmt" class="exam-process-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Terminal Mark Mgmt</button>
                <button onclick="switchExamProcessTab('symbol-no')" id="sub-tab-symbol-no" class="exam-process-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Symbol No Generate</button>
                <button onclick="switchExamProcessTab('admit-card')" id="sub-tab-admit-card" class="exam-process-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Admit Card</button>
                <button onclick="switchExamProcessTab('mark-slip')" id="sub-tab-mark-slip" class="exam-process-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Mark Slip</button>
            </div>
            <div id="exam-process-content" class="flex-1 min-w-0 bg-white border border-gray-100 rounded-b-xl p-4 sm:p-6 shadow-sm overflow-y-auto">
            </div>
        </div>
    `;
    switchExamProcessTab('routine');
}

function switchExamProcessTab(tabId) {
    document.querySelectorAll('.exam-process-tab').forEach(el => {
        el.classList.remove('text-blue-600', 'border-blue-600', 'font-semibold');
        el.classList.add('text-gray-500', 'border-transparent', 'font-medium');
    });
    const activeTab = document.getElementById(`sub-tab-${tabId}`);
    if(activeTab) {
        activeTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        activeTab.classList.add('text-blue-600', 'border-blue-600', 'font-semibold');
    }
    
    const container = document.getElementById('exam-process-content');
    container.innerHTML = '<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-blue-500 text-3xl"></i></div>';

    setTimeout(() => {
        if(tabId === 'routine') renderExamRoutine(container);
        else if(tabId === 'term-mark-mgmt') renderTermMarkMgmt(container);
        else if(tabId === 'symbol-no') renderSymbolNo(container);
        else if(tabId === 'admit-card') renderAdmitCard(container);
        else if(tabId === 'mark-slip') renderMarkSlip(container);
    }, 50);
}

// Exam Routine Matrix
function renderExamRoutine(container) {
    if (!state.examSettings) state.examSettings = {};
    if (!state.examSettings.routines || typeof state.examSettings.routines !== 'object') state.examSettings.routines = {};
    if (!Array.isArray(state.examSettings.routineDates) || state.examSettings.routineDates.length === 0) {
        state.examSettings.routineDates = [''];
    }

    const dates = state.examSettings.routineDates;
    const classes = Array.isArray(state.classes) ? state.classes : [];

    if (dates.length === 1 && !dates[0]) {
        const discovered = [];
        Object.values(state.examSettings.routines || {}).forEach(rows => {
            (Array.isArray(rows) ? rows : []).forEach(r => {
                if (r && r.date && !discovered.includes(r.date)) discovered.push(r.date);
            });
        });
        if (discovered.length) {
            state.examSettings.routineDates = discovered;
        }
    }

    const activeDates = state.examSettings.routineDates;
    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const normalizeDate = (value) => {
        const v = String(value || '');
        return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '';
    };

    const rows = classes.map((cls, classIndex) => {
        const routine = (state.examSettings.routines && state.examSettings.routines[cls]) || [];
        const cells = activeDates.map((date, dateIndex) => {
            const saved = routine.find(r => r && r.date === date);
            const selected = saved ? saved.subject : '';
            const subjects = getSubjectsForClass(cls);
            const options = ['<option value="">— Select Subject —</option>']
                .concat(subjects.map(sub => `<option value="${escapeHtml(sub)}" ${sub === selected ? 'selected' : ''}>${escapeHtml(sub)}</option>`))
                .join('');
            return `
                <td class="border border-gray-200 p-1.5 min-w-[180px] align-middle bg-white">
                    <select class="routine-subject w-full px-2 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" data-class="${escapeHtml(cls)}" data-date-index="${dateIndex}">
                        ${options}
                    </select>
                </td>`;
        }).join('');
        return `
            <tr>
                <th class="border border-gray-200 bg-gray-50 px-3 py-3 text-left font-semibold text-gray-700 whitespace-nowrap sticky left-0 z-10">${escapeHtml(cls)}</th>
                ${cells}
            </tr>`;
    }).join('');

    const headerDates = activeDates.map((date, i) => `
        <th class="border border-gray-200 bg-gray-50 p-2 min-w-[180px] align-top">
            <div class="flex items-center gap-1">
                <input type="date" class="routine-date w-full px-2 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 bg-white" data-date-index="${i}" value="${normalizeDate(date)}">
                <button type="button" onclick="removeRoutineDate(${i})" class="shrink-0 w-8 h-8 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700" title="Remove date">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </th>`).join('');

    container.innerHTML = `
        <div class="fade-in flex flex-col h-full min-h-0">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 no-print">
                <div>
                    <h3 class="text-lg font-bold text-gray-800">Exam Routine</h3>
                    <p class="text-xs text-gray-500 mt-1">First column: Class &nbsp;•&nbsp; First row: Date &nbsp;•&nbsp; Select the relevant subject in each cell.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button type="button" onclick="addRoutineDate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                        <i class="fas fa-calendar-plus"></i> Add Date
                    </button>
                    <button type="button" onclick="saveExamRoutineMatrix()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                        <i class="fas fa-save"></i> Save Routine
                    </button>
                    <button type="button" onclick="window.print()" class="bg-gray-800 hover:bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>

            <div class="flex-1 min-h-0 overflow-auto border border-gray-200 rounded-lg bg-white custom-scrollbar">
                <table class="w-full border-collapse text-sm min-w-max">
                    <thead class="sticky top-0 z-20">
                        <tr>
                            <th class="border border-gray-200 bg-blue-50 px-4 py-3 text-left font-bold text-blue-800 sticky left-0 top-0 z-30 min-w-[130px]">Class</th>
                            ${headerDates}
                        </tr>
                    </thead>
                    <tbody>${rows || `<tr><td colspan="${activeDates.length + 1}" class="text-center py-8 text-gray-500">No classes configured.</td></tr>`}</tbody>
                </table>
            </div>
        </div>
    `;
}

function addRoutineDate() {
    if (!state.examSettings) state.examSettings = {};
    if (!Array.isArray(state.examSettings.routineDates)) state.examSettings.routineDates = [];
    state.examSettings.routineDates.push('');
    renderExamRoutine(document.getElementById('exam-process-content'));
}

function removeRoutineDate(index) {
    if (!state.examSettings || !Array.isArray(state.examSettings.routineDates)) return;
    if (state.examSettings.routineDates.length <= 1) {
        state.examSettings.routineDates = [''];
    } else {
        state.examSettings.routineDates.splice(index, 1);
    }
    renderExamRoutine(document.getElementById('exam-process-content'));
}

function saveExamRoutineMatrix() {
    const dateInputs = Array.from(document.querySelectorAll('.routine-date'));
    const dates = dateInputs.map(input => input.value.trim());

    if (dates.some(d => !d)) {
        showToast('Please enter/select a date in every date column.', 'error');
        return;
    }
    const duplicateDates = dates.filter((d, i) => dates.indexOf(d) !== i);
    if (duplicateDates.length) {
        showToast('Each routine date must be unique.', 'error');
        return;
    }

    const duplicateCheck = new Set();
    const newRoutines = {};
    const selects = Array.from(document.querySelectorAll('.routine-subject'));

    selects.forEach(select => {
        const cls = select.getAttribute('data-class');
        const dateIndex = Number(select.getAttribute('data-date-index'));
        const subject = select.value;
        if (!cls || !dates[dateIndex] || !subject) return;
        if (!newRoutines[cls]) newRoutines[cls] = [];
        const key = `${cls}__${dates[dateIndex]}`;
        if (!duplicateCheck.has(key)) {
            newRoutines[cls].push({ subject, date: dates[dateIndex] });
            duplicateCheck.add(key);
        }
    });

    state.examSettings.routineDates = dates;
    state.examSettings.routines = {};
    (state.classes || []).forEach(cls => {
        state.examSettings.routines[cls] = newRoutines[cls] || [];
    });
    saveState(true);
    showToast('Exam routine saved successfully.', 'success');
    renderExamRoutine(document.getElementById('exam-process-content'));
}

function renderSymbolNo(container) {
    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    container.innerHTML = `
        <div class="fade-in max-w-5xl mx-auto flex flex-col h-full">
            <div class="bg-gray-50 p-3 sm:p-4 rounded-lg border mb-4 no-print shrink-0">
                <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
                    <select id="sym-class-select" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto" onchange="loadSymbolList()">
                        <option value="">Select Class</option>
                        ${classOptions}
                    </select>
                    
                    <button onclick="generateSymbolNos()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                        <i class="fas fa-magic"></i> Auto Generate Symbol Nos
                    </button>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded border text-sm text-gray-700">
                    <div class="text-blue-600 font-medium text-xs sm:text-sm">
                        <i class="fas fa-info-circle mr-1"></i> Enter the symbol number for the first checked student below, then click Auto Generate.
                    </div>
                    <label class="flex items-center gap-2 cursor-pointer sm:ml-auto w-full sm:w-auto justify-start sm:justify-end">
                        <input type="checkbox" id="sym-append-alpha" class="w-4 h-4 text-blue-600 rounded">
                        <span class="font-medium">Append Alphabet (A-Z)</span>
                    </label>
                </div>
            </div>
            
            <div id="sym-list-container" class="flex-1 min-h-0 flex flex-col">
                <p class="text-gray-500 text-center py-8">Select a class to view/generate symbol numbers.</p>
            </div>
        </div>
    `;
}

function loadSymbolList() {
    const cls = document.getElementById('sym-class-select').value;
    const container = document.getElementById('sym-list-container');
    if(!cls) { container.innerHTML = ''; return; }

    const clsStudents = state.students.filter(s => s.className === cls);
    if(clsStudents.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No students found in this class.</p>';
        return;
    }

    let trs = clsStudents.map((s, i) => `
        <tr class="border-b hover:bg-gray-50 bg-white">
            <td class="px-3 py-3 text-center">
                <input type="checkbox" class="sym-student-cb w-4 h-4 text-blue-600 rounded cursor-pointer" value="${s.id}" checked>
            </td>
            <td class="px-3 py-3 text-gray-500 text-center">${i+1}</td>
            <td class="px-3 py-3 font-medium text-gray-800 truncate max-w-[150px]">${s.name}</td>
            <td class="px-3 py-3 text-sm text-gray-500 text-center">${s.id}</td>
            <td class="px-3 py-3 text-center">
                <input type="text" id="sym-input-${s.id}" value="${s.symbolNo || ''}" placeholder="e.g. 8101001" class="w-28 sm:w-32 px-2 py-1.5 border border-blue-200 rounded text-blue-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/50 text-center uppercase text-sm">
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="bg-white border rounded-lg shadow-sm flex-1 flex flex-col min-h-0 mb-4">
            <div class="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 relative">
                <table class="w-full text-sm text-left whitespace-nowrap min-w-max">
                    <thead class="bg-gray-100 text-gray-700 font-semibold sticky top-0 shadow-sm z-10">
                        <tr>
                            <th class="px-3 py-3 w-12 text-center">
                                <input type="checkbox" id="sym-select-all" class="w-4 h-4 text-blue-600 rounded cursor-pointer" checked onchange="toggleAllSymbolCheckboxes(this)">
                            </th>
                            <th class="px-3 py-3 w-16 text-center">S.N.</th>
                            <th class="px-3 py-3">Student Name</th>
                            <th class="px-3 py-3 text-center">System ID</th>
                            <th class="px-3 py-3 text-center">Symbol Number</th>
                        </tr>
                    </thead>
                    <tbody>${trs}</tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-end shrink-0">
            <button onclick="saveSymbolNos('${cls}')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `;
}

function toggleAllSymbolCheckboxes(masterCheckbox) {
    const checkboxes = document.querySelectorAll('.sym-student-cb');
    checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
}

function generateSymbolNos() {
    const cls = document.getElementById('sym-class-select').value;
    if(!cls) { showToast('Please select a class first', 'error'); return; }
    
    const appendAlpha = document.getElementById('sym-append-alpha').checked;
    const checkboxes = document.querySelectorAll('.sym-student-cb');
    
    let startIndex = -1;
    let baseNumStr = "";
    
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const studentId = checkboxes[i].value;
            const inputEl = document.getElementById(`sym-input-${studentId}`);
            if (inputEl && inputEl.value.trim() !== "") {
                const val = inputEl.value.trim();
                const numericMatch = val.match(/^(\d+)/);
                if (numericMatch) {
                    baseNumStr = numericMatch[1];
                    startIndex = i;
                    break;
                }
            }
        }
    }

    if (startIndex === -1) {
        showToast('Please type a starting symbol number in the first checked student row.', 'error');
        return;
    }
    
    let count = 0;
    let currentNum = parseInt(baseNumStr, 10);
    const numLength = baseNumStr.length;
    
    checkboxes.forEach((cb, index) => {
        if (cb.checked) {
            if (index >= startIndex) {
                const studentId = cb.value;
                const inputEl = document.getElementById(`sym-input-${studentId}`);
                if (inputEl) {
                    let numStr = currentNum.toString().padStart(numLength, '0');
                    let newSym = numStr;
                    if (appendAlpha) {
                        let remainder = currentNum % 26;
                        if (remainder === 0) remainder = 26;
                        const alphabet = String.fromCharCode(64 + remainder); 
                        newSym += alphabet;
                    }
                    inputEl.value = newSym;
                    currentNum++;
                    count++;
                }
            }
        } else {
             const studentId = cb.value;
             const inputEl = document.getElementById(`sym-input-${studentId}`);
             if (inputEl && !inputEl.value) {
                 inputEl.value = '';
             }
        }
    });

    if (count > 0) {
        showToast(`Generated symbol numbers for ${count} students. Click 'Save' to apply.`, 'info');
    } else {
        showToast('No students selected for generation.', 'error');
    }
}

function saveSymbolNos(cls) {
    const clsStudents = state.students.filter(s => s.className === cls);
    let savedCount = 0;
    clsStudents.forEach(s => {
        const inputEl = document.getElementById(`sym-input-${s.id}`);
        if(inputEl) {
            const newVal = inputEl.value.trim();
            if(s.symbolNo !== newVal) {
                s.symbolNo = newVal;
                savedCount++;
            }
        }
    });
    showToast(`Successfully saved changes for ${savedCount} students.`, 'success');
}

function renderAdmitCard(container) {
    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    let termOptions = state.terms.map(t => `<option value="${t}">${t}</option>`).join('');
    let currentYear = state.examSettings.academicYear || new Date().getFullYear() + 56;
    
    container.innerHTML = `
        <div class="fade-in mx-auto w-full max-w-[21cm]">
            <div class="flex flex-col sm:flex-row gap-4 mb-6 no-print bg-gray-50 p-4 rounded-lg border items-start sm:items-center justify-between">
                <div class="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
                    <select id="admit-term-select" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px] flex-1 sm:flex-none">
                        <option value="">Select Term</option>
                        ${termOptions}
                    </select>
                    <select id="admit-class-select" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px] flex-1 sm:flex-none" onchange="loadAdmitCards()">
                        <option value="">Select Class</option>
                        ${classOptions}
                    </select>
                    <input type="text" id="admit-year-input" value="${currentYear}" placeholder="Year (BS)" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-24 bg-gray-100" readonly>
                </div>
                <button onclick="window.print()" class="w-full sm:w-auto bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                    <i class="fas fa-print"></i> Print Cards (A4)
                </button>
            </div>
            
            <div id="admit-card-container" class="no-print">
                <p class="text-gray-500 text-center py-8 col-span-2">Select Term and Class to view admit cards.</p>
            </div>

            <div id="admit-card-print-container" class="hidden print:block admit-grid-print bg-white print-section">
            </div>
        </div>
    `;
}

function loadAdmitCards() {
    const cls = document.getElementById('admit-class-select').value;
    const term = document.getElementById('admit-term-select').value || 'Terminal';
    const year = document.getElementById('admit-year-input').value || '';
    const containerScreen = document.getElementById('admit-card-container');
    const containerPrint = document.getElementById('admit-card-print-container');
    
    if(!cls) { 
        containerScreen.innerHTML = ''; 
        containerPrint.innerHTML = '';
        return; 
    }

    const clsStudents = state.students.filter(s => s.className === cls);
    if(clsStudents.length === 0) {
        containerScreen.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-2">No students found in this class.</p>';
        containerPrint.innerHTML = '';
        return;
    }

    const isHigherClass = isClassHigher(cls);
    const classRoutine = (state.examSettings.routines && state.examSettings.routines[cls]) || [];

    let cardsHtml = clsStudents.map((s) => {
        let studentSubs = isHigherClass 
            ? ((state.examSettings.studentSubjects && state.examSettings.studentSubjects[s.id]) || [])
            : ((state.examSettings.classSubjects && state.examSettings.classSubjects[cls]) || []);
        
        let routineRows = studentSubs.map((sub) => {
            const rData = classRoutine.find(r => r.subject === sub);
            const dateStr = rData && rData.date ? rData.date : '---';
            return `
                <tr>
                    <td style="border: 1px solid #000; padding: 2px 4px;">${dateStr}</td>
                    <td style="border: 1px solid #000; padding: 2px 4px;">${sub}</td>
                </tr>
            `;
        });

        const half = Math.ceil(routineRows.length / 2);
        const col1Rows = routineRows.slice(0, half).join('');
        const col2Rows = routineRows.slice(half).join('');

        let symNoStr = s.symbolNo || 'N/A';
        let symNoText = '';
        let symAlpha = '';
        
        if (symNoStr !== 'N/A') {
            const numMatch = symNoStr.match(/\d+/);
            if (numMatch) {
                const num = parseInt(numMatch[0], 10);
                symNoText = numToWords(num);
            }
            const alphaMatch = symNoStr.match(/[a-zA-Z]+/);
            if (alphaMatch) {
                symAlpha = ' ' + alphaMatch[0].toUpperCase();
            }
        }

        let inWordsDisplay = symNoText ? `${symNoText}${symAlpha}` : '---';

        let examTitleStr = term;
        if(term && !term.toLowerCase().includes('examination')) {
            examTitleStr = `${term} Examination`;
        }
        if(year) examTitleStr += `-${year}`;
        
        const sName = state.examSettings.schoolName || 'Shree Rasuwa Secondary School';
        const sAddress = state.examSettings.schoolAddress || 'Gosaikunda RM-6, Dhunche, Rasuwa';
        const imgs = state.examSettings.images || {};
        const logoImg = imgs.logo ? `<img src="${imgs.logo}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;">` : `
            <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#000" stroke-width="2"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="2 2"/>
                <polygon points="50,15 85,75 15,75" fill="none" stroke="#000" stroke-width="1"/>
                <polygon points="50,85 85,25 15,25" fill="none" stroke="#000" stroke-width="1"/>
                <text x="50" y="55" font-size="20" text-anchor="middle" font-family="Arial" font-weight="bold">RSS</text>
            </svg>`;
        
        const coSignImg = imgs.coSign ? `<img src="${imgs.coSign}" style="position: absolute; bottom: 0; left: 10px; width: 100px; height: 40px; object-fit: contain;">` : `
            <svg viewBox="0 0 100 40" style="position: absolute; bottom: 0; left: 10px; width: 80px; height: 40px; opacity: 0.6;">
                <path d="M10,30 Q30,10 40,20 T60,10 T80,30" fill="none" stroke="#000" stroke-width="2"/>
            </svg>`;

        const htSignImg = imgs.htSign ? `<img src="${imgs.htSign}" style="position: absolute; bottom: 0; left: 10px; width: 100px; height: 40px; object-fit: contain;">` : `
            <svg viewBox="0 0 100 40" style="position: absolute; bottom: 0; left: 10px; width: 90px; height: 40px; opacity: 0.6;">
                <path d="M10,25 Q40,-5 50,15 T90,5" fill="none" stroke="#000" stroke-width="2"/>
            </svg>`;

        const innerCardHTML = `
            <div style="font-family: 'Times New Roman', Times, serif; color: #000; display: flex; flex-direction: column; height: 100%; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
                    <div style="width: 60px; height: 60px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                        ${logoImg}
                    </div>
                    
                    <div style="text-align: center; flex-grow: 1; padding: 0 10px;">
                        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 4px 0; line-height: 1.1;">${sName}</h2>
                        <p style="font-size: 12px; margin: 0 0 6px 0; font-weight: bold;">${sAddress}</p>
                        <h3 style="font-size: 14px; font-weight: bold; margin: 6px 0 0 0;">${examTitleStr}</h3>
                    </div>

                    <div style="width: 60px; flex-shrink: 0;"></div>
                </div>

                <div style="text-align: center; margin-bottom: 12px;">
                    <span style="background-color: #222; color: white; padding: 4px 14px; font-size: 14px; font-weight: bold; border-radius: 4px; display: inline-block;">Entrance Card</span>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px;">
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 4px 8px; width: 60px;">Name :</td>
                        <td style="border: 1px solid #ddd; padding: 4px 8px; font-weight: bold;">${s.name}</td>
                        <td style="border: 1px solid #ddd; padding: 4px 8px; width: 60px;">Class :</td>
                        <td style="border: 1px solid #ddd; padding: 4px 8px; font-weight: bold;">${s.className}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 4px 8px;">Sym. No.:</td>
                        <td style="border: 1px solid #ddd; padding: 4px 8px; font-weight: bold; font-size: 14px;" colspan="3">${s.symbolNo || ''}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 4px 8px;" colspan="4">
                            <div style="font-weight: bold; text-transform: capitalize; line-height: 1.4;">${inWordsDisplay}</div>
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; font-weight: bold; font-size: 14px; text-decoration: underline; margin-bottom: 8px;">Routine</div>

                <div style="display: flex; gap: 15px; font-size: 12px; margin-bottom: 20px;">
                    <table style="width: 50%; border-collapse: collapse;">
                        <tr>
                            <th style="border: 1px solid #000; padding: 3px 6px; text-align: left;">Date</th>
                            <th style="border: 1px solid #000; padding: 3px 6px; text-align: left;">Subject</th>
                        </tr>
                        ${col1Rows || '<tr><td colspan="2" style="border: 1px solid #000; text-align:center;">-</td></tr>'}
                    </table>
                    <table style="width: 50%; border-collapse: collapse;">
                        <tr>
                            <th style="border: 1px solid #000; padding: 3px 6px; text-align: left;">Date</th>
                            <th style="border: 1px solid #000; padding: 3px 6px; text-align: left;">Subject</th>
                        </tr>
                        ${col2Rows || '<tr><td colspan="2" style="border: 1px solid #000; text-align:center;">-</td></tr>'}
                    </table>
                </div>

                <div style="margin-top: auto; display: flex; justify-content: space-between; padding: 0 10px; font-size: 13px; font-weight: bold;">
                    <div style="text-align: center;">
                        <div style="width: 120px; height: 40px; position: relative; margin-bottom: 5px;">
                            ${coSignImg}
                        </div>
                        <div style="border-top: 1px solid #000; padding-top: 5px; width: 140px; margin: 0 auto;">Exam Co-ordinator</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="width: 120px; height: 40px; position: relative; margin-bottom: 5px;">
                             ${htSignImg}
                        </div>
                        <div style="border-top: 1px solid #000; padding-top: 5px; width: 140px; margin: 0 auto;">Head Teacher</div>
                    </div>
                </div>
            </div>
        `;

        const screenHTML = `<div class="admit-card-screen shadow-sm">${innerCardHTML}</div>`;
        const printHTML = `<div class="admit-card-print-box">${innerCardHTML}</div>`;
        return { screen: screenHTML, print: printHTML };
    });

    containerScreen.innerHTML = cardsHtml.map(c => c.screen).join('');
    containerPrint.innerHTML = cardsHtml.map(c => c.print).join('');
}

function renderMarkSlip(container) {
    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    let termOptions = state.terms.map(t => `<option value="${t}">${t}</option>`).join('');
    
    container.innerHTML = `
        <div class="fade-in max-w-full flex flex-col h-full">
            <div class="flex flex-wrap gap-3 mb-4 no-print bg-gray-50 p-3 sm:p-4 rounded-lg border items-center shrink-0">
                <select id="slip-term" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px]" onchange="loadMarkSlip()">
                    <option value="">Select Term</option>${termOptions}
                </select>
                <select id="slip-class" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px]" onchange="updateSlipSubjectDropdown()">
                    <option value="">Select Class</option>${classOptions}
                </select>
                <select id="slip-subject" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[150px]" onchange="loadMarkSlip()">
                    <option value="">Select Subject</option>
                </select>
                <div class="flex gap-2 w-full sm:w-auto sm:ml-auto">
                    <button onclick="exportMarkSlipExcel()" class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <i class="fas fa-file-excel"></i> Export
                    </button>
                    <button onclick="window.print()" class="flex-1 sm:flex-none bg-gray-800 hover:bg-black text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>

            <div id="mark-slip-container" class="bg-white rounded-lg shadow-sm border overflow-x-auto overflow-y-auto custom-scrollbar flex-1 print-section relative">
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-clipboard-list text-4xl mb-3 opacity-50"></i>
                    <p>Select Term, Class, and Subject to view Blank Mark Slip</p>
                </div>
            </div>
        </div>
    `;
}

function updateSlipSubjectDropdown() {
    const cls = document.getElementById('slip-class').value;
    const subSelect = document.getElementById('slip-subject');
    if(!cls) {
        subSelect.innerHTML = '<option value="">Select Subject</option>';
        loadMarkSlip();
        return;
    }
    const subjects = getSubjectsForClass(cls);
    subSelect.innerHTML = '<option value="">Select Subject</option>' + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    loadMarkSlip();
}

function loadMarkSlip() {
    const cls = document.getElementById('slip-class').value;
    const term = document.getElementById('slip-term').value || 'Term';
    const sub = document.getElementById('slip-subject').value;
    const container = document.getElementById('mark-slip-container');

    if(!cls || !sub) { 
        container.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-clipboard-list text-4xl mb-3 opacity-50"></i><p>Please select Class and Subject.</p></div>'; 
        return; 
    }

    const clsStudents = state.students.filter(s => s.className === cls);
    if(clsStudents.length === 0) {
        container.innerHTML = '<p class="text-center py-8 text-gray-500">No students in this class.</p>';
        return;
    }

    const isHigherClass = isClassHigher(cls);

    const getDivisions = (subName) => {
        if (state.examSettings.markDivisions && state.examSettings.markDivisions[cls] && state.examSettings.markDivisions[cls][subName]) {
            return state.examSettings.markDivisions[cls][subName];
        }
        return [{ category: 'Theory', name: 'TH', fm: 100, pm: 35 }];
    };

    const divs = getDivisions(sub);

    let theadHtml = `
        <thead class="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0 z-10">
            <tr>
                <th rowspan="2" class="px-3 py-3 border border-gray-400 text-center bg-gray-200 w-16 shadow-[0_1px_0_#9ca3af]">S.N.</th>
                <th rowspan="2" class="px-4 py-3 border border-gray-400 text-center bg-gray-200 w-32 shadow-[0_1px_0_#9ca3af]">Symbol No</th>
                <th rowspan="2" class="px-4 py-3 border border-gray-400 text-left min-w-[200px] bg-gray-200 shadow-[0_1px_0_#9ca3af]">Student Name</th>
                <th colspan="${divs.length}" class="px-2 py-2 border border-gray-400 text-center bg-gray-200 shadow-[0_1px_0_#9ca3af]" title="${sub}">${sub}</th>
                <th rowspan="2" class="px-2 py-3 border border-gray-400 text-center bg-gray-200 w-32 shadow-[0_1px_0_#9ca3af]">Remarks</th>
            </tr>
            <tr>
    `;
    
    divs.forEach(d => {
        theadHtml += `<th class="px-2 py-2 border border-gray-400 text-center text-[11px] bg-gray-100 shadow-[0_1px_0_#9ca3af]">${d.name} <br> <span class="text-gray-500 normal-case font-medium">(FM:${d.fm})</span></th>`;
    });
    theadHtml += `</tr></thead>`;

    let tbodyHtml = '';
    clsStudents.sort((a, b) => a.name.localeCompare(b.name)).forEach((student, index) => {
        let sRow = `<tr class="text-sm bg-white hover:bg-gray-50">
            <td class="px-3 py-3 border border-gray-400 text-center text-gray-700 font-medium">${index+1}</td>
            <td class="px-4 py-3 border border-gray-400 font-medium text-gray-700 text-center">${student.symbolNo || '-'}</td>
            <td class="px-4 py-3 border border-gray-400 font-semibold text-gray-900">${student.name}</td>
        `;

        let mySubs = isHigherClass ? ((state.examSettings.studentSubjects && state.examSettings.studentSubjects[student.id]) || []) : [sub];

        if (isHigherClass && !mySubs.includes(sub)) {
            divs.forEach(() => sRow += `<td class="px-2 py-3 border border-gray-400 text-center bg-gray-100 text-gray-400 text-xs">N/A</td>`);
            sRow += `<td class="px-2 py-3 border border-gray-400 text-center bg-gray-100"></td>`; 
        } else {
            divs.forEach(() => sRow += `<td class="px-2 py-3 border border-gray-400 text-center"></td>`);
            sRow += `<td class="px-2 py-3 border border-gray-400 text-center"></td>`; 
        }
        sRow += '</tr>';
        tbodyHtml += sRow;
    });

    const sName = state.examSettings.schoolName || 'Shree Rasuwa Secondary School';
    const sAddress = state.examSettings.schoolAddress || 'Gosaikunda RM-6, Dhunche, Rasuwa';
    const aYear = state.examSettings.academicYear || new Date().getFullYear() + 56;

    container.innerHTML = `
        <div class="px-4 pt-4 pb-2 text-center print-section">
            <h2 class="text-xl font-bold uppercase">${sName}</h2>
            <p class="text-sm font-semibold">${sAddress}</p>
            <h3 class="text-md font-semibold text-gray-700 underline mt-1">BLANK MARK ENTRY SLIP</h3>
            <p class="text-sm font-medium text-gray-500 mt-1 mb-2">Class: <span class="text-black font-bold">${cls}</span> | Term: <span class="text-black font-bold">${term}</span> | Subject: <span class="text-black font-bold">${sub}</span> | Year: <span class="text-black font-bold">${aYear}</span></p>
        </div>
        <table id="mark-slip-table" class="w-full text-left border-collapse border border-gray-800">
            ${theadHtml}
            <tbody>${tbodyHtml}</tbody>
        </table>
    `;
}

function exportMarkSlipExcel() {
    const table = document.getElementById('mark-slip-table');
    if(!table) { 
        showToast('Please generate a Mark Slip first before exporting.', 'error'); 
        return; 
    }
    
    const term = document.getElementById('slip-term').value || 'Term';
    const cls = document.getElementById('slip-class').value || 'Class';
    const sub = document.getElementById('slip-subject').value || 'Subject';
    
    const wb = XLSX.utils.table_to_book(table, {sheet: "Mark Slip"});
    XLSX.writeFile(wb, `Mark_Slip_${cls}_${sub.replace(/\s+/g, '_')}_${term}.xlsx`);
    showToast('Excel file downloaded successfully!', 'success');
}

/* ============================================================
   MARK ENTRY ENGINE & DIVISION EDITOR
   ============================================================ */
var markEntryCtx = null;

function getMarkEntryDivisions(cls, sub) {
    const raw = (state.examSettings.markDivisions && state.examSettings.markDivisions[cls] && state.examSettings.markDivisions[cls][sub])
        || [{ category: 'Theory', name: 'TH', fm: 100, pm: 35 }];
    return raw.map((d, i) => ({ ...d, originalIndex: i }));
}

function renderMarkEntry(container) {
    const user = state.currentUser;
    const assignments = user.assignments || [];

    if (assignments.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 text-center fade-in mt-6 max-w-lg mx-auto">
                <div class="text-gray-300 mb-4"><i class="fas fa-inbox text-5xl"></i></div>
                <h3 class="text-lg font-bold text-gray-700 mb-2">No Assignments Yet</h3>
                <p class="text-sm text-gray-500">You haven't been assigned any class/subject yet. Please contact the Admin.</p>
            </div>
        `;
        return;
    }

    const termOptions = state.terms.map(t => `<option value="${t}">${t}</option>`).join('');
    const assignOptions = assignments.map((a, i) => `<option value="${i}">${a.className} - ${a.subject}</option>`).join('');

    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="bg-gray-50 p-3 sm:p-4 rounded-lg border flex flex-col sm:flex-row gap-3 items-end shrink-0 no-print">
                <div class="w-full sm:w-1/3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Term</label>
                    <select id="me-term" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">${termOptions}</select>
                </div>
                <div class="w-full sm:w-1/3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Class - Subject</label>
                    <select id="me-assignment" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Assignment</option>
                        ${assignOptions}
                    </select>
                </div>
                <div class="w-full sm:w-1/3">
                    <button onclick="loadTeacherMarkEntry()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                        <i class="fas fa-folder-open"></i> Load Students
                    </button>
                </div>
            </div>
            <div id="mark-entry-grid-container" class="flex-1 min-w-0 flex flex-col">
                <div class="text-center py-12 text-gray-400 bg-white rounded-lg border">
                    <i class="fas fa-edit text-4xl mb-3 opacity-50"></i>
                    <p>Select a Term and Class-Subject, then click "Load Students" to begin entering marks.</p>
                </div>
            </div>
        </div>
    `;
}

function loadTeacherMarkEntry() {
    const term = document.getElementById('me-term').value;
    const idx = document.getElementById('me-assignment').value;
    if (idx === '') { showToast('Please select a Class - Subject to continue.', 'error'); return; }
    const assignment = state.currentUser.assignments[idx];
    renderMarkEntryGrid(document.getElementById('mark-entry-grid-container'), assignment.className, assignment.subject, term, true);
}

function renderTermMarkMgmt(container) {
    const classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    const termOptions = state.terms.map(t => `<option value="${t}">${t}</option>`).join('');

    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="bg-gray-50 p-3 sm:p-4 rounded-lg border flex flex-col sm:flex-row gap-3 items-end shrink-0 no-print">
                <div class="w-full sm:w-1/4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Term</label>
                    <select id="tmm-term" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">${termOptions}</select>
                </div>
                <div class="w-full sm:w-1/4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Class</label>
                    <select id="tmm-class" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500" onchange="updateTmmSubjectDropdown()">
                        <option value="">Select Class</option>
                        ${classOptions}
                    </select>
                </div>
                <div class="w-full sm:w-1/4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                    <select id="tmm-subject" onchange="loadTmmDivisionEditor()" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Class First</option>
                    </select>
                </div>
                <div class="w-full sm:w-1/4">
                    <button onclick="loadAdminMarkEntry()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                        <i class="fas fa-folder-open"></i> Load Students
                    </button>
                </div>
            </div>
            <div class="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg border border-blue-100 no-print">
                <i class="fas fa-info-circle mr-1"></i> As Admin, you can view and correct marks for any class or subject here, including entries made by teachers.
            </div>
            <div id="tmm-division-editor" class="bg-white rounded-lg border shadow-sm p-3 sm:p-4 no-print">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-3">
                    <div>
                        <h3 class="text-sm font-bold text-gray-800"><i class="fas fa-columns mr-2 text-blue-600"></i>Mark Division Settings</h3>
                        <p class="text-xs text-gray-500 mt-1">Divide the selected subject's Full Mark into Theory and Internal. Internal can be divided into multiple parts.</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="loadTmmDivisionEditor()" class="px-3 py-1.5 border rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700"><i class="fas fa-sync-alt mr-1"></i>Load Division</button>
                        <button onclick="addTmmDivisionRow('Internal')" class="px-3 py-1.5 border rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700"><i class="fas fa-plus mr-1"></i>Add Internal Part</button>
                        <button onclick="saveTmmDivision(false)" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-700 text-white"><i class="fas fa-save mr-1"></i>Save for Subject</button>
                        <button onclick="saveTmmDivision(true)" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white"><i class="fas fa-layer-group mr-1"></i>Apply to All Subjects</button>
                    </div>
                </div>
                <div id="tmm-division-editor-body" class="text-xs text-gray-500 bg-gray-50 rounded-lg border p-3">Select Class and Subject above to configure mark division.</div>
            </div>
            <div id="term-mark-grid-container" class="flex-1 min-w-0 flex flex-col">
                <div class="text-center py-12 text-gray-400 bg-white rounded-lg border">
                    <i class="fas fa-clipboard-list text-4xl mb-3 opacity-50"></i>
                    <p>Select Term, Class and Subject, then click "Load Students".</p>
                </div>
            </div>
        </div>
    `;
}

function updateTmmSubjectDropdown() {
    const cls = document.getElementById('tmm-class').value;
    const subSelect = document.getElementById('tmm-subject');
    if (!cls) {
        subSelect.innerHTML = '<option value="">Select Subject</option>';
        renderTmmDivisionEditorMessage('Select Class and Subject above to configure mark division.');
        return;
    }
    const subjects = getSubjectsForClass(cls);
    if (subjects.length === 0) {
        subSelect.innerHTML = '<option value="">No subjects configured</option>';
        renderTmmDivisionEditorMessage('No subjects configured for this class.');
        return;
    }
    subSelect.innerHTML = '<option value="">Select Subject</option>' + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    renderTmmDivisionEditorMessage('Select a Subject to configure mark division.');
}

function renderTmmDivisionEditorMessage(message) {
    const body = document.getElementById('tmm-division-editor-body');
    if (body) body.innerHTML = `<div class="text-center py-3 text-gray-500"><i class="fas fa-info-circle mr-1"></i>${message}</div>`;
}

function loadTmmDivisionEditor() {
    const cls = document.getElementById('tmm-class')?.value;
    const sub = document.getElementById('tmm-subject')?.value;
    const body = document.getElementById('tmm-division-editor-body');
    if (!body) return;
    if (!cls || !sub) {
        renderTmmDivisionEditorMessage('Select Class and Subject above to configure mark division.');
        return;
    }

    let raw = (state.examSettings.markDivisions && state.examSettings.markDivisions[cls] && state.examSettings.markDivisions[cls][sub]) || null;
    if (!raw || !raw.length) raw = [{ category: 'Theory', name: 'Theory', fm: 100, pm: 35 }];
    const divs = raw.map(d => ({ category: d.category === 'Internal' ? 'Internal' : 'Theory', name: d.name || (d.category === 'Internal' ? 'Internal' : 'Theory'), fm: Number(d.fm) || 0, pm: Number(d.pm) || 0 }));
    const total = divs.reduce((a, d) => a + d.fm, 0);

    body.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
                <label class="block font-semibold text-gray-700 mb-1">Full Mark</label>
                <input id="tmm-full-mark" type="number" min="1" step="0.01" value="${total || 100}" oninput="updateTmmDivisionTotal()" class="w-full px-3 py-2 border rounded-lg bg-white text-sm">
            </div>
            <div class="sm:col-span-2 flex items-end">
                <div id="tmm-division-total" class="w-full px-3 py-2 rounded-lg border bg-white text-sm font-semibold">Configured: ${total} / ${total}</div>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full border-collapse text-xs">
                <thead><tr class="bg-gray-100">
                    <th class="border px-2 py-2 text-left">Category</th>
                    <th class="border px-2 py-2 text-left">Component Name</th>
                    <th class="border px-2 py-2 text-center">Full Mark</th>
                    <th class="border px-2 py-2 text-center">Pass Mark</th>
                    <th class="border px-2 py-2 text-center w-12">Remove</th>
                </tr></thead>
                <tbody id="tmm-division-rows">
                    ${divs.map((d, i) => tmmDivisionRowHtml(d, i)).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
            <button onclick="addTmmDivisionRow('Theory')" class="px-3 py-1.5 rounded-lg border bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"><i class="fas fa-plus mr-1"></i>Add Theory Part</button>
            <button onclick="addTmmDivisionRow('Internal')" class="px-3 py-1.5 rounded-lg border bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold"><i class="fas fa-plus mr-1"></i>Add Internal Part</button>
            <span class="ml-auto text-[11px] text-gray-500 self-center">Example: Theory 50 + Internal 50; Internal can be Attendance 10 + Practical 20 + Assignment 20.</span>
        </div>`;
    updateTmmDivisionTotal();
}

function tmmDivisionRowHtml(d, index) {
    const category = d.category === 'Internal' ? 'Internal' : 'Theory';
    return `<tr data-tmm-row>
        <td class="border px-2 py-1.5">
            <select class="tmm-div-category w-full px-2 py-1.5 border rounded bg-white">
                <option value="Theory" ${category === 'Theory' ? 'selected' : ''}>Theory</option>
                <option value="Internal" ${category === 'Internal' ? 'selected' : ''}>Internal</option>
            </select>
        </td>
        <td class="border px-2 py-1.5"><input class="tmm-div-name w-full px-2 py-1.5 border rounded" value="${String(d.name).replace(/"/g, '&quot;')}" placeholder="e.g. Theory / Practical"></td>
        <td class="border px-2 py-1.5"><input class="tmm-div-fm w-full px-2 py-1.5 border rounded text-center" type="number" min="0" step="0.01" value="${d.fm}" oninput="updateTmmDivisionTotal()"></td>
        <td class="border px-2 py-1.5"><input class="tmm-div-pm w-full px-2 py-1.5 border rounded text-center" type="number" min="0" step="0.01" value="${d.pm}"></td>
        <td class="border px-2 py-1.5 text-center"><button onclick="this.closest('tr').remove(); updateTmmDivisionTotal();" class="text-red-500 hover:text-red-700 px-2 py-1" title="Remove"><i class="fas fa-trash"></i></button></td>
    </tr>`;
}

function addTmmDivisionRow(category = 'Internal') {
    const tbody = document.getElementById('tmm-division-rows');
    if (!tbody) return;
    const idx = tbody.querySelectorAll('tr[data-tmm-row]').length;
    const name = category === 'Internal' ? `Internal ${idx + 1}` : `Theory ${idx + 1}`;
    tbody.insertAdjacentHTML('beforeend', tmmDivisionRowHtml({ category, name, fm: 0, pm: 0 }, idx));
    updateTmmDivisionTotal();
}

function updateTmmDivisionTotal() {
    const totalEl = document.getElementById('tmm-division-total');
    const fullEl = document.getElementById('tmm-full-mark');
    const tbody = document.getElementById('tmm-division-rows');
    if (!totalEl || !fullEl || !tbody) return;
    const full = Number(fullEl.value) || 0;
    let total = 0, theory = 0, internal = 0;
    tbody.querySelectorAll('tr[data-tmm-row]').forEach(row => {
        const fm = Number(row.querySelector('.tmm-div-fm')?.value) || 0;
        const cat = row.querySelector('.tmm-div-category')?.value;
        total += fm;
        if (cat === 'Internal') internal += fm; else theory += fm;
    });
    const diff = Math.round((total - full) * 100) / 100;
    const status = diff === 0 ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200';
    totalEl.className = `w-full px-3 py-2 rounded-lg border text-sm font-semibold ${status}`;
    totalEl.innerHTML = `Theory: ${theory} &nbsp;|&nbsp; Internal: ${internal} &nbsp;|&nbsp; Total: ${total} / ${full} ${diff === 0 ? '<i class="fas fa-check-circle ml-1"></i>' : `<span class="ml-1">(Difference: ${diff > 0 ? '+' : ''}${diff})</span>`}`;
}

function collectTmmDivisions() {
    const full = Number(document.getElementById('tmm-full-mark')?.value) || 0;
    const rows = document.querySelectorAll('#tmm-division-rows tr[data-tmm-row]');
    const divs = [];
    rows.forEach(row => {
        const category = row.querySelector('.tmm-div-category')?.value === 'Internal' ? 'Internal' : 'Theory';
        const name = (row.querySelector('.tmm-div-name')?.value || '').trim() || (category === 'Internal' ? 'Internal' : 'Theory');
        const fm = Number(row.querySelector('.tmm-div-fm')?.value) || 0;
        const pm = Number(row.querySelector('.tmm-div-pm')?.value) || 0;
        divs.push({ category, name, fm, pm });
    });
    return { full, divs };
}

function saveTmmDivision(applyAll = false) {
    const cls = document.getElementById('tmm-class')?.value;
    const sub = document.getElementById('tmm-subject')?.value;
    if (!cls || !sub) { showToast('Please select Class and Subject first.', 'error'); return; }
    const { full, divs } = collectTmmDivisions();
    if (full <= 0 || divs.length === 0) { showToast('Please enter Full Mark and at least one division.', 'error'); return; }
    const total = divs.reduce((a, d) => a + d.fm, 0);
    if (Math.abs(total - full) > 0.001) {
        showToast(`Division total (${total}) must equal Full Mark (${full}).`, 'error');
        return;
    }
    if (divs.some(d => d.fm < 0 || d.pm < 0 || d.pm > d.fm)) {
        showToast('Each Pass Mark must be between 0 and its component Full Mark.', 'error');
        return;
    }
    if (!state.examSettings.markDivisions) state.examSettings.markDivisions = {};
    if (!state.examSettings.markDivisions[cls]) state.examSettings.markDivisions[cls] = {};

    if (applyAll) {
        const subjects = getSubjectsForClass(cls);
        if (!subjects.length) { showToast('No subjects configured for this class.', 'error'); return; }
        subjects.forEach(subject => {
            state.examSettings.markDivisions[cls][subject] = divs.map(d => ({ ...d }));
        });
        saveState();
        showToast(`Mark division applied to all ${subjects.length} subject(s) in ${cls}.`, 'success');
    } else {
        state.examSettings.markDivisions[cls][sub] = divs;
        saveState();
        showToast(`Mark division saved for ${cls} - ${sub}.`, 'success');
    }
    loadTmmDivisionEditor();
    const term = document.getElementById('tmm-term')?.value;
    if (term && cls && sub) renderMarkEntryGrid(document.getElementById('term-mark-grid-container'), cls, sub, term, true);
}

function loadAdminMarkEntry() {
    const term = document.getElementById('tmm-term').value;
    const cls = document.getElementById('tmm-class').value;
    const sub = document.getElementById('tmm-subject').value;
    if (!cls || !sub) { showToast('Please select Class and Subject.', 'error'); return; }
    renderMarkEntryGrid(document.getElementById('term-mark-grid-container'), cls, sub, term, true);
}

function renderMarkEntryGrid(container, cls, sub, term, editable) {
    const clsStudents = state.students.filter(s => s.className === cls);
    if (clsStudents.length === 0) {
        container.innerHTML = '<p class="text-center py-8 text-gray-500 bg-white rounded-lg border">No students found in this class.</p>';
        return;
    }

    const isHigherClass = isClassHigher(cls);
    const divs = getMarkEntryDivisions(cls, sub);
    const totalFm = divs.reduce((acc, d) => acc + Number(d.fm), 0);

    markEntryCtx = { cls, sub, term, divs, isHigherClass, totalFm };

    let theadHtml = `
        <thead class="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0 z-10">
            <tr>
                <th rowspan="2" class="px-3 py-3 border border-gray-300 text-center bg-gray-200 w-12">S.N.</th>
                <th rowspan="2" class="px-3 py-3 border border-gray-300 text-center bg-gray-200 w-28">Symbol No</th>
                <th rowspan="2" class="px-4 py-3 border border-gray-300 text-left min-w-[180px] bg-gray-200">Student Name</th>
                <th colspan="${divs.length}" class="px-2 py-2 border border-gray-300 text-center bg-gray-200" title="${sub}">${sub}</th>
                <th rowspan="2" class="px-2 py-3 border border-gray-300 text-center bg-gray-200 w-20">Total</th>
            </tr>
            <tr>
    `;
    divs.forEach(d => {
        theadHtml += `<th class="px-2 py-2 border border-gray-300 text-center text-[11px] bg-gray-100 w-24">${d.name} <br><span class="text-gray-500 normal-case font-medium">(FM:${d.fm})</span></th>`;
    });
    theadHtml += `</tr></thead>`;

    let tbodyHtml = '';
    clsStudents.sort((a, b) => a.name.localeCompare(b.name)).forEach((student, index) => {
        const mySubs = isHigherClass ? ((state.examSettings.studentSubjects && state.examSettings.studentSubjects[student.id]) || []) : [sub];
        const notEnrolled = isHigherClass && !mySubs.includes(sub);
        const markRecord = state.marks.find(m => m.studentId === student.id && m.term === term && m.subject === sub);

        let rowTotal = 0;
        let cellsHtml = '';

        if (notEnrolled) {
            divs.forEach(() => cellsHtml += `<td class="px-2 py-2 border border-gray-300 text-center bg-gray-100 text-gray-400 text-xs">N/A</td>`);
            cellsHtml += `<td class="px-2 py-2 border border-gray-300 text-center bg-gray-100 text-gray-400 text-xs">N/A</td>`;
        } else {
            divs.forEach(d => {
                const val = (markRecord && markRecord.components && markRecord.components[d.originalIndex] !== undefined) ? markRecord.components[d.originalIndex] : '';
                if (val !== '') rowTotal += Number(val);
                if (editable) {
                    cellsHtml += `<td class="px-1 py-1.5 border border-gray-300 text-center">
                        <input type="number" step="0.01" min="0" max="${d.fm}" value="${val}"
                            class="mark-input w-20 px-1.5 py-1 border border-gray-200 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            data-student="${student.id}" data-idx="${d.originalIndex}" data-fm="${d.fm}"
                            oninput="onMarkInputChange(this)" onkeydown="handleMarkInputKeydown(event, this)">
                    </td>`;
                } else {
                    cellsHtml += `<td class="px-2 py-2 border border-gray-300 text-center">${val === '' ? '-' : val}</td>`;
                }
            });
            cellsHtml += `<td class="px-2 py-2 border border-gray-300 text-center font-bold text-blue-700 bg-blue-50/40" id="me-total-${student.id}">${rowTotal || 0}</td>`;
        }

        tbodyHtml += `
            <tr class="text-sm bg-white hover:bg-gray-50">
                <td class="px-3 py-2 border border-gray-300 text-center text-gray-500">${index + 1}</td>
                <td class="px-3 py-2 border border-gray-300 text-center font-medium text-gray-700">${student.symbolNo || '-'}</td>
                <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-900">${student.name}</td>
                ${cellsHtml}
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col flex-1 min-h-0">
            <div class="px-4 py-3 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                <div class="text-sm">
                    <span class="font-bold text-gray-800">${cls}</span> &middot; <span class="font-bold text-gray-800">${sub}</span> &middot; <span class="text-gray-500">${term || 'No Term Selected'}</span>
                    <span class="ml-2 text-xs text-gray-400">(Full Marks: ${totalFm})</span>
                </div>
                ${editable ? `
                <button onclick="saveMarkEntryGrid()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors">
                    <i class="fas fa-save"></i> Save All Marks
                </button>` : ''}
            </div>
            <div class="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
                <table class="w-full text-left border-collapse">
                    ${theadHtml}
                    <tbody>${tbodyHtml}</tbody>
                </table>
            </div>
        </div>
    `;
}

function handleMarkInputKeydown(event, input) {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const idx = input.getAttribute('data-idx');
    const inputs = Array.from(document.querySelectorAll('.mark-input'))
        .filter(el => el.getAttribute('data-idx') === idx);
    const currentIndex = inputs.indexOf(input);

    if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
        const nextInput = inputs[currentIndex + 1];
        nextInput.focus();
        if (typeof nextInput.select === 'function') nextInput.select();
    }
}

function onMarkInputChange(input) {
    const fm = Number(input.getAttribute('data-fm'));
    const val = input.value;
    if (val !== '' && (Number(val) > fm || Number(val) < 0)) {
        input.classList.add('border-red-400', 'bg-red-50', 'text-red-600');
        input.title = `Value must be between 0 and ${fm}`;
    } else {
        input.classList.remove('border-red-400', 'bg-red-50', 'text-red-600');
        input.title = '';
    }

    const studentId = input.getAttribute('data-student');
    let total = 0;
    document.querySelectorAll(`.mark-input[data-student="${studentId}"]`).forEach(inp => {
        if (inp.value !== '') total += Number(inp.value);
    });
    const totalCell = document.getElementById(`me-total-${studentId}`);
    if (totalCell) totalCell.innerText = total;
}

function saveMarkEntryGrid() {
    if (!markEntryCtx) return;
    const { cls, sub, term, divs } = markEntryCtx;

    if (!term) { showToast('Please select a Term before saving.', 'error'); return; }

    let invalidCount = 0;
    document.querySelectorAll('.mark-input').forEach(inp => {
        const fm = Number(inp.getAttribute('data-fm'));
        if (inp.value !== '' && (Number(inp.value) > fm || Number(inp.value) < 0)) invalidCount++;
    });
    if (invalidCount > 0) {
        showToast(`${invalidCount} mark(s) are out of range. Please fix the highlighted fields before saving.`, 'error');
        return;
    }

    const studentIds = new Set();
    document.querySelectorAll('.mark-input').forEach(inp => studentIds.add(inp.getAttribute('data-student')));

    let savedCount = 0;
    studentIds.forEach(studentId => {
        let components = {};
        let hasAnyValue = false;
        divs.forEach(d => {
            const inp = document.querySelector(`.mark-input[data-student="${studentId}"][data-idx="${d.originalIndex}"]`);
            if (inp && inp.value !== '') {
                components[d.originalIndex] = Number(inp.value);
                hasAnyValue = true;
            }
        });

        if (!hasAnyValue) return;

        let markRecord = state.marks.find(m => m.studentId === studentId && m.term === term && m.subject === sub);
        if (markRecord) {
            markRecord.components = components;
        } else {
            state.marks.push({ studentId, term, subject: sub, className: cls, components });
        }
        savedCount++;
    });

    showToast(`Marks saved successfully for ${savedCount} student(s) in ${sub} (${term}).`, 'success');
}
