// portal_results_attendance.js

var activeGradeScaleId = 'scale-1';

function renderGradeRules(container) {
    if (!state.gradeRules || state.gradeRules.length === 0) {
        state.gradeRules = [{ id: 'scale-1', name: 'Standard Scale', classes: [], rules: [] }];
    }
    let activeScale = state.gradeRules.find(s => s.id === activeGradeScaleId) || state.gradeRules[0];
    activeGradeScaleId = activeScale.id;

    let tabsHtml = state.gradeRules.map(scale => `
        <button onclick="switchGradeTab('${scale.id}')" class="px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${activeGradeScaleId === scale.id ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}">
            ${scale.name}
        </button>
    `).join('');

    let classCheckboxesHtml = state.classes.map(c => `
        <label class="inline-flex items-center bg-gray-50 px-2 py-1.5 rounded border hover:bg-gray-100 cursor-pointer text-sm m-1">
            <input type="checkbox" class="scale-class-cb form-checkbox h-4 w-4 text-blue-600 rounded" value="${c}" ${activeScale.classes.includes(c) ? 'checked' : ''}>
            <span class="ml-2">${c}</span>
        </label>
    `).join('');

    let tbody = activeScale.rules.map((r, idx) => `
        <tr class="border-b bg-white hover:bg-gray-50 grade-rule-row text-sm">
            <td class="px-2 py-2 min-w-[70px]"><input type="number" step="0.01" class="rule-min w-full px-2 py-1.5 border rounded text-center focus:ring-1 focus:ring-blue-500" value="${r.min}"></td>
            <td class="px-2 py-2 min-w-[70px]"><input type="number" step="0.01" class="rule-max w-full px-2 py-1.5 border rounded text-center focus:ring-1 focus:ring-blue-500" value="${r.max}"></td>
            <td class="px-2 py-2 min-w-[60px]"><input type="text" class="rule-grade w-full px-2 py-1.5 border rounded text-center font-bold focus:ring-1 focus:ring-blue-500" value="${r.grade}"></td>
            <td class="px-2 py-2 min-w-[60px]"><input type="number" step="0.1" class="rule-gpa w-full px-2 py-1.5 border rounded text-center focus:ring-1 focus:ring-blue-500" value="${r.gpa}"></td>
            <td class="px-2 py-2 min-w-[120px]">
                <select class="rule-color w-full px-2 py-1.5 border rounded focus:ring-1 focus:ring-blue-500 ${r.color}">
                    <option value="text-green-600" class="text-green-600" ${r.color==='text-green-600'?'selected':''}>Green</option>
                    <option value="text-blue-600" class="text-blue-600" ${r.color==='text-blue-600'?'selected':''}>Blue</option>
                    <option value="text-red-600" class="text-red-600" ${r.color==='text-red-600'?'selected':''}>Red</option>
                </select>
            </td>
            <td class="px-2 py-2 text-center sticky right-0 bg-white z-10 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.05)]">
                <button onclick="removeGradeRule(${idx})" class="text-red-500 hover:text-red-700 p-1" title="Remove"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="fade-in max-w-5xl mx-auto pb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 flex flex-col">
                <div class="flex flex-col sm:flex-row border-b bg-gray-50 items-start sm:items-center justify-between">
                    <div class="flex overflow-x-auto hide-scrollbar custom-scrollbar-horizontal w-full sm:w-auto">
                        ${tabsHtml}
                    </div>
                    <button onclick="addNewGradeScale()" class="m-3 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 shrink-0">
                        <i class="fas fa-plus-circle"></i> Add Scale
                    </button>
                </div>
                
                <div class="p-4 sm:p-6">
                    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div class="col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Scale Name</label>
                            <input type="text" id="scale-name-input" value="${activeScale.name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-2">
                            <button onclick="deleteCurrentGradeScale()" class="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 mt-2">
                                <i class="fas fa-trash"></i> Delete Scale
                            </button>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Assign Classes</label>
                            <div class="flex flex-wrap -m-1">
                                ${classCheckboxesHtml || '<span class="text-sm text-gray-400 p-1">No classes available.</span>'}
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mb-4 mt-6 pt-6 border-t border-gray-100">
                        <h3 class="font-bold text-gray-700 text-base sm:text-lg">Grade Mapping Rules</h3>
                        <button onclick="addGradeRule()" class="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-sm font-medium border border-blue-200 shrink-0"><i class="fas fa-plus mr-1"></i> Add Rule</button>
                    </div>
                    
                    <div class="overflow-x-auto custom-scrollbar border rounded-lg border-gray-200 relative">
                        <table class="w-full text-left whitespace-nowrap">
                            <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th class="px-2 py-3 text-center min-w-[70px]">Min %</th>
                                    <th class="px-2 py-3 text-center min-w-[70px]">Max %</th>
                                    <th class="px-2 py-3 text-center min-w-[60px]">Grade</th>
                                    <th class="px-2 py-3 text-center min-w-[60px]">GPA</th>
                                    <th class="px-2 py-3 text-center min-w-[120px]">Color</th>
                                    <th class="px-2 py-3 text-center min-w-[50px] sticky right-0 bg-gray-100 z-10 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)]">Act</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tbody || '<tr><td colspan="6" class="text-center py-4 text-gray-500 text-sm">No rules defined.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button onclick="saveGradeRules()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                            <i class="fas fa-save"></i> Save Rules
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function switchGradeTab(id) { saveGradeRulesToState(); activeGradeScaleId = id; renderGradeRules(document.getElementById('content-area')); }
function saveGradeRulesToState() {
    let active = state.gradeRules.find(s => s.id === activeGradeScaleId);
    if(!active) return;
    const nameEl = document.getElementById('scale-name-input');
    if(nameEl) active.name = nameEl.value;
    
    const cbs = document.querySelectorAll('.scale-class-cb:checked');
    active.classes = Array.from(cbs).map(cb => cb.value);
    
    let rules = [];
    document.querySelectorAll('.grade-rule-row').forEach(row => {
        rules.push({
            min: parseFloat(row.querySelector('.rule-min').value)||0,
            max: parseFloat(row.querySelector('.rule-max').value)||0,
            grade: row.querySelector('.rule-grade').value,
            gpa: parseFloat(row.querySelector('.rule-gpa').value)||0,
            color: row.querySelector('.rule-color').value
        });
    });
    active.rules = rules.sort((a,b) => b.max - a.max);
}
function saveGradeRules() { saveGradeRulesToState(); showToast('Saved', 'success'); }
function addGradeRule() { saveGradeRulesToState(); state.gradeRules.find(s=>s.id===activeGradeScaleId).rules.push({min:0,max:0,grade:'',gpa:0,color:'text-gray-800'}); renderGradeRules(document.getElementById('content-area')); }
function removeGradeRule(i) { saveGradeRulesToState(); state.gradeRules.find(s=>s.id===activeGradeScaleId).rules.splice(i,1); renderGradeRules(document.getElementById('content-area')); }
function addNewGradeScale() { saveGradeRulesToState(); const id='scale-'+Date.now(); state.gradeRules.push({id, name:'New Scale', classes:[], rules:[]}); activeGradeScaleId=id; renderGradeRules(document.getElementById('content-area')); }
function deleteCurrentGradeScale() { if(state.gradeRules.length>1) { state.gradeRules=state.gradeRules.filter(s=>s.id!==activeGradeScaleId); activeGradeScaleId=state.gradeRules[0].id; renderGradeRules(document.getElementById('content-area')); } }

function getGradeInfo(percentage, className) {
    let activeScale = state.gradeRules.find(s => s.classes.includes(className)) || state.gradeRules[0];
    if (activeScale) {
        for (let r of activeScale.rules) {
            if (percentage >= r.min && percentage <= r.max) return { grade: r.grade, gpa: r.gpa, textClass: r.color + ' font-bold', isNG: (r.grade === 'NG' || r.gpa === 0) };
        }
    }
    return { grade: 'NG', gpa: 0.0, textClass: 'text-red-600 font-bold', isNG: true };
}

function renderUploadSettings(container) {
    const imgs = state.examSettings.images || {};
    const sName = state.examSettings.schoolName || 'Shree Rasuwa Secondary School';
    const sAddress = state.examSettings.schoolAddress || 'Gosaikunda RM-6, Dhunche, Rasuwa';
    const sEstd = state.examSettings.estdYear || '';
    const sAcad = state.examSettings.academicYear || '';
    
    container.innerHTML = `
        <div class="fade-in max-w-5xl mx-auto pb-10">
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-4 border-b pb-2"><i class="fas fa-school mr-2 text-blue-600"></i> General Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input type="text" id="setting-school-name" value="${sName}" onchange="saveGeneralSettings()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">School Address</label>
                        <input type="text" id="setting-school-address" value="${sAddress}" onchange="saveGeneralSettings()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Established (Estd.)</label>
                        <input type="text" id="setting-school-estd" value="${sEstd}" onchange="saveGeneralSettings()" placeholder="e.g. 2014 B.S." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                        <input type="text" id="setting-academic-year" value="${sAcad}" onchange="saveGeneralSettings()" placeholder="e.g. 2083" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                </div>
            </div>

            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-4 border-b pb-2"><i class="fas fa-key mr-2 text-red-600"></i> Change Admin Password</h3>
                <form onsubmit="handleAdminPasswordChange(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" id="admin-curr-pass" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" id="admin-new-pass" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                    <div>
                        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm">Update Password</button>
                    </div>
                </form>
            </div>

            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-4 border-b pb-2"><i class="fas fa-database mr-2 text-purple-600"></i> Data Backup & Restore</h3>
                <p class="text-xs text-gray-500 mb-4">All data (students, teachers, marks, settings) is auto-saved in this browser. Download a backup regularly, or move your data to another device/browser using Export &amp; Import.</p>
                <input type="file" id="restore-file-input" accept="application/json" class="hidden" onchange="handleRestoreFile(event)">
                <div class="flex flex-col sm:flex-row gap-3">
                    <button onclick="exportBackup()" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
                        <i class="fas fa-download"></i> Export Backup (.json)
                    </button>
                    <button onclick="triggerRestore()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
                        <i class="fas fa-upload"></i> Restore from Backup
                    </button>
                    <button onclick="resetAllData()" class="flex-1 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
                        <i class="fas fa-trash-alt"></i> Erase All Data
                    </button>
                </div>
            </div>

            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-4 border-b pb-2"><i class="fas fa-images mr-2 text-blue-600"></i> Images & Signatures</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    ${['logo', 'coSign', 'htSign', 'extraImg'].map(key => `
                        <div class="border rounded-lg p-4 bg-gray-50 flex flex-col items-center text-center">
                            <h4 class="font-semibold text-xs sm:text-sm mb-2 text-gray-700 uppercase">${key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <img id="preview-${key}" src="${imgs[key] || ''}" class="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white border rounded${key==='logo'?'-full':''} mb-3 ${imgs[key] ? '' : 'hidden'}">
                            <div id="placeholder-${key}" class="w-20 h-20 sm:w-24 sm:h-24 rounded${key==='logo'?'-full':''} border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 mb-3 ${imgs[key] ? 'hidden' : ''}">
                                <i class="fas fa-image text-xl sm:text-2xl"></i>
                            </div>
                            <input type="file" id="upload-${key}" accept="image/*" class="hidden" onchange="handleImageUpload(event, '${key}')">
                            <button onclick="document.getElementById('upload-${key}').click()" class="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded text-xs font-medium w-full">Choose Image</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function saveGeneralSettings() {
    state.examSettings.schoolName = document.getElementById('setting-school-name').value.trim();
    state.examSettings.schoolAddress = document.getElementById('setting-school-address').value.trim();
    state.examSettings.estdYear = document.getElementById('setting-school-estd').value.trim();
    state.examSettings.academicYear = document.getElementById('setting-academic-year').value.trim();
    showToast('Settings saved', 'success');
}

function handleAdminPasswordChange(e) {
    e.preventDefault();
    const curr = document.getElementById('admin-curr-pass').value;
    const neu = document.getElementById('admin-new-pass').value;

    if (curr !== state.adminPassword) {
        showToast("Current password is incorrect", "error");
        return;
    }
    state.adminPassword = neu;
    showToast("Admin password successfully updated!", "success");
    document.getElementById('admin-curr-pass').value = '';
    document.getElementById('admin-new-pass').value = '';
}

function handleImageUpload(event, key) {
    const file = event.target.files[0];
    if(file) {
        const r = new FileReader();
        r.onload = function(e) {
            if(!state.examSettings.images) state.examSettings.images = {};
            state.examSettings.images[key] = e.target.result;
            document.getElementById('preview-' + key).src = e.target.result;
            document.getElementById('preview-' + key).classList.remove('hidden');
            document.getElementById('placeholder-' + key).classList.add('hidden');
        }
        r.readAsDataURL(file);
    }
}

function renderResultMgmt(container) {
    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="flex overflow-x-auto border-b bg-gray-50 hide-scrollbar rounded-t-xl shrink-0 no-print">
                <button onclick="switchResultTab('conversion')" id="sub-tab-conversion" class="result-tab px-6 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap transition-colors">Marks Conversion</button>
                <button onclick="switchResultTab('mark')" id="sub-tab-mark" class="result-tab px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Markwise Ledger</button>
            </div>
            <div id="result-content" class="flex-1 min-w-0 bg-white border border-gray-100 rounded-b-xl p-4 sm:p-6 shadow-sm overflow-y-auto">
            </div>
        </div>
    `;
    switchResultTab('conversion');
}

function switchResultTab(type) {
    document.querySelectorAll('.result-tab').forEach(el => {
        el.classList.remove('text-blue-600', 'border-blue-600', 'font-semibold');
        el.classList.add('text-gray-500', 'border-transparent', 'font-medium');
    });
    const activeTab = document.getElementById(`sub-tab-${type}`);
    if(activeTab) {
        activeTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        activeTab.classList.add('text-blue-600', 'border-blue-600', 'font-semibold');
    }
    const container = document.getElementById('result-content');
    container.innerHTML = '<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-blue-500 text-3xl"></i></div>';
    
    setTimeout(() => {
        if (type === 'conversion') {
            renderMarksConversion(container);
        } else if (type === 'mark') {
            renderMarkwiseWrapper(container);
        }
    }, 50);
}

function renderMarkwiseWrapper(container) {
    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="flex overflow-x-auto border-b border-gray-200 bg-white hide-scrollbar shrink-0 no-print rounded-lg shadow-sm">
                <button onclick="switchMarkwiseTab('mark-detailed')" id="mw-tab-mark-detailed" class="mw-tab px-5 py-2.5 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap transition-colors">Mark Ledger</button>
                <button onclick="switchMarkwiseTab('mark-consolidated')" id="mw-tab-mark-consolidated" class="mw-tab px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Mark wise Result</button>
                <button onclick="switchMarkwiseTab('grade-consolidated')" id="mw-tab-grade-consolidated" class="mw-tab px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Grade wise Result</button>
                <button onclick="switchMarkwiseTab('grade-sheet')" id="mw-tab-grade-sheet" class="mw-tab px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap transition-colors">Grade Sheet</button>
            </div>
            <div id="mw-content" class="flex-1 min-w-0 bg-transparent rounded-xl p-0 overflow-y-auto flex flex-col">
            </div>
        </div>
    `;
    switchMarkwiseTab('mark-detailed');
}

function switchMarkwiseTab(type) {
    document.querySelectorAll('.mw-tab').forEach(el => {
        el.classList.remove('text-blue-600', 'border-blue-600', 'font-semibold');
        el.classList.add('text-gray-500', 'border-transparent', 'font-medium');
    });
    const activeTab = document.getElementById(`mw-tab-${type}`);
    if(activeTab) {
        activeTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        activeTab.classList.add('text-blue-600', 'border-blue-600', 'font-semibold');
    }
    renderLedger(document.getElementById('mw-content'), type);
}

var activeConversionTab = 'theory';
var conversionContext = null;

function renderMarksConversion(container) {
    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    let termOptions = state.terms.map(t => `<option value="${t}">${t}</option>`).join('');

    container.innerHTML = `
        <div class="fade-in flex flex-col h-full gap-4">
            <div class="flex overflow-x-auto border-b border-gray-200 bg-white hide-scrollbar shrink-0 no-print rounded-lg shadow-sm">
                <button class="conv-tab px-5 py-2.5 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap transition-colors cursor-default">Theory Mark Convert</button>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg border flex flex-col md:flex-row gap-3 items-end shrink-0 no-print">
                <div class="w-full md:w-1/4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Term</label>
                    <select id="conv-term" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">${termOptions}</select>
                </div>
                <div class="w-full md:w-1/4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Class</label>
                    <select id="conv-class" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500" onchange="updateConvSubject()">
                        <option value="">Select Class</option>
                        ${classOptions}
                    </select>
                </div>
                <div class="w-full md:w-1/4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                    <select id="conv-subject" class="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Class First</option>
                    </select>
                </div>
                <div class="w-full md:w-1/4">
                    <button onclick="loadConversionData()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">Load Marks</button>
                </div>
            </div>

            <div id="conv-settings-bar" class="hidden bg-white p-4 border rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0 border-blue-200 no-print">
                <div class="flex items-center gap-4 w-full sm:w-auto justify-center">
                    <div class="text-center">
                        <label class="block text-xs font-bold text-gray-700 mb-1">Exam Taken Out Of</label>
                        <input type="number" id="conv-base-fm" class="border border-gray-300 p-1.5 rounded-lg w-28 text-center text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" oninput="updateConversionPreview()">
                    </div>
                    <div class="pt-4"><i class="fas fa-exchange-alt text-blue-400 text-xl"></i></div>
                    <div class="text-center">
                        <label class="block text-xs font-bold text-blue-700 mb-1">Convert To (Target FM)</label>
                        <input type="number" id="conv-target-fm" class="border border-blue-300 p-1.5 rounded-lg w-28 text-center text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50" oninput="updateConversionPreview()">
                    </div>
                </div>
                <button onclick="executeMarksConversion()" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors">
                    <i class="fas fa-magic"></i> Convert & Save
                </button>
            </div>

            <div id="conversion-content" class="flex-1 min-w-0 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col hidden">
                <div class="p-3 bg-gray-50 border-b flex justify-between items-center shrink-0">
                    <h3 class="font-bold text-gray-700 text-sm" id="conv-list-title">Conversion List</h3>
                </div>
                <div class="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 relative">
                    <table class="w-full text-sm text-left whitespace-nowrap min-w-max">
                        <thead class="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 shadow-sm z-10">
                            <tr>
                                <th class="px-4 py-3 border text-center w-16 bg-gray-100">S.N.</th>
                                <th class="px-4 py-3 border min-w-[120px] bg-gray-100">Symbol No</th>
                                <th class="px-4 py-3 border min-w-[200px] bg-gray-100">Student Name</th>
                                <th class="px-4 py-3 border text-center bg-blue-50 text-blue-800" id="conv-orig-th">Original Mark</th>
                                <th class="px-4 py-3 border text-center bg-green-50 text-green-800" id="conv-new-th">Converted Mark</th>
                            </tr>
                        </thead>
                        <tbody id="conv-tbody"></tbody>
                    </table>
                </div>
            </div>
            
            <div id="conv-placeholder" class="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300 flex-1 flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-exchange-alt text-2xl text-blue-400"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-700 mb-2" id="conv-ph-title">Theory Mark Conversion</h3>
                <p class="text-sm text-gray-500 max-w-sm mx-auto">Select Term, Class, and Subject to load marks and begin the conversion process.</p>
            </div>
        </div>
    `;
    activeConversionTab = 'theory';
}

function updateConvSubject() {
    const cls = document.getElementById('conv-class').value;
    const subSelect = document.getElementById('conv-subject');
    if(!cls) {
        subSelect.innerHTML = '<option value="">Select Subject</option>';
        return;
    }
    const subjects = getSubjectsForClass(cls);
    subSelect.innerHTML = '<option value="">Select Subject</option>' + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
}

function loadConversionData() {
    const term = document.getElementById('conv-term').value;
    const cls = document.getElementById('conv-class').value;
    const sub = document.getElementById('conv-subject').value;

    if(!term || !cls || !sub) {
        showToast("Please select Term, Class, and Subject.", "error");
        return;
    }

    const clsStudents = state.students.filter(s => s.className === cls);
    if(clsStudents.length === 0) {
        showToast("No students found in this class.", "error");
        return;
    }

    let divs = (state.examSettings.markDivisions && state.examSettings.markDivisions[cls] && state.examSettings.markDivisions[cls][sub]) || [{category: 'Theory', name: 'TH', fm: 100, pm: 35}];
    
    let targetIndices = [];
    let totalCategoryFm = 0;
    
    divs.forEach((d, idx) => {
        const isTheory = d.category === 'Theory';
        if(isTheory) {
            targetIndices.push(idx);
            totalCategoryFm += Number(d.fm);
        }
    });

    if(targetIndices.length === 0) {
        showToast(`No Theory components configured for ${sub} in Mark Divisions.`, "error");
        return;
    }

    let data = [];
    clsStudents.forEach(student => {
        const markRecord = state.marks.find(m => m.studentId === student.id && m.term === term && m.subject === sub);
        let originalSum = 0;
        let hasMark = false;

        if (markRecord && markRecord.components) {
            targetIndices.forEach(idx => {
                if (markRecord.components[idx] !== undefined && markRecord.components[idx] !== '') {
                    originalSum += Number(markRecord.components[idx]);
                    hasMark = true;
                }
            });
        }

        data.push({
            student,
            hasMark,
            originalSum
        });
    });

    conversionContext = {
        term, cls, sub, targetIndices, totalCategoryFm, data, divs
    };

    document.getElementById('conv-base-fm').value = totalCategoryFm;
    document.getElementById('conv-target-fm').value = totalCategoryFm;
    document.getElementById('conv-orig-th').innerHTML = `Original Marks <br><span class="text-xs font-normal text-gray-500">(Total FM: ${totalCategoryFm})</span>`;

    renderConversionTable();

    document.getElementById('conv-settings-bar').classList.remove('hidden');
    document.getElementById('conversion-content').classList.remove('hidden');
    document.getElementById('conv-placeholder').classList.add('hidden');
    
    document.getElementById('conv-list-title').innerText = `${cls} - ${sub} (Theory)`;
}

function renderConversionTable() {
    if(!conversionContext) return;
    const tbody = document.getElementById('conv-tbody');
    const targetFm = Number(document.getElementById('conv-target-fm').value) || 0;
    const baseFm = Number(document.getElementById('conv-base-fm').value) || 1; 

    document.getElementById('conv-new-th').innerHTML = `Converted Marks <br><span class="text-xs font-normal text-green-600">(New FM: ${targetFm})</span>`;

    let html = '';
    conversionContext.data.sort((a,b) => a.student.name.localeCompare(b.student.name)).forEach((row, idx) => {
        let convertedMark = '-';
        if(row.hasMark) {
            convertedMark = ((row.originalSum / baseFm) * targetFm).toFixed(2);
        }

        html += `
            <tr class="border-b bg-white hover:bg-gray-50">
                <td class="px-4 py-2 border text-center text-gray-500">${idx + 1}</td>
                <td class="px-4 py-2 border font-medium text-gray-700">${row.student.symbolNo || '-'}</td>
                <td class="px-4 py-2 border font-semibold text-gray-800">${row.student.name}</td>
                <td class="px-4 py-2 border text-center font-bold text-gray-700 bg-gray-50">${row.hasMark ? row.originalSum : '<span class="text-red-400">N/A</span>'}</td>
                <td class="px-4 py-2 border text-center font-bold text-blue-700 bg-blue-50/30">${row.hasMark ? convertedMark : '<span class="text-red-400">N/A</span>'}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function updateConversionPreview() {
    renderConversionTable();
}

function executeMarksConversion() {
    if(!conversionContext) return;
    const targetFm = Number(document.getElementById('conv-target-fm').value) || 0;
    const baseFm = Number(document.getElementById('conv-base-fm').value) || 1;

    if (targetFm <= 0) {
        showToast("Target FM must be greater than 0.", "error");
        return;
    }

    let updatedCount = 0;

    conversionContext.data.forEach(row => {
        if(!row.hasMark) return;

        const markRecordIndex = state.marks.findIndex(m => m.studentId === row.student.id && m.term === conversionContext.term && m.subject === conversionContext.sub);
        
        if(markRecordIndex > -1) {
            let markRecord = state.marks[markRecordIndex];
            
            if (!markRecord.originalComponents) {
                markRecord.originalComponents = JSON.parse(JSON.stringify(markRecord.components));
            } else {
                conversionContext.targetIndices.forEach(idx => {
                    if (markRecord.originalComponents[idx] === undefined) {
                        markRecord.originalComponents[idx] = markRecord.components[idx];
                    }
                });
            }

            let scaledTotal = (row.originalSum / baseFm) * targetFm;
            let newComponentSum = 0;

            conversionContext.targetIndices.forEach((cIdx, loopIndex, arr) => {
                let divFm = Number(conversionContext.divs[cIdx].fm);
                let ratio = divFm / conversionContext.totalCategoryFm; 
                let scaledComponentVal = scaledTotal * ratio;
                scaledComponentVal = Math.round(scaledComponentVal * 100) / 100;
                
                if (loopIndex === arr.length - 1) {
                    scaledComponentVal = scaledTotal - newComponentSum;
                    scaledComponentVal = Math.round(scaledComponentVal * 100) / 100;
                }

                markRecord.components[cIdx] = scaledComponentVal;
                newComponentSum += scaledComponentVal;
            });

            let newTotalMarks = 0;
            for (let key in markRecord.components) {
                if(markRecord.components[key] !== '' && markRecord.components[key] !== undefined) {
                    newTotalMarks += Number(markRecord.components[key]);
                }
            }
            markRecord.marks = newTotalMarks;
            updatedCount++;
        }
    });

    showToast(`Successfully converted and saved marks for ${updatedCount} students.`, "success");
    loadConversionData(); 
}

var activeLedgerType = '';
var ledgerTheorySource = 'converted';
var ledgerInternalSource = 'original';

function updateLedgerSource() {
    if(document.getElementById('ledger-th-source')) {
        ledgerTheorySource = document.getElementById('ledger-th-source').value;
    }
    ledgerInternalSource = 'original'; 
    
    const term = document.getElementById('ledger-term')?.value;
    const cls = document.getElementById('ledger-class')?.value;
    if (term && cls) {
        generateLedger(activeLedgerType);
    }
}

function renderLedger(container, type) {
    activeLedgerType = type;

    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    let termOptions = state.terms.map(t => `<option value="${t}">${t}</option>`).join('');
    
    let title = 'Gradewise Ledger';
    if (type === 'mark-detailed') title = 'Markwise Ledger';
    if (type === 'mark-consolidated') title = 'Mark wise Result';
    if (type === 'grade-consolidated') title = 'Grade wise Result';
    if (type === 'grade-sheet') title = 'Grade Sheet';

    const icon = type.startsWith('mark') ? 'fa-list-ol' : 'fa-star-half-alt';
    const isTabular = type !== 'grade-sheet';

    container.innerHTML = `
        <div class="fade-in max-w-full flex flex-col h-full">
            <div class="flex flex-col sm:flex-row gap-3 mb-4 no-print bg-gray-50 p-3 sm:p-4 rounded-lg border items-start sm:items-center shrink-0 flex-wrap">
                <select id="ledger-term" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px]">
                    <option value="">Select Term</option>${termOptions}
                </select>
                <select id="ledger-class" class="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px]">
                    <option value="">Select Class</option>${classOptions}
                </select>
                <button onclick="generateLedger('${type}')" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm justify-center">
                    Generate
                </button>
                ${isTabular ? `
                <div class="flex gap-2 w-full sm:w-auto sm:ml-auto">
                    <button onclick="exportLedgerToExcel('${type}')" class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <i class="fas fa-file-excel"></i> Export
                    </button>
                    <button onclick="window.print()" class="flex-1 sm:flex-none bg-gray-800 hover:bg-black text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
                ` : ''}
                
                <div class="w-full mt-2 pt-3 border-t border-gray-200 flex flex-wrap gap-4 items-center" id="ledger-mode-filters">
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-bold text-gray-700">Theory Data Source:</label>
                        <select id="ledger-th-source" onchange="updateLedgerSource()" class="px-3 py-1.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium text-blue-700 border-blue-200 shadow-sm">
                            <option value="original" ${ledgerTheorySource === 'original' ? 'selected' : ''}>Original Mark</option>
                            <option value="converted" ${ledgerTheorySource === 'converted' ? 'selected' : ''}>Converted Mark</option>
                        </select>
                    </div>
                </div>
            </div>

            <div id="ledger-table-container" class="bg-white rounded-lg shadow-sm ${isTabular ? 'border overflow-x-auto overflow-y-auto' : 'overflow-y-auto'} custom-scrollbar flex-1 relative print-section">
                <div class="text-center py-12 text-gray-400">
                    <i class="fas ${icon} text-4xl mb-3 opacity-50"></i>
                    <p>Select Term and Class to view ${title}</p>
                </div>
            </div>
        </div>
    `;
}

function generateLedger(type) {
    const term = document.getElementById('ledger-term').value;
    const cls = document.getElementById('ledger-class').value;
    const container = document.getElementById('ledger-table-container');

    if(!term || !cls) { showToast('Please select both Term and Class', 'error'); return; }

    const clsStudents = state.students.filter(s => s.className === cls);
    if(clsStudents.length === 0) {
        container.innerHTML = '<p class="text-center py-8 text-gray-500">No students in this class.</p>';
        return;
    }

    const isHigherClass = isClassHigher(cls);
    let subjects = getSubjectsForClass(cls);

    if(subjects.length === 0) {
        container.innerHTML = '<p class="text-center py-8 text-yellow-600"><i class="fas fa-exclamation-circle mr-2"></i> No exam subjects configured for this class. Please configure them in the "Sub Management" tab first.</p>';
        return;
    }

    const getDivisions = (sub) => {
        let rawDivs = [];
        if (state.examSettings.markDivisions && state.examSettings.markDivisions[cls] && state.examSettings.markDivisions[cls][sub]) {
            rawDivs = state.examSettings.markDivisions[cls][sub];
        } else {
            rawDivs = [{ category: 'Theory', name: 'TH', fm: 100, pm: 35 }];
        }
        return rawDivs.map((d, i) => ({ ...d, originalIndex: i }));
    };

    const getSubjectFm = (sub) => {
        const divs = getDivisions(sub);
        return divs.reduce((acc, d) => acc + d.fm, 0);
    };

    const getMarkVal = (markObj, divData) => {
        if(!markObj) return undefined;
        const isTheory = divData.category === 'Theory';
        const activeSource = isTheory ? ledgerTheorySource : ledgerInternalSource;

        if (activeSource === 'original') {
            if (markObj.originalComponents && markObj.originalComponents[divData.originalIndex] !== undefined) {
                return markObj.originalComponents[divData.originalIndex];
            }
        }
        return markObj.components ? markObj.components[divData.originalIndex] : undefined;
    };

    const getConsolidatedDivisions = (sub) => {
        const divs = getDivisions(sub);
        let th = { category: 'Theory', name: 'TH', fm: 0, pm: 0, originalIndices: [], divReferences: [] };
        let int = { category: 'Internal', name: 'IN', fm: 0, pm: 0, originalIndices: [], divReferences: [] };
        
        divs.forEach(d => {
            if (d.category === 'Theory') {
                th.fm += d.fm; th.pm += d.pm; th.originalIndices.push(d.originalIndex); th.divReferences.push(d);
            } else {
                int.fm += d.fm; int.pm += d.pm; int.originalIndices.push(d.originalIndex); int.divReferences.push(d);
            }
        });
        
        let result = [];
        if (th.fm > 0) result.push(th);
        if (int.fm > 0) result.push(int);
        return result;
    };

    let studentData = clsStudents.map((student) => {
        let rowData = { student, marks: {}, total: 0, gpaSum: 0, validSubjectsCount: 0, hasNG: false };
        
        let mySubs = isHigherClass 
            ? ((state.examSettings.studentSubjects && state.examSettings.studentSubjects[student.id]) || [])
            : subjects;

        subjects.forEach(sub => {
            if (isHigherClass && !mySubs.includes(sub)) {
                rowData.marks[sub] = 'N/A';
            } else {
                const markRecord = state.marks.find(m => m.studentId === student.id && m.term === term && m.subject === sub);
                
                if (markRecord) {
                    rowData.marks[sub] = {
                        components: markRecord.components || {},
                        originalComponents: markRecord.originalComponents || {}
                    };
                    
                    const divs = getDivisions(sub);
                    let subTotal = 0;
                    divs.forEach(d => {
                        let val = getMarkVal(rowData.marks[sub], d);
                        if (val !== undefined && val !== '') subTotal += Number(val);
                    });
                    
                    rowData.marks[sub].total = subTotal;
                    rowData.total += subTotal;

                    if (type === 'grade-consolidated' || type === 'grade-sheet') {
                        const cDivs = getConsolidatedDivisions(sub);
                        rowData.marks[sub].gradeParts = {};
                        
                        let subTotalGPA = 0;
                        let subFmGPA = 0;
                        let subHasNG = false;
                        let hasAnyMark = false;

                        cDivs.forEach(cDiv => {
                            let partTotal = 0;
                            let hasPartMark = false;
                            cDiv.divReferences.forEach(dRef => {
                                let val = getMarkVal(rowData.marks[sub], dRef);
                                if (val !== undefined && val !== '') {
                                    hasPartMark = true;
                                    hasAnyMark = true;
                                    partTotal += Number(val);
                                }
                            });
                            
                            let partGrade;
                            if (!hasPartMark) {
                                partGrade = { grade: 'NG', gpa: 0.0, textClass: 'text-red-400 font-bold', isNG: true };
                                subHasNG = true;
                            } else {
                                const partPercent = cDiv.fm > 0 ? (partTotal / cDiv.fm) * 100 : 0;
                                partGrade = getGradeInfo(partPercent, cls);
                                if (partGrade.isNG) subHasNG = true;
                            }
                            rowData.marks[sub].gradeParts[cDiv.name] = partGrade;
                            
                            subTotalGPA += partTotal;
                            subFmGPA += cDiv.fm;
                        });

                        if (hasAnyMark) {
                            rowData.validSubjectsCount++;
                            if (subHasNG) {
                                rowData.hasNG = true;
                                rowData.marks[sub].finalGrade = { grade: 'NG', gpa: 0.0, textClass: 'text-red-600 font-bold', isNG: true };
                            } else {
                                const subPercent = subFmGPA > 0 ? (subTotalGPA / subFmGPA) * 100 : 0;
                                const subGrade = getGradeInfo(subPercent, cls);
                                rowData.marks[sub].finalGrade = subGrade;
                                rowData.gpaSum += subGrade.gpa;
                            }
                        } else {
                            rowData.hasNG = true;
                        }
                    } else {
                        const subFm = getSubjectFm(sub);
                        const percent = subFm > 0 ? (subTotal / subFm) * 100 : 0;
                        let gradeInfo = getGradeInfo(percent, cls);
                        rowData.gpaSum += gradeInfo.gpa;
                        rowData.validSubjectsCount++;
                        if(gradeInfo.isNG) rowData.hasNG = true;
                    }
                } else {
                    rowData.marks[sub] = null;
                    rowData.hasNG = true; 
                }
                
                if (type !== 'grade-consolidated' && type !== 'grade-sheet') rowData.validSubjectsCount++; 
            }
        });

        let totalPossibleMarks = 0;
        subjects.forEach(sub => {
            if (!(isHigherClass && !mySubs.includes(sub))) {
                totalPossibleMarks += getSubjectFm(sub);
            }
        });

        rowData.percentage = totalPossibleMarks > 0 ? ((rowData.total / totalPossibleMarks) * 100).toFixed(2) : 0;
        rowData.finalGpa = rowData.validSubjectsCount > 0 ? (rowData.gpaSum / rowData.validSubjectsCount).toFixed(2) : '0.00';
        return rowData;
    });

    if(type === 'mark-detailed' || type === 'mark-consolidated') {
        studentData.sort((a, b) => b.total - a.total);
        studentData.forEach((sd, i) => sd.rank = (sd.validSubjectsCount > 0) ? i + 1 : '-');
    } else {
        studentData.sort((a, b) => a.student.name.localeCompare(b.student.name));
    }

    if (type === 'grade-sheet') {
        const sName = state.examSettings.schoolName || 'Shree Rasuwa Secondary School';
        const sAddress = state.examSettings.schoolAddress || 'Gosaikunda RM-6, Dhunche, Rasuwa';
        const aYear = state.examSettings.academicYear || new Date().getFullYear() + 56;
        const examTitleStr = `${term} Examination - ${aYear}`;
        
        const imgs = state.examSettings.images || {};
        const logoImg = imgs.logo ? `<img src="${imgs.logo}" style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%;">` : `
            <svg viewBox="0 0 100 100" style="width: 80px; height: 80px;">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#000" stroke-width="2"/>
                <text x="50" y="55" font-size="20" text-anchor="middle" font-family="Arial" font-weight="bold">RSS</text>
            </svg>`;

        const getCreditHourForSubject = (className, subject) => {
            if(!state.examSettings.creditHours) return 4;
            for(const level in state.examSettings.creditHours) {
                const classNumMatch = className.match(/\d+/);
                if(classNumMatch) {
                    const classNum = parseInt(classNumMatch[0]);
                    let match = false;
                    if(level.includes(classNum.toString())) match = true;
                    else if (classNum >= 1 && classNum <= 3 && level.includes('1-3')) match = true;
                    else if (classNum >= 4 && classNum <= 5 && level.includes('4-5')) match = true;
                    else if (classNum >= 6 && classNum <= 8 && level.includes('6-8')) match = true;
                    else if (classNum >= 9 && classNum <= 10 && level.includes('9-10')) match = true;
                    else if (classNum >= 11 && classNum <= 12 && level.includes('11-12')) match = true;

                    if(match && state.examSettings.creditHours[level] && state.examSettings.creditHours[level][subject] !== undefined) {
                        return state.examSettings.creditHours[level][subject];
                    }
                }
            }
            return 4;
        };

        let sheetsHtml = studentData.map(sd => {
            let trs = subjects.map((sub, idx) => {
                let mySubs = isHigherClass ? ((state.examSettings.studentSubjects && state.examSettings.studentSubjects[sd.student.id]) || []) : subjects;
                if (isHigherClass && !mySubs.includes(sub)) return '';
                
                const markObj = sd.marks[sub];
                const ch = getCreditHourForSubject(cls, sub);
                
                let thGrade = '-', inGrade = '-', finalGrade = '-', gradePoint = '-';
                if (markObj && markObj !== 'N/A' && markObj !== null) {
                    thGrade = markObj.gradeParts?.TH?.grade || '-';
                    inGrade = markObj.gradeParts?.IN?.grade || '-';
                    finalGrade = markObj.finalGrade?.grade || 'NG';
                    gradePoint = markObj.finalGrade?.gpa ? markObj.finalGrade.gpa.toFixed(2) : '0.00';
                } else if (markObj === null) {
                    finalGrade = 'NG';
                    gradePoint = '0.00';
                    thGrade = 'NG';
                    inGrade = 'NG';
                }

                return `
                    <tr>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${idx + 1}</td>
                        <td style="border: 1px solid #000; padding: 6px;">${sub}</td>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${ch}</td>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${thGrade}</td>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${inGrade}</td>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${finalGrade}</td>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${gradePoint}</td>
                    </tr>
                `;
            }).join('');

            return `
                <div class="page-break mx-auto" style="width: 21cm; min-height: 29.7cm; padding: 2cm; background: white; margin-bottom: 20px; box-sizing: border-box; border: 1px solid #e5e7eb; position: relative; color: #000; font-family: 'Times New Roman', Times, serif;">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
                        <div style="width: 90px; flex-shrink: 0; text-align: center;">${logoImg}</div>
                        <div style="text-align: center; flex-grow: 1;">
                            <h1 style="font-size: 26px; font-weight: bold; margin: 0; text-transform: uppercase;">${sName}</h1>
                            <p style="font-size: 14px; margin: 5px 0;">${sAddress}</p>
                            <h2 style="font-size: 16px; font-weight: bold; margin: 5px 0; text-transform: uppercase;">${examTitleStr}</h2>
                            <h3 style="font-size: 18px; font-weight: bold; margin: 15px 0 0 0; text-decoration: underline;">GRADE SHEET</h3>
                        </div>
                        <div style="width: 90px; flex-shrink: 0;"></div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 15px;">
                        <div><strong>Name of the Student:</strong> ${sd.student.name}</div>
                        <div style="text-align: right;"><strong>Class:</strong> ${sd.student.className}</div>
                        <div><strong>Date of Birth:</strong> ${sd.student.dob || '-'}</div>
                        <div style="text-align: right;"><strong>Symbol No:</strong> ${sd.student.symbolNo || '-'}</div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                        <thead style="background-color: #f9fafb;">
                            <tr>
                                <th rowspan="2" style="border: 1px solid #000; padding: 8px; width: 50px;">S.N.</th>
                                <th rowspan="2" style="border: 1px solid #000; padding: 8px; text-align: left;">Subjects</th>
                                <th rowspan="2" style="border: 1px solid #000; padding: 8px; width: 80px;">Credit Hour</th>
                                <th colspan="2" style="border: 1px solid #000; padding: 8px;">Obtained Grade</th>
                                <th rowspan="2" style="border: 1px solid #000; padding: 8px; width: 80px;">Final Grade</th>
                                <th rowspan="2" style="border: 1px solid #000; padding: 8px; width: 80px;">Grade Point</th>
                            </tr>
                            <tr>
                                <th style="border: 1px solid #000; padding: 4px; width: 60px;">TH</th>
                                <th style="border: 1px solid #000; padding: 4px; width: 60px;">IN</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trs}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold;">Grade Point Average (GPA):</td>
                                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">${(sd.hasNG || sd.validSubjectsCount === 0) ? '-' : sd.finalGpa}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="font-size: 15px; margin-bottom: 40px; border: 1px solid #000; padding: 10px; background-color: #f9fafb;">
                        <strong>Result/Remarks:</strong> ${(sd.hasNG || sd.validSubjectsCount === 0) ? '<span style="color: red; font-weight:bold;">Not Graded (NG)</span>' : '<span style="color: green; font-weight:bold;">Passed</span>'}
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 100px; padding: 0 20px; font-size: 14px; font-weight: bold;">
                        <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 180px;">Class Teacher</div>
                        <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 180px;">Head Teacher / Principal</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="px-4 py-4 text-center print-section" style="width: 100%;">
                <div class="no-print mb-4 flex justify-end">
                    <button onclick="window.print()" class="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
                        <i class="fas fa-print"></i> Print Grade Sheets
                    </button>
                </div>
                <div class="grade-sheet-container text-left" style="background: #f3f4f6; padding: 20px 0; overflow-y: auto;">
                    ${sheetsHtml}
                </div>
            </div>
        `;
        return; 
    }

    let theadHtml = '';
    if (type === 'mark-detailed' || type === 'mark-consolidated' || type === 'grade-consolidated') {
        theadHtml += `
            <thead class="bg-gray-100 text-gray-700 text-xs uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                    <th rowspan="2" class="px-2 py-2 border text-center">S.N.</th>
                    <th rowspan="2" class="px-3 py-2 border text-center min-w-[100px]">Symbol No</th>
                    <th rowspan="2" class="px-3 py-2 border text-left min-w-[150px]">Student Name</th>
        `;
        subjects.forEach(sub => {
            const divs = (type === 'mark-consolidated' || type === 'grade-consolidated') ? getConsolidatedDivisions(sub) : getDivisions(sub);
            theadHtml += `<th colspan="${divs.length}" class="px-2 py-1 border text-center bg-gray-200" title="${sub}">${sub}</th>`;
        });
        
        if (type === 'grade-consolidated') {
            theadHtml += `
                    <th rowspan="2" class="px-2 py-2 border text-center bg-gray-200">FINAL GPA</th>
                    <th rowspan="2" class="px-2 py-2 border text-center bg-gray-200">STATUS</th>
                </tr>
                <tr>
            `;
        } else {
            theadHtml += `
                    <th rowspan="2" class="px-2 py-2 border text-center bg-gray-200">Total</th>
                    <th rowspan="2" class="px-2 py-2 border text-center bg-gray-200">%</th>
                    <th rowspan="2" class="px-2 py-2 border text-center bg-gray-200">Rank</th>
                </tr>
                <tr>
            `;
        }

        subjects.forEach(sub => {
            const divs = (type === 'mark-consolidated' || type === 'grade-consolidated') ? getConsolidatedDivisions(sub) : getDivisions(sub);
            divs.forEach(d => {
                theadHtml += `<th class="px-1 py-1 border text-center text-[10px]" title="${d.name} (FM:${d.fm}, PM:${d.pm})">${d.name.substring(0,3)}<br><span class="text-gray-500 normal-case font-medium">FM:${d.fm}</span></th>`;
            });
        });
        theadHtml += `</tr></thead>`;
    }

    let tbodyHtml = studentData.map((sd, i) => {
        let sRow = `
            <tr class="hover:bg-gray-50 text-xs bg-white">
                <td class="px-2 py-1.5 border text-center text-gray-500">${i+1}</td>
                <td class="px-3 py-1.5 border font-medium text-gray-600 text-center">${sd.student.symbolNo || '-'}</td>
                <td class="px-3 py-1.5 border font-semibold truncate max-w-[150px]">${sd.student.name}</td>
        `;

        subjects.forEach(sub => {
            const markObj = sd.marks[sub];
            if (markObj === 'N/A') {
                const divs = (type === 'mark-consolidated' || type === 'grade-consolidated') ? getConsolidatedDivisions(sub) : getDivisions(sub);
                divs.forEach(() => sRow += `<td class="px-1 py-1 border text-center text-gray-300 bg-gray-50">-</td>`);
            } else if (markObj === null) {
                const divs = (type === 'mark-consolidated' || type === 'grade-consolidated') ? getConsolidatedDivisions(sub) : getDivisions(sub);
                divs.forEach(() => sRow += `<td class="px-1 py-1 border text-center text-red-400 font-bold">${type === 'grade-consolidated' ? 'NG' : 'A'}</td>`);
            } else {
                if (type === 'mark-detailed') {
                    const divs = getDivisions(sub);
                    divs.forEach(d => {
                        let val = getMarkVal(markObj, d);
                        let displayMark = (val !== undefined && val !== '') ? (Math.round(val * 100) / 100) : '<span class="text-gray-300">-</span>';
                        let textColor = (val !== undefined && val !== '' && Number(val) < Number(d.pm)) ? 'text-red-600 font-bold' : 'text-gray-800';
                        sRow += `<td class="px-1 py-1 border text-center ${textColor}">${displayMark}</td>`;
                    });
                } else if (type === 'mark-consolidated') {
                    const cDivs = getConsolidatedDivisions(sub);
                    cDivs.forEach(cDiv => {
                        let sum = 0;
                        let hasVal = false;
                        cDiv.divReferences.forEach(dRef => {
                            let val = getMarkVal(markObj, dRef);
                            if (val !== undefined && val !== '') {
                                hasVal = true;
                                sum += Number(val);
                            }
                        });
                        let displayMark = hasVal ? (Math.round(sum * 100) / 100) : '<span class="text-gray-300">-</span>';
                        let textColor = (hasVal && sum < cDiv.pm) ? 'text-red-600 font-bold' : 'text-gray-800';
                        sRow += `<td class="px-1 py-1 border text-center ${textColor}">${displayMark}</td>`;
                    });
                } else if (type === 'grade-consolidated') {
                    const cDivs = getConsolidatedDivisions(sub);
                    cDivs.forEach(cDiv => {
                        const partGrade = markObj.gradeParts[cDiv.name];
                        if (partGrade) {
                            sRow += `<td class="px-1 py-1 border text-center ${partGrade.textClass}">${partGrade.grade}</td>`;
                        } else {
                            sRow += `<td class="px-1 py-1 border text-center text-gray-300">-</td>`;
                        }
                    });
                }
            }
        });

        if(type === 'mark-detailed' || type === 'mark-consolidated') {
            sRow += `
                <td class="px-2 py-1.5 border text-center font-bold text-gray-800 bg-gray-50">${Math.round(sd.total * 100) / 100}</td>
                <td class="px-2 py-1.5 border text-center font-semibold text-gray-600">${sd.percentage}</td>
                <td class="px-2 py-1.5 border text-center text-blue-700 font-bold">${sd.rank}</td>
            `;
        } else if (type === 'grade-consolidated') {
            let status = (sd.hasNG || sd.validSubjectsCount === 0)
                ? '<span class="text-red-600 font-bold">NG</span>'
                : '<span class="text-green-600 font-bold">PASS</span>';
            sRow += `
                <td class="px-2 py-1.5 border text-center font-bold text-blue-800 bg-gray-50">${(sd.hasNG || sd.validSubjectsCount===0) ? '-' : sd.finalGpa}</td>
                <td class="px-2 py-1.5 border text-center">${status}</td>
            `;
        }

        sRow += '</tr>';
        return sRow;
    }).join('');

    let reportTitle = 'GRADEWISE LEDGER';
    if (type === 'mark-detailed') reportTitle = 'MARKWISE LEDGER';
    if (type === 'mark-consolidated') reportTitle = 'MARK WISE RESULT';
    if (type === 'grade-consolidated') reportTitle = 'GRADE WISE RESULT';
    
    const sName = state.examSettings.schoolName || 'Shree Rasuwa Secondary School';

    container.innerHTML = `
        <div class="px-4 py-4 text-center print-section">
            <h2 class="text-lg font-bold uppercase">${sName}</h2>
            <h3 class="text-sm font-bold text-gray-700 underline">${reportTitle}</h3>
            <p class="text-xs font-semibold text-gray-500 mt-1">Class: ${cls} | Term: ${term}</p>
        </div>
        <table id="ledger-main-table" class="w-full text-left border-collapse border border-gray-300 mt-1 min-w-max whitespace-nowrap">
            ${theadHtml}
            <tbody>${tbodyHtml}</tbody>
        </table>
    `;
}

function exportLedgerToExcel(type) {
    const table = document.getElementById('ledger-main-table');
    if(!table) { 
        showToast('Please generate a ledger first before exporting.', 'error'); 
        return; 
    }
    
    const term = document.getElementById('ledger-term').value || 'Term';
    const cls = document.getElementById('ledger-class').value || 'Class';
    
    let reportType = 'Ledger';
    if(type === 'mark-detailed') reportType = 'MarkLedger';
    if(type === 'mark-consolidated') reportType = 'MarkwiseResult';
    if(type === 'grade-consolidated') reportType = 'GradewiseResult';
    
    const wb = XLSX.utils.table_to_book(table, {sheet: "Ledger"});
    XLSX.writeFile(wb, `${reportType}_${cls}_${term}.xlsx`);
    showToast('Excel file downloaded successfully!', 'success');
}

function renderViewResults(container) {
     container.innerHTML = `
        <div class="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 text-center fade-in">
            <div class="text-blue-500 mb-4"><i class="fas fa-chart-line text-5xl"></i></div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-700 mb-2">Result Analytics Dashboard</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto mb-6">Detailed analytical charts and visual performance reports will be dynamically generated here based on ledger data.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 w-full sm:w-auto min-w-[150px]">
                    <div class="text-2xl font-bold text-blue-700">${state.students.length}</div>
                    <div class="text-xs text-blue-500 uppercase font-semibold">Total Students</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-100 w-full sm:w-auto min-w-[150px]">
                    <div class="text-2xl font-bold text-green-700">${state.marks.length}</div>
                    <div class="text-xs text-green-500 uppercase font-semibold">Mark Records</div>
                </div>
            </div>
        </div>
    `;
}

function renderStudentAttendance(container) {
    const isAdmin = state.currentUser.role === 'admin';
    let availableClasses = isAdmin ? state.classes : (state.currentUser.classTeacherOf || []);
    let classOptions = availableClasses.map(c => `<option value="${c}">${c}</option>`).join('');
    
    let monthOptions = state.months.map(m => `<option value="${m}">${m}</option>`).join('');
    let currentYear = state.examSettings.academicYear || new Date().getFullYear() + 56;

    const html = `
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-4 fade-in flex flex-col sm:flex-row gap-3 items-end shrink-0">
            <div class="w-full sm:w-[15%]">
                <label class="block text-xs font-medium text-gray-700 mb-1">Year (B.S.)</label>
                <input type="text" id="att-year" value="${currentYear}" readonly class="w-full p-2 border rounded-lg text-sm bg-gray-100 text-gray-600 outline-none cursor-not-allowed">
            </div>
            <div class="w-full sm:w-[35%] flex gap-2">
                <div class="w-1/2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">From Month</label>
                    <select id="att-month-from" class="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all" onchange="document.getElementById('att-month-to').value = this.value">
                        ${monthOptions}
                    </select>
                </div>
                <div class="w-1/2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">To Month</label>
                    <select id="att-month-to" class="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all">
                        ${monthOptions}
                    </select>
                </div>
            </div>
            <div class="w-full sm:w-[25%]">
                <label class="block text-xs font-medium text-gray-700 mb-1">Class</label>
                <select id="att-class" class="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all">
                    <option value="">Select Class</option>
                    ${classOptions}
                </select>
            </div>
            <div class="w-full sm:w-[25%] flex gap-2">
                <button onclick="loadAttendanceList()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Load List</button>
            </div>
        </div>

        <div id="attendance-table-container" class="hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden fade-in flex flex-col min-h-[400px]">
            <div class="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-3 shrink-0">
                <h3 class="font-semibold text-gray-800 text-sm sm:text-base truncate" id="attendance-list-title">Attendance List</h3>
                <div class="flex gap-2 w-full sm:w-auto" id="att-action-container">
                </div>
            </div>
            
            <div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative">
                <table class="w-full text-sm text-left whitespace-nowrap border-collapse min-w-max" id="attendance-table">
                    <thead class="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10 shadow-sm" id="att-thead">
                    </thead>
                    <tbody id="att-tbody"></tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

var currentAttendanceContext = null;

function loadAttendanceList() {
    const year = document.getElementById('att-year').value;
    const monthFrom = document.getElementById('att-month-from').value;
    const monthTo = document.getElementById('att-month-to').value;
    const cls = document.getElementById('att-class').value;
    
    if(!year || !monthFrom || !monthTo || !cls) {
        showToast("Please select Year, Months, and Class", "error");
        return;
    }

    const fromIdx = state.months.indexOf(monthFrom);
    const toIdx = state.months.indexOf(monthTo);
    
    if (fromIdx > toIdx) {
        showToast("'From Month' cannot be later than 'To Month'", "error");
        return;
    }

    const selectedMonths = state.months.slice(fromIdx, toIdx + 1);
    const isRange = selectedMonths.length > 1;

    const students = state.students.filter(s => s.className === cls);
    const container = document.getElementById('attendance-table-container');
    const tbody = document.getElementById('att-tbody');
    const thead = document.getElementById('att-thead');

    if(students.length === 0) {
        showToast("No students found in this class", "error");
        container.classList.add('hidden');
        return;
    }

    const isAdmin = state.currentUser.role === 'admin';
    const canEdit = !isAdmin && !isRange; 
    
    let actionButtons = '';
    if (!canEdit) {
        actionButtons = `<button onclick="exportAttendanceExcel()" class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors"><i class="fas fa-file-excel"></i> Export Report</button>`;
    } else {
         actionButtons = `<button onclick="exportAttendanceExcel()" class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors"><i class="fas fa-file-excel"></i> Export</button>
           <button onclick="saveAttendance()" class="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors"><i class="fas fa-save"></i> Save</button>`;
    }

    document.getElementById('att-action-container').innerHTML = actionButtons;

    currentAttendanceContext = { year, monthFrom, monthTo, cls, students, selectedMonths, canEdit };
    document.getElementById('attendance-list-title').innerText = isRange ? `${cls} - ${monthFrom} to ${monthTo} ${year}` : `${cls} - ${monthFrom} ${year}`;
    
    let theadHtml = '';
    if (isRange) {
        theadHtml += `<tr>
            <th class="px-4 py-3 border bg-gray-100">S.N.</th>
            <th class="px-4 py-3 border min-w-[120px] bg-gray-100">Student ID</th>
            <th class="px-4 py-3 border min-w-[180px] bg-gray-100">Student Name</th>
        `;
        selectedMonths.forEach(m => {
            theadHtml += `<th class="px-3 py-3 border text-center bg-gray-200">${m.toUpperCase()}</th>`;
        });
        theadHtml += `<th class="px-3 py-3 border text-center bg-blue-100">OVERALL PRESENT</th></tr>`;
    } else {
        theadHtml += `<tr>
            <th class="px-4 py-3 border">S.N.</th>
            <th class="px-4 py-3 border min-w-[120px]">Student ID</th>
            <th class="px-4 py-3 border min-w-[180px]">Student Name</th>
            <th class="px-4 py-3 border text-center w-32">Present Days</th>
        </tr>`;
    }
    thead.innerHTML = theadHtml;

    let tbodyHtml = '';
    students.forEach((s, idx) => {
        let rowHtml = `
            <tr class="hover:bg-gray-50 border-b">
                <td class="px-4 py-2 border text-center text-gray-500">${idx + 1}</td>
                <td class="px-4 py-2 border font-medium text-gray-700">${s.id}</td>
                <td class="px-4 py-2 border font-semibold text-gray-900">${s.name}</td>
        `;

        if (isRange) {
            let presentSum = 0, hasData = false;
            selectedMonths.forEach(m => {
                const record = state.attendance.find(a => a.studentId === s.id && a.year === year && a.month === m);
                if (record && record.presentDays !== '' && record.presentDays !== undefined) {
                    hasData = true;
                    const p = parseInt(record.presentDays) || 0;
                    presentSum += p;
                    rowHtml += `<td class="px-3 py-2 border text-center font-medium">${p}</td>`;
                } else {
                    rowHtml += `<td class="px-3 py-2 border text-center text-gray-300">-</td>`;
                }
            });
            rowHtml += `<td class="px-3 py-2 border text-center font-bold bg-blue-50/50">${hasData ? presentSum : '-'}</td>`;
        } else {
            const m = selectedMonths[0];
            const record = state.attendance.find(a => a.studentId === s.id && a.year === year && a.month === m);
            const p = record && record.presentDays !== undefined ? record.presentDays : '';

            let presentInput = !canEdit
                ? `<span class="font-medium text-gray-800">${p !== '' ? p : '-'}</span>`
                : `<input type="number" min="0" class="att-present-days w-full px-2 py-1.5 border rounded text-center text-sm focus:ring-1 focus:ring-blue-500 outline-none" data-sid="${s.id}" value="${p}" placeholder="Enter days">`;

            rowHtml += `<td class="px-2 py-2 border text-center bg-white">${presentInput}</td>`;
        }

        rowHtml += `</tr>`;
        tbodyHtml += rowHtml;
    });

    tbody.innerHTML = tbodyHtml;
    container.classList.remove('hidden');
}

function saveAttendance() {
    if(!currentAttendanceContext || !currentAttendanceContext.canEdit) return;
    const { year, monthFrom, students } = currentAttendanceContext;
    const month = monthFrom; 
    let savedCount = 0;

    students.forEach(s => {
        const presentEl = document.querySelector(`.att-present-days[data-sid="${s.id}"]`);
        
        if(presentEl && presentEl.value !== '') {
            const presentDays = parseInt(presentEl.value) || 0;
            const existingIdx = state.attendance.findIndex(a => a.studentId === s.id && a.year === year && a.month === month);
            
            if(existingIdx > -1) {
                state.attendance[existingIdx].presentDays = presentDays;
            } else {
                state.attendance.push({
                    studentId: s.id,
                    year,
                    month,
                    presentDays
                });
            }
            savedCount++;
        }
    });

    showToast(`Saved attendance for ${savedCount} students`, "success");
}

function exportAttendanceExcel() {
    if(!currentAttendanceContext) {
        showToast("Please load data first", "error");
        return;
    }
    
    const { year, monthFrom, monthTo, cls, students, selectedMonths, canEdit } = currentAttendanceContext;
    const isRange = selectedMonths.length > 1;
    let exportData = [];

    students.forEach((s, idx) => {
        let rowObj = {
            "S.N.": idx + 1,
            "Student ID": s.id,
            "Student Name": s.name,
            "Class": cls,
            "Year (BS)": year
        };

        if (isRange) {
            let presentDaysSum = 0, hasData = false;
            selectedMonths.forEach(m => {
                const record = state.attendance.find(a => a.studentId === s.id && a.year === year && a.month === m);
                if (record && record.presentDays !== '' && record.presentDays !== undefined) {
                    hasData = true;
                    let p = parseInt(record.presentDays) || 0;
                    presentDaysSum += p;
                    rowObj[`${m} (Present)`] = p;
                } else {
                    rowObj[`${m} (Present)`] = '-';
                }
            });
            
            rowObj["Overall Present Days"] = hasData ? presentDaysSum : '-';
        } else {
            let presentVal = '';
            
            if (!canEdit) {
                const record = state.attendance.find(a => a.studentId === s.id && a.year === year && a.month === monthFrom);
                if (record && record.presentDays !== '' && record.presentDays !== undefined) {
                    presentVal = parseInt(record.presentDays) || 0;
                } else {
                    presentVal = '-';
                }
            } else {
                const presentEl = document.querySelector(`.att-present-days[data-sid="${s.id}"]`);
                presentVal = presentEl && presentEl.value !== '' ? presentEl.value : '-';
            }
            
            rowObj["Month"] = monthFrom;
            rowObj["Present Days"] = presentVal;
        }
        
        exportData.push(rowObj);
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Data");
    
    const monthStr = isRange ? `${monthFrom}_to_${monthTo}` : monthFrom;
    const filename = `Attendance_${cls.replace(/\s+/g, '_')}_${monthStr}_${year}.xlsx`;
    XLSX.writeFile(workbook, filename);
    showToast("Exported to Excel successfully!", "success");
}
