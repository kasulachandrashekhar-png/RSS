// portal_students_teachers.js

var editingStudentId = null;
var confirmDeleteStudentId = null;

function renderManageStudents(container) {
    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    
    const html = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 fade-in mb-6">
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 flex flex-col justify-between">
                <div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2">Upload Data (Excel/CSV)</h3>
                    <p class="text-xs text-gray-500 mb-4">Columns: Student Id, FullName, Gender, CurrentClass, DOB</p>
                </div>
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onclick="document.getElementById('excel-file').click()">
                    <i class="fas fa-file-excel text-3xl sm:text-4xl text-green-600 mb-2"></i>
                    <input type="file" id="excel-file" accept=".xlsx, .xls, .csv" class="hidden" onchange="handleExcelUpload(event)">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full mt-2">
                        Browse File
                    </button>
                </div>
            </div>

            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">Add Student Manually</h3>
                <form id="add-student-form" onsubmit="handleAddStudent(event)" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Student Id *</label>
                        <input type="text" id="add-s-id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. 2900...">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" id="add-s-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Full Name">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                        <select id="add-s-gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Class *</label>
                        <select id="add-s-class" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                            <option value="">Select Class</option>
                            ${classOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">DOB</label>
                        <input type="text" id="add-s-dob" placeholder="YYYY-MM-DD" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm h-[38px] flex items-center justify-center gap-2">
                            <i class="fas fa-user-plus"></i> Add
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden fade-in flex flex-col" style="animation-delay: 0.1s; max-height: calc(100vh - 350px); min-height: 300px;">
            <div class="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-3 sm:gap-4 shrink-0">
                <div class="flex items-center gap-2 sm:gap-3">
                    <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Student Records</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap" id="student-count">0</span>
                </div>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div class="relative w-full sm:w-48 lg:w-56">
                        <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
                        <input type="text" id="search-student" onkeyup="updateStudentTable()" placeholder="Search ID or Name..." class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    </div>
                    <select id="filter-class" onchange="updateStudentTable()" class="w-full sm:w-32 lg:w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="ALL">All Classes</option>
                        ${classOptions}
                    </select>
                </div>
            </div>
            <div class="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 relative">
                <table class="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="px-4 sm:px-6 py-3 min-w-[120px]">Student Id</th>
                            <th class="px-4 sm:px-6 py-3 min-w-[150px]">Full Name</th>
                            <th class="px-4 sm:px-6 py-3">Gender</th>
                            <th class="px-4 sm:px-6 py-3">Class</th>
                            <th class="px-4 sm:px-6 py-3">DOB</th>
                            <th class="px-4 sm:px-6 py-3 text-right sticky right-0 bg-gray-100 z-10 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="student-table-body">
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;
    updateStudentTable();
}

function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if(jsonData.length === 0) {
                showToast("The uploaded file is empty", "error");
                return;
            }

            let added = 0;
            let newClassesAdded = 0;
            
            jsonData.forEach((row) => {
                const studentId = row['Student Id'] || row['Student ID'] || row['student id'];
                const fullName = row['FullName'] || row['Full Name'] || row['name'];
                const gender = row['Gender'] || row['gender'];
                const currentClass = row['CurrentClass'] || row['Current Class'] || row['Class'];
                const dob = row['DOB'] || row['dob'];

                if (studentId && fullName && currentClass) {
                    const rawClassStr = String(currentClass).trim();
                    const isNumeric = !isNaN(rawClassStr) && !isNaN(parseFloat(rawClassStr));
                    const finalClassName = isNumeric ? `Class ${rawClassStr}` : (rawClassStr.toLowerCase().startsWith('class') ? rawClassStr : rawClassStr);

                    if(!state.students.find(s => s.id === String(studentId))) {
                        state.students.push({
                            id: String(studentId),
                            name: fullName,
                            className: finalClassName,
                            gender: gender || '-',
                            dob: dob || '-'
                        });
                        added++;
                    }

                    if (!state.classes.includes(finalClassName)) {
                        state.classes.push(finalClassName);
                        newClassesAdded++;
                    }
                }
            });

            if (newClassesAdded > 0) {
                state.classes.sort((a, b) => {
                    const numA = parseInt(a.replace(/[^0-9]/g, '')) || 999;
                    const numB = parseInt(b.replace(/[^0-9]/g, '')) || 999;
                    if (numA !== numB) return numA - numB;
                    return a.localeCompare(b);
                });
            }

            showToast(`Successfully uploaded ${added} students! ${newClassesAdded > 0 ? '(' + newClassesAdded + ' classes auto-added)' : ''}`, "success");
            renderManageStudents(document.getElementById('content-area'));
        } catch(error) {
            console.error(error);
            showToast("Error parsing Excel file. Check format.", "error");
        }
    };
    reader.readAsArrayBuffer(file);
}

function handleAddStudent(e) {
    e.preventDefault();
    const id = document.getElementById('add-s-id').value.trim();
    const name = document.getElementById('add-s-name').value.trim();
    const gender = document.getElementById('add-s-gender').value;
    const className = document.getElementById('add-s-class').value;
    const dob = document.getElementById('add-s-dob').value.trim();

    if (state.students.find(s => s.id === id)) {
        showToast("A student with this ID already exists!", "error");
        return;
    }

    state.students.unshift({ id, name, gender, className, dob }); 
    showToast("Student added successfully", "success");
    
    document.getElementById('filter-class').value = className;
    document.getElementById('search-student').value = ''; 
    document.getElementById('add-student-form').reset();
    updateStudentTable();
}

function updateStudentTable() {
    const tbody = document.getElementById('student-table-body');
    const searchInput = document.getElementById('search-student');
    const classFilter = document.getElementById('filter-class');
    if(!tbody) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedClass = classFilter ? classFilter.value : 'ALL';

    const filteredStudents = state.students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.id.toLowerCase().includes(searchTerm);
        const matchesClass = selectedClass === 'ALL' || s.className === selectedClass;
        return matchesSearch && matchesClass;
    });

    tbody.innerHTML = '';
    
    if(filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400">No students found matching criteria.</td></tr>';
    } else {
        filteredStudents.forEach(s => {
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b hover:bg-gray-50';
            
            if (confirmDeleteStudentId === s.id) {
                tr.innerHTML = `
                    <td colspan="6" class="px-4 py-3 bg-red-50 text-center border-red-200">
                        <div class="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <span class="text-sm font-medium text-red-700"><i class="fas fa-exclamation-triangle mr-1"></i> Delete ${s.name}?</span>
                            <div class="flex gap-2">
                                <button onclick="executeDeleteStudent('${s.id}')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">Yes, Delete</button>
                                <button onclick="cancelDeleteStudent()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-xs font-medium transition-colors">Cancel</button>
                            </div>
                        </div>
                    </td>
                `;
            } else if (editingStudentId === s.id) {
                tr.innerHTML = `
                    <td class="px-2 py-2 min-w-[120px]"><input type="text" value="${s.id}" class="w-full px-2 py-1 border rounded text-sm bg-gray-100 text-gray-500 cursor-not-allowed" disabled></td>
                    <td class="px-2 py-2 min-w-[150px]"><input type="text" id="edit-s-name" value="${s.name}" class="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"></td>
                    <td class="px-2 py-2">
                        <select id="edit-s-gender" class="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                            <option value="Male" ${s.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${s.gender === 'Female' ? 'selected' : ''}>Female</option>
                        </select>
                    </td>
                    <td class="px-2 py-2 min-w-[100px]">
                        <select id="edit-s-class" class="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                            ${state.classes.map(c => `<option value="${c}" ${s.className === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </td>
                    <td class="px-2 py-2 min-w-[100px]"><input type="text" id="edit-s-dob" value="${s.dob !== '-' ? s.dob : ''}" class="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"></td>
                    <td class="px-2 py-2 text-right sticky right-0 bg-gray-50 z-10 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)]">
                        <button onclick="saveEditStudent('${s.id}')" class="text-green-600 hover:text-green-800 bg-green-100 p-1.5 rounded mr-1" title="Save"><i class="fas fa-check"></i></button>
                        <button onclick="cancelEditStudent()" class="text-gray-500 hover:text-gray-700 bg-gray-200 p-1.5 rounded" title="Cancel"><i class="fas fa-times"></i></button>
                    </td>
                `;
            } else {
                tr.innerHTML = `
                    <td class="px-4 sm:px-6 py-3 font-medium text-gray-900">${s.id}</td>
                    <td class="px-4 sm:px-6 py-3 truncate max-w-[200px]" title="${s.name}">${s.name}</td>
                    <td class="px-4 sm:px-6 py-3">${s.gender || '-'}</td>
                    <td class="px-4 sm:px-6 py-3">
                        <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100 whitespace-nowrap">${s.className}</span>
                    </td>
                    <td class="px-4 sm:px-6 py-3">${s.dob || '-'}</td>
                    <td class="px-4 sm:px-6 py-3 text-right sticky right-0 bg-white group-hover:bg-gray-50 z-10 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.05)]">
                        <button onclick="startEditStudent('${s.id}')" class="text-blue-500 hover:text-blue-700 transition-colors p-1 mr-1" title="Edit"><i class="fas fa-edit text-lg"></i></button>
                        <button onclick="startDeleteStudent('${s.id}')" class="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete"><i class="fas fa-trash text-lg"></i></button>
                    </td>
                `;
            }
            tbody.appendChild(tr);
        });
    }
    const countEl = document.getElementById('student-count');
    if(countEl) countEl.innerText = `${filteredStudents.length} Students`;
}

function startEditStudent(id) { editingStudentId = id; confirmDeleteStudentId = null; updateStudentTable(); }
function cancelEditStudent() { editingStudentId = null; updateStudentTable(); }
function saveEditStudent(id) {
    const name = document.getElementById('edit-s-name').value.trim();
    const gender = document.getElementById('edit-s-gender').value;
    const className = document.getElementById('edit-s-class').value;
    const dob = document.getElementById('edit-s-dob').value.trim();

    if(!name) { showToast("Name is required", "error"); return; }
    const student = state.students.find(s => s.id === id);
    if(student) {
        student.name = name;
        student.gender = gender;
        student.className = className;
        student.dob = dob;
        showToast("Student details updated", "success");
    }
    editingStudentId = null;
    updateStudentTable();
}

function startDeleteStudent(id) { confirmDeleteStudentId = id; editingStudentId = null; updateStudentTable(); }
function cancelDeleteStudent() { confirmDeleteStudentId = null; updateStudentTable(); }
function executeDeleteStudent(id) {
    state.students = state.students.filter(s => s.id !== id);
    state.marks = state.marks.filter(m => m.studentId !== id);
    confirmDeleteStudentId = null;
    showToast("Student deleted successfully", "info");
    updateStudentTable();
}

function renderAdminTeacherView(container) {
    let teacherOptions = state.teachers.map(t => `<option value="${t.id}">${t.fullName || t.username}</option>`).join('');
    container.innerHTML = `
        <div class="fade-in max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 flex flex-col">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                    <i class="fas fa-user-secret"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800">Teacher View (Impersonation)</h2>
                <p class="text-sm text-gray-500 mt-2">Select a teacher from the list below to log in as them. You will have full access to their assigned modules (Mark Entry, Attendance, etc.).</p>
            </div>
            <div class="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Teacher to View As:</label>
                <select id="impersonate-teacher-id" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white shadow-sm">
                    <option value="">-- Choose a Teacher --</option>
                    ${teacherOptions}
                </select>
            </div>
            <button onclick="impersonateTeacher()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-sign-in-alt"></i> Switch to Teacher View
            </button>
        </div>
    `;
}

function impersonateTeacher() {
    const tId = document.getElementById('impersonate-teacher-id').value;
    if(!tId) { showToast("Please select a teacher first", "error"); return; }
    const teacher = state.teachers.find(t => t.id === tId);
    if(teacher) {
        state.currentUser = { ...teacher, role: 'teacher', impersonating: true };
        loadApp();
        showToast(`Switched to ${teacher.fullName || teacher.username}'s view`, 'info');
    }
}

function returnToAdmin() {
    state.currentUser = { role: 'admin', username: 'Administrator' };
    loadApp();
    showToast("Returned to Admin Portal", "info");
}

var editingTeacherId = null;
var confirmDeleteTeacherId = null;

function renderManageTeachers(container) {
    let classOptions = state.classes.map(c => `<option value="${c}">${c}</option>`).join('');
    let subjectOptions = state.subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    let teacherOptions = state.teachers.map(t => `<option value="${t.id}">${t.fullName || t.username}</option>`).join('');

    const html = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 fade-in h-full flex flex-col lg:grid">
            <div class="col-span-1 flex flex-col gap-4 sm:gap-6">
                
                <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2">Upload Teachers (Excel)</h3>
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onclick="document.getElementById('excel-teacher-file').click()">
                        <i class="fas fa-file-excel text-3xl sm:text-4xl text-green-600 mb-2"></i>
                        <input type="file" id="excel-teacher-file" accept=".xlsx, .xls, .csv" class="hidden" onchange="handleTeacherExcelUpload(event)">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full mt-2">
                            Browse File
                        </button>
                    </div>
                </div>

                <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">Assign Subject & Teacher</h3>
                    <form id="create-teacher-form" onsubmit="handleCreateTeacher(event)">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
                            <select id="t-select" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500" onchange="toggleNewTeacherFields()" required>
                                <option value="NEW" class="font-bold text-blue-600">+ Create New Teacher</option>
                                ${teacherOptions}
                            </select>
                        </div>

                        <div id="new-teacher-fields" class="block">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="t-fullname" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Chandra Shekhar Kasula">
                            </div>
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input type="tel" id="t-contact" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. 9841000000">
                            </div>
                        </div>
                        
                        <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                            <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Subject / Role Assignment</h4>
                            <div class="mb-3">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                                <select id="t-class" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" required>
                                    <option value="">Select Class</option>
                                    ${classOptions}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select id="t-subject" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                                    <option value="">-- No Subject (Class Teacher Only) --</option>
                                    ${subjectOptions}
                                </select>
                            </div>
                            <div class="flex items-center gap-2 mt-1">
                                <input type="checkbox" id="t-class-teacher" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer">
                                <label for="t-class-teacher" class="text-sm font-medium text-gray-700 cursor-pointer">Assign as Class Teacher for this class</label>
                            </div>
                        </div>
                        <button type="submit" id="submit-teacher-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm">
                            Create & Assign
                        </button>
                    </form>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 col-span-2 overflow-hidden flex flex-col min-h-[400px]">
                <div class="p-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
                    <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Teacher Directory & Assignments</h3>
                </div>
                <div class="flex-1 p-3 sm:p-4 overflow-y-auto custom-scrollbar">
                    <div class="grid gap-3 sm:gap-4" id="teacher-list-container"></div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
    updateTeacherList();
    toggleNewTeacherFields(); 
}

function generateTeacherCredentials(fullName, contactNum) {
    let cleanName = fullName.trim().toLowerCase();
    let firstName = cleanName.split(' ')[0] || 'tec';
    let prefix = firstName.replace(/[^a-z]/g, '').substr(0, 3);
    if(prefix.length < 3) prefix = prefix.padEnd(3, 'x');

    let cleanContact = String(contactNum || '').trim();
    let suffix = cleanContact.slice(-3);
    if(suffix.length < 3) suffix = '123';

    let username = prefix + suffix;
    let password = cleanContact || 'password123';
    return { username, password };
}

function handleTeacherExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            let added = 0;
            
            jsonData.forEach((row) => {
                const fullName = row['Full Name'] || row['FullName'] || row['name'] || row['Name'];
                const contact = row['Contact Number'] || row['Contact'] || row['contact number'] || row['Phone'];
                
                if (fullName) {
                    let creds = generateTeacherCredentials(fullName, contact);
                    let username = creds.username;
                    let password = creds.password;

                    let counter = 1;
                    let baseUser = username;
                    while(state.teachers.find(t => t.username === username)) {
                        username = baseUser + counter;
                        counter++;
                    }

                    state.teachers.push({
                        id: 'T' + Date.now() + Math.floor(Math.random() * 1000),
                        username: username,
                        password: password,
                        fullName: fullName,
                        contact: contact || '-',
                        assignments: []
                    });
                    added++;
                }
            });

            showToast(`Successfully uploaded ${added} teachers!`, "success");
            renderManageTeachers(document.getElementById('content-area'));
        } catch(error) {
            showToast("Error parsing Excel file.", "error");
        }
    };
    reader.readAsArrayBuffer(file);
}

function toggleNewTeacherFields() {
    const selectVal = document.getElementById('t-select').value;
    const fields = document.getElementById('new-teacher-fields');
    const nameIn = document.getElementById('t-fullname');
    const contactIn = document.getElementById('t-contact');
    const btn = document.getElementById('submit-teacher-btn');

    if(selectVal === 'NEW') {
        fields.classList.remove('hidden');
        if(nameIn) nameIn.setAttribute('required', 'true');
        if(contactIn) contactIn.setAttribute('required', 'true');
        btn.innerText = "Create & Assign";
    } else {
        fields.classList.add('hidden');
        if(nameIn) nameIn.removeAttribute('required');
        if(contactIn) contactIn.removeAttribute('required');
        btn.innerText = "Add Assignment Only";
    }
}

function handleCreateTeacher(e) {
    e.preventDefault();
    const selectId = document.getElementById('t-select').value;
    const className = document.getElementById('t-class').value;
    const subject = document.getElementById('t-subject').value;
    const isClassTeacher = document.getElementById('t-class-teacher').checked;

    if (!subject && !isClassTeacher) {
        showToast("Please assign a Subject or select 'Assign as Class Teacher'", "error");
        return;
    }

    if (isClassTeacher) {
        const existingCT = state.teachers.find(t => (t.classTeacherOf || []).includes(className) && t.id !== selectId);
        if (existingCT) {
            showToast(`${className} already has a Class Teacher (${existingCT.fullName}). Remove them first to reassign.`, 'error');
            return;
        }
    }

    if (subject) {
        let alreadyAssignedTo = null;
        for (const t of state.teachers) {
            if (t.assignments.some(a => a.className === className && a.subject === subject) && t.id !== selectId) {
                alreadyAssignedTo = t.fullName || t.username;
                break;
            }
        }
        if (alreadyAssignedTo) {
            showToast(`Warning: ${className} - ${subject} is already assigned to ${alreadyAssignedTo}!`, 'error');
            return;
        }
    }

    if(selectId === 'NEW') {
        const fullName = document.getElementById('t-fullname').value.trim();
        const contact = document.getElementById('t-contact').value.trim();
        
        let creds = generateTeacherCredentials(fullName, contact);
        let username = creds.username;
        let password = creds.password;
        
        let existing = state.teachers.find(t => t.username === username);
        if(existing) username += Math.floor(Math.random() * 10);

        state.teachers.push({
            id: 'T' + Date.now(),
            username, password, fullName, contact: contact || '-', 
            assignments: subject ? [{className, subject}] : [],
            classTeacherOf: isClassTeacher ? [className] : []
        });
        showToast(`Created teacher ${fullName}`, 'success');
        renderManageTeachers(document.getElementById('content-area')); 
        
    } else {
        let teacher = state.teachers.find(t => t.id === selectId);
        if(teacher) {
            if (!teacher.classTeacherOf) teacher.classTeacherOf = [];
            let actions = [];
            
            if (subject) {
                const exists = teacher.assignments.find(a => a.className === className && a.subject === subject);
                if(!exists) {
                    teacher.assignments.push({className, subject});
                    actions.push(`Subject (${subject})`);
                }
            }
            if (isClassTeacher && !teacher.classTeacherOf.includes(className)) {
                teacher.classTeacherOf.push(className);
                actions.push(`Class Teacher`);
            }
            
            if(actions.length > 0) {
                showToast(`Assigned ${actions.join(' & ')} to ${teacher.fullName}`, 'success');
            } else {
                showToast('Teacher already has this exact assignment', 'info');
            }
        }
        updateTeacherList();
        document.getElementById('t-class').value = '';
        document.getElementById('t-subject').value = '';
        document.getElementById('t-class-teacher').checked = false;
    }
}

function updateTeacherList() {
    const container = document.getElementById('teacher-list-container');
    if(!container) return;
    container.innerHTML = '';
    
    if(state.teachers.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-8">No teachers added yet.</p>';
        return;
    }

    state.teachers.forEach(t => {
        const ctBadges = (t.classTeacherOf || []).map((c) => 
            `<span class="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-1 rounded-md mb-1 inline-flex items-center gap-1 mr-1">
                <i class="fas fa-star text-[10px]"></i> CT: ${c}
                <button onclick="removeClassTeacher('${t.id}', '${c}')" class="text-red-400 hover:text-red-700 ml-1 flex-shrink-0" title="Remove"><i class="fas fa-times"></i></button>
            </span>`
        ).join('');

        const badges = t.assignments.map((a, idx) => 
            `<span class="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-md mb-1 inline-flex items-center gap-1 mr-1">
                <span class="truncate max-w-[120px]" title="${a.className} - ${a.subject}">${a.className} - ${a.subject}</span>
                <button onclick="removeAssignment('${t.id}', ${idx})" class="text-red-400 hover:text-red-700 ml-1 flex-shrink-0" title="Remove"><i class="fas fa-times"></i></button>
            </span>`
        ).join('');

        const div = document.createElement('div');
        div.className = 'border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow bg-white';
        
        if (editingTeacherId === t.id) {
            div.innerHTML = `
                <div class="flex-1 w-full">
                    <div class="flex flex-col gap-2 w-full">
                        <input type="text" id="edit-t-name-${t.id}" value="${t.fullName || ''}" class="px-3 py-2 border rounded text-sm w-full focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Full Name">
                        <div class="flex gap-2">
                            <input type="text" id="edit-t-user-${t.id}" value="${t.username}" class="px-3 py-2 border rounded text-sm w-1/2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Username">
                            <input type="text" id="edit-t-pass-${t.id}" value="${t.password}" class="px-3 py-2 border rounded text-sm w-1/2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Password">
                        </div>
                    </div>
                </div>
                <div class="flex sm:flex-col gap-2 mt-2 sm:mt-0 justify-end">
                    <button onclick="saveEditTeacher('${t.id}')" class="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-md text-sm font-medium flex-1 sm:flex-none text-center"><i class="fas fa-save mr-1"></i> Save</button>
                    <button onclick="cancelEditTeacher()" class="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex-1 sm:flex-none text-center"><i class="fas fa-times"></i> Cancel</button>
                </div>
            `;
        } else if (confirmDeleteTeacherId === t.id) {
            div.innerHTML = `
                <div class="text-red-600 flex flex-col justify-center gap-2 font-medium w-full">
                    <div><i class="fas fa-exclamation-triangle mr-1"></i> Delete ${t.fullName || t.username}?</div>
                    <div class="flex gap-2 w-full">
                        <button onclick="executeDeleteTeacher('${t.id}')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium flex-1 text-center">Yes</button>
                        <button onclick="cancelDeleteTeacher()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium flex-1 text-center">Cancel</button>
                    </div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="w-full sm:w-1/3 flex flex-col">
                    <div class="flex items-start gap-3 mb-2">
                        <div class="w-10 h-10 rounded-full bg-gray-100 border flex items-center justify-center text-gray-500 text-lg shrink-0 mt-1"><i class="fas fa-user-tie"></i></div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-gray-800 text-sm leading-tight truncate" title="${t.fullName || t.username}">${t.fullName || t.username}</h4>
                            <p class="text-xs text-blue-600 font-semibold truncate mt-1">@${t.username} | ${t.password}</p>
                            <p class="text-xs text-gray-500 mt-0.5 truncate"><i class="fas fa-phone mr-1"></i>${t.contact || '-'}</p>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-1 pl-12 sm:pl-14">
                        <button onclick="startEditTeacher('${t.id}')" class="text-xs font-medium text-blue-600 hover:text-blue-800 p-1"><i class="fas fa-edit mr-1"></i>Edit</button>
                        <button onclick="startDeleteTeacher('${t.id}')" class="text-xs font-medium text-red-500 hover:text-red-700 p-1"><i class="fas fa-trash mr-1"></i>Delete</button>
                    </div>
                </div>
                <div class="flex-1 w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                    <p class="text-xs text-gray-500 font-semibold mb-2 uppercase">Roles & Assignments</p>
                    <div class="flex flex-wrap gap-1 mb-1">
                        ${ctBadges}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        ${badges.length > 0 ? badges : (ctBadges.length === 0 ? '<span class="text-xs text-gray-400 italic">No classes assigned</span>' : '')}
                    </div>
                </div>
            `;
        }
        container.appendChild(div);
    });
}

function startEditTeacher(id) { editingTeacherId = id; confirmDeleteTeacherId = null; updateTeacherList(); }
function cancelEditTeacher() { editingTeacherId = null; updateTeacherList(); }
function saveEditTeacher(id) {
    const user = document.getElementById(`edit-t-user-${id}`).value.trim();
    const pass = document.getElementById(`edit-t-pass-${id}`).value.trim();
    const name = document.getElementById(`edit-t-name-${id}`).value.trim();
    if(!user || !pass) { showToast("Required", "error"); return; }
    
    const teacher = state.teachers.find(t => t.id === id);
    if(teacher) {
        teacher.username = user; teacher.password = pass; teacher.fullName = name;
        editingTeacherId = null;
        updateTeacherList();
        showToast("Updated", "success");
    }
}
function startDeleteTeacher(id) { confirmDeleteTeacherId = id; editingTeacherId = null; updateTeacherList(); }
function cancelDeleteTeacher() { confirmDeleteTeacherId = null; updateTeacherList(); }
function executeDeleteTeacher(id) {
    state.teachers = state.teachers.filter(t => t.id !== id);
    confirmDeleteTeacherId = null;
    updateTeacherList();
    showToast("Deleted", "info");
}
function removeAssignment(tId, aIdx) {
    const t = state.teachers.find(x => x.id === tId);
    if(t) { t.assignments.splice(aIdx, 1); updateTeacherList(); }
}

function removeClassTeacher(tId, className) {
    const t = state.teachers.find(x => x.id === tId);
    if(t && t.classTeacherOf) {
        t.classTeacherOf = t.classTeacherOf.filter(c => c !== className);
        updateTeacherList();
        showToast("Removed from Class Teacher role", "info");
    }
}

function renderMyClasses(container) {
    const user = state.currentUser;
    let cards = (user.assignments || []).map(a => `
        <div class="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
                <i class="fas fa-book"></i>
            </div>
            <div class="min-w-0">
                <h4 class="font-bold text-gray-800 text-sm sm:text-base truncate">${a.subject}</h4>
                <p class="text-xs sm:text-sm text-gray-500">${a.className}</p>
            </div>
        </div>
    `).join('');

    if(!user.assignments || user.assignments.length === 0) {
        cards = '<p class="text-gray-500 col-span-full text-center py-8">You have not been assigned any classes yet. Please contact Admin.</p>';
    }
    
    let ctCards = '';
    if (user.classTeacherOf && user.classTeacherOf.length > 0) {
        ctCards = user.classTeacherOf.map(c => `
            <div class="bg-green-50 p-4 sm:p-5 rounded-xl border border-green-200 shadow-sm flex items-center gap-4">
                 <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-lg sm:text-xl shrink-0">
                    <i class="fas fa-star"></i>
                </div>
                <div class="min-w-0">
                    <h4 class="font-bold text-gray-800 text-sm sm:text-base truncate">Class Teacher</h4>
                    <p class="text-xs sm:text-sm text-green-700 font-semibold">${c}</p>
                </div>
            </div>
        `).join('');
    }

    container.innerHTML = `
        <div class="fade-in max-w-5xl mx-auto">
            ${ctCards ? `
            <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4"><i class="fas fa-crown text-yellow-500 mr-2"></i>Your Class Teacher Roles</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                ${ctCards}
            </div>` : ''}

            <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4"><i class="fas fa-chalkboard-teacher text-blue-500 mr-2"></i>Your Assigned Subjects</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${cards}
            </div>
        </div>
    `;
}

function renderProfileSettings(container) {
    container.innerHTML = `
        <div class="fade-in max-w-md mx-auto bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="text-base font-bold mb-4 border-b pb-2"><i class="fas fa-key mr-2 text-blue-600"></i> Change Password</h3>
            <form onsubmit="handleTeacherPasswordChange(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" id="current-pass" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" id="new-pass" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" id="confirm-pass" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-save"></i> Update Password
                </button>
            </form>
        </div>
    `;
}

function handleTeacherPasswordChange(e) {
    e.preventDefault();
    const curr = document.getElementById('current-pass').value;
    const neu = document.getElementById('new-pass').value;
    const conf = document.getElementById('confirm-pass').value;

    if (curr !== state.currentUser.password) {
        showToast("Current password is incorrect", "error");
        return;
    }
    if (neu !== conf) {
        showToast("New passwords do not match", "error");
        return;
    }

    state.currentUser.password = neu;
    
    if (state.currentUser.role === 'teacher') {
        const teacherRecord = state.teachers.find(t => t.id === state.currentUser.id);
        if (teacherRecord) teacherRecord.password = neu;
    }

    showToast("Password successfully updated!", "success");
    document.getElementById('current-pass').value = '';
    document.getElementById('new-pass').value = '';
    document.getElementById('confirm-pass').value = '';
}
