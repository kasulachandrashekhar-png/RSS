// portal_core.js
var state = {
    currentUser: null,
    adminPassword: 'admin',
    students: [], 
    teachers: [], 
    marks: [], 
    attendance: [], 
    classes: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    subjects: ['Comp. Nepali', 'Comp. English', 'Comp. Math', 'Comp. Science', 'Comp. Social Studies'],
    terms: ['First Term', 'Second Term', 'Final Term'],
    months: ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'],
    gradeRules: [
        {
            id: 'scale-1',
            name: 'Basic Level (1-8)',
            classes: ['Class 8'],
            rules: [
                { min: 90, max: 100, grade: 'A+', gpa: 4.0, color: 'text-green-600' },
                { min: 80, max: 89.99, grade: 'A', gpa: 3.6, color: 'text-green-500' },
                { min: 70, max: 79.99, grade: 'B+', gpa: 3.2, color: 'text-blue-600' },
                { min: 60, max: 69.99, grade: 'B', gpa: 2.8, color: 'text-blue-500' },
                { min: 50, max: 59.99, grade: 'C+', gpa: 2.4, color: 'text-yellow-600' },
                { min: 40, max: 49.99, grade: 'C', gpa: 2.0, color: 'text-orange-500' },
                { min: 35, max: 39.99, grade: 'D', gpa: 1.6, color: 'text-orange-600' },
                { min: 0, max: 34.99, grade: 'NG', gpa: 0.0, color: 'text-red-600' }
            ]
        },
        {
            id: 'scale-2',
            name: 'Secondary Level (9-12)',
            classes: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
            rules: [
                { min: 90, max: 100, grade: 'A+', gpa: 4.0, color: 'text-green-600' },
                { min: 80, max: 89.99, grade: 'A', gpa: 3.6, color: 'text-green-500' },
                { min: 70, max: 79.99, grade: 'B+', gpa: 3.2, color: 'text-blue-600' },
                { min: 60, max: 69.99, grade: 'B', gpa: 2.8, color: 'text-blue-500' },
                { min: 50, max: 59.99, grade: 'C+', gpa: 2.4, color: 'text-yellow-600' },
                { min: 40, max: 49.99, grade: 'C', gpa: 2.0, color: 'text-orange-500' },
                { min: 35, max: 39.99, grade: 'D', gpa: 1.6, color: 'text-orange-600' },
                { min: 0, max: 34.99, grade: 'NG', gpa: 0.0, color: 'text-red-600' }
            ]
        }
    ],
    examSettings: {
        routines: {}, 
        routineDates: [''],
        routineIncludedClasses: [],
        markDivisions: {},
        images: {},
        schoolName: 'Shree Rasuwa Secondary School',
        schoolAddress: 'Gosaikunda RM-6, Dhunche, Rasuwa',
        estdYear: '2014 B.S.',
        academicYear: '2083'
    } 
};
window.state = state;

function initDummyData() {
    if(state.teachers.length === 0) {
        state.teachers.push({
            id: 'T1', username: 'cha000', password: '9841000000',
            fullName: 'Chandra Shekhar Kasula',
            contact: '9841000000',
            assignments: [{className: 'Class 10', subject: 'Comp. Math'}, {className: 'Class 10', subject: 'Comp. Science'}],
            classTeacherOf: ['Class 10']
        });
    }
}

const STORAGE_KEY = 'rss_exam_portal_state_v1';
const SESSION_KEY = 'rss_exam_portal_session_v1';
var saveTimer = null;
var lastSavedAt = null;

function persistableState() {
    const { currentUser, ...rest } = state;
    return rest;
}

function saveState(immediate) {
    const doSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState()));
            lastSavedAt = new Date();
            updateSaveIndicator();
        } catch (err) {
            console.error('Auto-save failed:', err);
            updateSaveIndicator(true);
        }
    };
    if (immediate) { doSave(); return; }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 600);
}

function updateSaveIndicator(failed) {
    const el = document.getElementById('save-indicator');
    if (!el) return;
    if (failed) {
        el.innerHTML = '<i class="fas fa-exclamation-triangle text-red-400"></i> <span>Save failed</span>';
        return;
    }
    if (!lastSavedAt) { el.innerHTML = ''; return; }
    const timeStr = lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    el.innerHTML = `<i class="fas fa-check-circle text-green-400"></i> <span>Saved ${timeStr}</span>`;
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            Object.keys(saved).forEach(key => { state[key] = saved[key]; });
            return true;
        }
    } catch (err) {
        console.error('Failed to load saved data:', err);
    }
    return false;
}

function loadSession() {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) { state.currentUser = JSON.parse(raw); return true; }
    } catch (err) { /* ignore */ }
    return false;
}

function saveSession() {
    try {
        if (state.currentUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify(state.currentUser));
        else sessionStorage.removeItem(SESSION_KEY);
    } catch (err) { /* ignore */ }
}

function exportBackup() {
    const payload = { exportedAt: new Date().toISOString(), data: persistableState() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateTag = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = `RSS_Exam_Portal_Backup_${dateTag}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded successfully!', 'success');
}

function triggerRestore() {
    document.getElementById('restore-file-input').click();
}

function handleRestoreFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            const data = parsed.data || parsed;
            if (!data || typeof data !== 'object') throw new Error('Invalid file');
            if (!confirm('Restoring will overwrite all current data (students, teachers, marks, settings) with the backup file. Continue?')) return;
            Object.keys(data).forEach(key => { state[key] = data[key]; });
            saveState(true);
            showToast('Backup restored successfully! Reloading...', 'success');
            setTimeout(() => location.reload(), 1200);
        } catch (err) {
            console.error(err);
            showToast('Invalid or corrupted backup file.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetAllData() {
    if (!confirm('This will permanently erase ALL data (students, teachers, marks, settings) from this browser. This cannot be undone. Continue?')) return;
    if (!confirm('Are you absolutely sure? Consider downloading a backup first.')) return;
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    showToast('All data cleared. Reloading...', 'info');
    setTimeout(() => location.reload(), 1000);
}

// Load any previously saved data before dummy data is seeded
const hadSavedData = loadState();
if (!state.adminPassword) state.adminPassword = 'admin';
if (!Array.isArray(state.teachers)) state.teachers = [];
if (!Array.isArray(state.students)) state.students = [];
if (!Array.isArray(state.marks)) state.marks = [];
if (!state.examSettings || typeof state.examSettings !== 'object') state.examSettings = {};
if (!state.examSettings.routines || typeof state.examSettings.routines !== 'object') state.examSettings.routines = {};
if (!Array.isArray(state.examSettings.routineDates) || state.examSettings.routineDates.length === 0) state.examSettings.routineDates = [''];
initDummyData();
if (!hadSavedData) saveState(true);

setInterval(() => saveState(true), 20000);
window.addEventListener('beforeunload', () => saveState(true));

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('-translate-x-full');
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function closeSidebarOnMobile() {
    if (window.innerWidth < 1024) { 
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }
}

function showToast(message, type = 'success') {
    saveState();
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const bgColors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.className = `${bgColors[type]} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 fade-in max-w-xs sm:max-w-sm ml-auto`;
    toast.innerHTML = `<i class="fas ${icons[type]} text-lg shrink-0"></i><span class="text-sm font-medium leading-tight">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const numToWords = (n) => {
    if (n === 0) return 'Zero';
    let num = n.toString();
    if (num.match(/^[0-9]+$/) === null) return 'Not a number';
    num = num.replace(/^0+/, '');
    if (num === '') return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const formatTens = (numStr) => {
        let n = parseInt(numStr);
        if (n < 20) return a[n];
        return b[numStr[0]] + (numStr[1] === '0' ? ' ' : ' ' + a[numStr[1]]);
    };
    const formatHundreds = (numStr) => {
        let n = parseInt(numStr);
        if (n === 0) return '';
        if (n < 100) return formatTens(n.toString().padStart(2, '0'));
        let res = a[numStr[0]] + 'Hundred ';
        let remainder = parseInt(numStr.substr(1));
        if (remainder > 0) {
            res += 'and ' + formatTens(remainder.toString().padStart(2, '0'));
        }
        return res;
    };
    let words = '';
    if (num.length > 9) return 'Number too large'; 
    let crore = 0, lakh = 0, thousand = 0, hundred = 0;
    if (num.length > 7) {
        crore = parseInt(num.substr(0, num.length - 7));
        num = num.substr(num.length - 7);
    }
    if (num.length > 5) {
        lakh = parseInt(num.substr(0, num.length - 5));
        num = num.substr(num.length - 5);
    }
    if (num.length > 3) {
        thousand = parseInt(num.substr(0, num.length - 3));
        num = num.substr(num.length - 3);
    }
    hundred = parseInt(num);
    if (crore > 0) words += formatTens(crore.toString().padStart(2, '0')) + 'Crore ';
    if (lakh > 0) words += formatTens(lakh.toString().padStart(2, '0')) + 'Lakh ';
    if (thousand > 0) words += formatTens(thousand.toString().padStart(2, '0')) + 'Thousand ';
    if (hundred > 0) words += formatHundreds(hundred.toString().padStart(3, '0'));
    return words.trim();
};

function switchLoginTab(role) {
    document.getElementById('login-role').value = role;
    const tabAdmin = document.getElementById('tab-admin');
    const tabTeacher = document.getElementById('tab-teacher');
    const hint = document.getElementById('login-hint');
    if (role === 'admin') {
        tabAdmin.className = "flex-1 py-2 text-sm font-semibold rounded-md bg-white shadow text-blue-600 transition-all";
        tabTeacher.className = "flex-1 py-2 text-sm font-semibold rounded-md text-gray-500 hover:text-gray-700 transition-all";
        hint.innerText = "Hint: Admin login is admin / admin";
    } else {
        tabTeacher.className = "flex-1 py-2 text-sm font-semibold rounded-md bg-white shadow text-blue-600 transition-all";
        tabAdmin.className = "flex-1 py-2 text-sm font-semibold rounded-md text-gray-500 hover:text-gray-700 transition-all";
        hint.innerText = "Hint: Use teacher credentials generated by Admin";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    if (role === 'admin') {
        if (user === 'admin' && pass === state.adminPassword) {
            state.currentUser = { role: 'admin', username: 'Administrator' };
            saveSession();
            loadApp();
        } else {
            showToast('Invalid Admin Credentials', 'error');
        }
    } else {
        const teacher = state.teachers.find(t => t.username === user && t.password === pass);
        if (teacher) {
            state.currentUser = { ...teacher, role: 'teacher' };
            saveSession();
            loadApp();
        } else {
            showToast('Invalid Teacher Credentials', 'error');
        }
    }
}

function logout() {
    state.currentUser = null;
    saveSession();
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showToast('Logged out successfully', 'info');
}

if (loadSession() && state.currentUser) {
    if (state.currentUser.role === 'teacher') {
        const freshTeacher = state.teachers.find(t => t.id === state.currentUser.id);
        if (freshTeacher) state.currentUser = { ...freshTeacher, role: 'teacher', impersonating: state.currentUser.impersonating };
        else state.currentUser = null;
    }
    if (state.currentUser) loadApp();
}

function loadApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    let roleDisplay = state.currentUser.role === 'admin' ? 'Admin Portal' : 'Teacher Portal';
    if (state.currentUser.impersonating) roleDisplay = 'Teacher View (Admin)';
    document.getElementById('user-role-display').innerText = roleDisplay;
    let dName = state.currentUser.username || state.currentUser.fullName;
    document.getElementById('logged-username').innerText = dName.length > 15 ? dName.substring(0,12)+'...' : dName;
    buildSidebar();
    updateSaveIndicator();
    if(state.currentUser.role === 'admin') {
        navigate('manage-students');
    } else {
        navigate('mark-entry');
    }
}

function buildSidebar() {
    const nav = document.getElementById('nav-menu');
    nav.innerHTML = '';
    let links = [];
    if (state.currentUser.role === 'admin') {
        links = [
            { id: 'manage-students', icon: 'fa-users', text: 'Manage Students' },
            { id: 'manage-teachers', icon: 'fa-chalkboard-teacher', text: 'Manage Teachers' },
            { id: 'admin-teacher-view', icon: 'fa-user-secret', text: 'Teacher View' },
            { id: 'manage-academic', icon: 'fa-book', text: 'Classes & Subjects' },
            { 
                id: 'manage-exam-group', 
                icon: 'fa-file-alt', 
                text: 'Manage Exam',
                isGroup: true,
                children: [
                    { id: 'subject-management', text: 'Subject Management' },
                    { id: 'exam-process', text: 'Exam' },
                    { id: 'result-mgmt', text: 'Result' }
                ]
            },
            { id: 'grade-rules', icon: 'fa-star', text: 'Grade Sheet Rules' },
            { id: 'view-results', icon: 'fa-chart-bar', text: 'View Results' },
            { id: 'student-attendance', icon: 'fa-calendar-check', text: 'Attendance Report' },
            { id: 'upload-settings', icon: 'fa-upload', text: 'Settings & Media' }
        ];
    } else {
        links = [
            { id: 'mark-entry', icon: 'fa-edit', text: 'Enter Marks' },
            { id: 'my-classes', icon: 'fa-book-open', text: 'My Assignments' },
            { id: 'profile-settings', icon: 'fa-user-cog', text: 'Profile Settings' }
        ];
        if (state.currentUser.classTeacherOf && state.currentUser.classTeacherOf.length > 0) {
            links.splice(1, 0, { id: 'student-attendance', icon: 'fa-calendar-check', text: 'Student Attendance' });
        }
    }

    links.forEach(link => {
        if (link.isGroup) {
            const groupDiv = document.createElement('div');
            const a = document.createElement('a');
            a.href = '#';
            a.id = `nav-group-${link.id}`;
            a.className = 'flex items-center justify-between px-6 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors cursor-pointer';
            a.onclick = (e) => { 
                e.preventDefault(); 
                toggleNavGroup(link.id);
            };
            a.innerHTML = `<div class="flex items-center gap-3"><i class="fas ${link.icon} w-5 text-center"></i> <span class="text-sm font-medium">${link.text}</span></div><i class="fas fa-chevron-down text-xs transition-transform duration-200" id="icon-${link.id}"></i>`;
            
            const childContainer = document.createElement('div');
            childContainer.id = `children-${link.id}`;
            childContainer.className = 'hidden flex-col bg-blue-900/50';

            link.children.forEach(child => {
                const ca = document.createElement('a');
                ca.href = '#';
                ca.id = `nav-${child.id}`;
                ca.className = 'flex items-center gap-3 pl-14 pr-6 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white transition-colors border-l-4 border-transparent text-sm cursor-pointer';
                ca.onclick = (e) => { 
                    e.preventDefault(); 
                    navigate(child.id); 
                };
                ca.innerHTML = `<span>${child.text}</span>`;
                childContainer.appendChild(ca);
            });
            groupDiv.appendChild(a);
            groupDiv.appendChild(childContainer);
            nav.appendChild(groupDiv);
        } else {
            const a = document.createElement('a');
            a.href = '#';
            a.id = `nav-${link.id}`;
            a.className = 'flex items-center gap-3 px-6 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors border-l-4 border-transparent cursor-pointer';
            a.onclick = (e) => { 
                e.preventDefault(); 
                navigate(link.id); 
            };
            a.innerHTML = `<i class="fas ${link.icon} w-5 text-center"></i> <span class="text-sm font-medium">${link.text}</span>`;
            nav.appendChild(a);
        }
    });

    if (state.currentUser.impersonating) {
        const returnBtn = document.createElement('a');
        returnBtn.href = '#';
        returnBtn.className = 'flex items-center gap-3 px-6 py-3 mt-4 text-yellow-100 hover:bg-yellow-700 hover:text-white transition-colors border-l-4 border-yellow-400 bg-yellow-600 mx-2 rounded shadow-md cursor-pointer';
        returnBtn.onclick = (e) => { e.preventDefault(); returnToAdmin(); };
        returnBtn.innerHTML = `<i class="fas fa-undo w-5 text-center"></i> <span class="text-sm font-bold">Return to Admin</span>`;
        nav.appendChild(returnBtn);
    }
}

function toggleNavGroup(groupId) {
    const container = document.getElementById(`children-${groupId}`);
    const icon = document.getElementById(`icon-${groupId}`);
    if(container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        container.classList.add('flex');
        icon.style.transform = 'rotate(180deg)';
    } else {
        container.classList.add('hidden');
        container.classList.remove('flex');
        icon.style.transform = 'rotate(0deg)';
    }
}

function navigate(pageId) {
    closeSidebarOnMobile(); 
    document.querySelectorAll('#nav-menu a').forEach(el => {
        if(!el.id.startsWith('nav-group-')) {
            el.classList.remove('bg-blue-800', 'border-white', 'text-white');
            el.classList.add('text-blue-100', 'border-transparent');
            if (el.parentElement && el.parentElement.id.startsWith('children-')) {
                el.classList.add('text-blue-200'); 
            }
        }
    });
    const activeNav = document.getElementById(`nav-${pageId}`);
    if(activeNav) {
        activeNav.classList.add('bg-blue-800', 'border-white', 'text-white');
        activeNav.classList.remove('text-blue-100', 'border-transparent', 'text-blue-200');
        if (activeNav.parentElement && activeNav.parentElement.id.startsWith('children-')) {
            activeNav.parentElement.classList.remove('hidden');
            activeNav.parentElement.classList.add('flex');
            const groupId = activeNav.parentElement.id.replace('children-', '');
            const icon = document.getElementById(`icon-${groupId}`);
            if(icon) icon.style.transform = 'rotate(180deg)';
        }
    }

    const content = document.getElementById('content-area');
    content.innerHTML = '<div class="flex justify-center items-center h-full text-blue-500"><i class="fas fa-spinner fa-spin text-3xl"></i></div>'; 
    
    const titles = {
        'manage-students': 'Student Management',
        'manage-teachers': 'Teacher Management',
        'admin-teacher-view': 'Teacher Impersonation',
        'manage-academic': 'Classes & Subjects',
        'subject-management': 'Subject Management',
        'exam-process': 'Exam Process',
        'result-mgmt': 'Result Management',
        'grade-rules': 'Grade Sheet Rules',
        'view-results': 'Results Overview',
        'student-attendance': state.currentUser.role === 'admin' ? 'Student Attendance Report' : 'Student Attendance',
        'upload-settings': 'Settings & Media',
        'mark-entry': 'Student Mark Entry',
        'my-classes': 'My Assigned Classes',
        'profile-settings': 'Profile Settings'
    };
    document.getElementById('page-title').innerText = titles[pageId] || 'Dashboard';

    setTimeout(() => {
        switch(pageId) {
            case 'manage-students': renderManageStudents(content); break;
            case 'manage-teachers': renderManageTeachers(content); break;
            case 'admin-teacher-view': renderAdminTeacherView(content); break;
            case 'manage-academic': renderManageAcademic(content); break;
            case 'subject-management': renderSubjectManagement(content); break;
            case 'exam-process': renderExamProcess(content); break;
            case 'result-mgmt': renderResultMgmt(content); break;
            case 'grade-rules': renderGradeRules(content); break;
            case 'view-results': renderViewResults(content); break;
            case 'student-attendance': renderStudentAttendance(content); break;
            case 'upload-settings': renderUploadSettings(content); break;
            case 'mark-entry': renderMarkEntry(content); break;
            case 'my-classes': renderMyClasses(content); break;
            case 'profile-settings': renderProfileSettings(content); break;
        }
    }, 100);
}
