import React, { useState, useMemo, useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen, 
  Download, 
  Printer, 
  Sparkles, 
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentRecord {
  id: string;
  name: string;
  roll: number | string;
  class: string;
  section?: string;
}

interface MarkRecord {
  studentId: string;
  term: string;
  subject: string;
  components?: Record<string, number | string>;
  originalComponents?: Record<string, number | string>;
}

const GRADE_COLORS: Record<string, string> = {
  'A+': '#15803d', // green-700
  'A': '#16a34a',  // green-600
  'B+': '#2563eb', // blue-600
  'B': '#3b82f6',  // blue-500
  'C+': '#ca8a04', // yellow-600
  'C': '#eab308',  // yellow-500
  'D': '#ea580c',  // orange-600
  'NG': '#dc2626'  // red-600
};

const CLASS_PALETTE = ['#4f46e5', '#0284c7', '#0d9488', '#d97706', '#e11d48', '#8b5cf6'];

export function ResultAnalytics() {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('2081');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'trends' | 'distribution' | 'subjects' | 'leaderboard'>('trends');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Sync with global portal state
  const portalState = (window as any).state || {
    classes: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    terms: ['First Term', 'Second Term', 'Final Term'],
    subjects: ['Comp. Nepali', 'Comp. English', 'Comp. Math', 'Comp. Science', 'Comp. Social Studies'],
    students: [],
    marks: []
  };

  const classesList: string[] = portalState.classes || ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const termsList: string[] = portalState.terms || ['First Term', 'Second Term', 'Final Term'];
  const subjectsList: string[] = portalState.subjects || ['Comp. Nepali', 'Comp. English', 'Comp. Math', 'Comp. Science', 'Comp. Social Studies'];
  const studentsList: StudentRecord[] = portalState.students || [];
  const marksList: MarkRecord[] = portalState.marks || [];

  // Helper to compute GPA for a student in a term
  const computeStudentTermGPA = (student: StudentRecord, term: string) => {
    const isHigherClass = student.class === 'Class 11' || student.class === 'Class 12';
    const examSettings = portalState.examSettings || {};
    const mySubjects = isHigherClass && examSettings.studentSubjects?.[student.id]
      ? examSettings.studentSubjects[student.id]
      : subjectsList;

    let totalGpa = 0;
    let totalMarks = 0;
    let maxPossibleMarks = 0;
    let evaluatedSubjects = 0;
    let hasNG = false;
    const subjectBreakdown: Record<string, { marks: number; fm: number; gpa: number; grade: string }> = {};

    mySubjects.forEach((sub: string) => {
      const markRecord = marksList.find(
        (m: MarkRecord) => m.studentId === student.id && m.term === term && m.subject === sub
      );

      let subTotal = 0;
      let hasMarks = false;

      if (markRecord && markRecord.components) {
        Object.values(markRecord.components).forEach(val => {
          if (val !== '' && val !== undefined && !isNaN(Number(val))) {
            subTotal += Number(val);
            hasMarks = true;
          }
        });
      }

      // Full marks lookup
      const fm = typeof (window as any).getSubjectFm === 'function' ? (window as any).getSubjectFm(sub) : 100;
      maxPossibleMarks += fm;

      if (hasMarks) {
        evaluatedSubjects++;
        totalMarks += subTotal;
        const percent = fm > 0 ? (subTotal / fm) * 100 : 0;
        
        let gradeInfo = { grade: 'NG', gpa: 0.0, isNG: true };
        if (typeof (window as any).getGradeInfo === 'function') {
          gradeInfo = (window as any).getGradeInfo(percent, student.class);
        } else {
          // Standard Nepali letter grading fallback
          if (percent >= 90) gradeInfo = { grade: 'A+', gpa: 4.0, isNG: false };
          else if (percent >= 80) gradeInfo = { grade: 'A', gpa: 3.6, isNG: false };
          else if (percent >= 70) gradeInfo = { grade: 'B+', gpa: 3.2, isNG: false };
          else if (percent >= 60) gradeInfo = { grade: 'B', gpa: 2.8, isNG: false };
          else if (percent >= 50) gradeInfo = { grade: 'C+', gpa: 2.4, isNG: false };
          else if (percent >= 40) gradeInfo = { grade: 'C', gpa: 2.0, isNG: false };
          else if (percent >= 35) gradeInfo = { grade: 'D', gpa: 1.6, isNG: false };
          else gradeInfo = { grade: 'NG', gpa: 0.0, isNG: true };
        }

        if (gradeInfo.isNG) hasNG = true;
        totalGpa += gradeInfo.gpa;
        subjectBreakdown[sub] = { marks: subTotal, fm, gpa: gradeInfo.gpa, grade: gradeInfo.grade };
      }
    });

    if (evaluatedSubjects === 0) return null;

    const gpa = Number((totalGpa / evaluatedSubjects).toFixed(2));
    const percentage = maxPossibleMarks > 0 ? Number(((totalMarks / maxPossibleMarks) * 100).toFixed(1)) : 0;
    
    // Determine overall letter grade from GPA
    let letterGrade = 'NG';
    if (hasNG) {
      letterGrade = 'NG';
    } else if (gpa >= 3.6) letterGrade = 'A+';
    else if (gpa >= 3.2) letterGrade = 'A';
    else if (gpa >= 2.8) letterGrade = 'B+';
    else if (gpa >= 2.4) letterGrade = 'B';
    else if (gpa >= 2.0) letterGrade = 'C+';
    else if (gpa >= 1.6) letterGrade = 'C';
    else if (gpa >= 1.2) letterGrade = 'D';

    return {
      student,
      term,
      gpa,
      letterGrade,
      totalMarks,
      maxPossibleMarks,
      percentage,
      hasNG,
      evaluatedSubjects,
      subjectBreakdown
    };
  };

  // Compile detailed evaluations
  const evaluations = useMemo(() => {
    const list: any[] = [];
    studentsList.forEach(student => {
      termsList.forEach(term => {
        const evalResult = computeStudentTermGPA(student, term);
        if (evalResult) {
          list.push(evalResult);
        }
      });
    });
    return list;
  }, [studentsList, marksList, refreshTrigger]);

  // Filtered evaluations according to dropdowns
  const currentFilteredEvals = useMemo(() => {
    return evaluations.filter(item => {
      const matchClass = selectedClass === 'All' || item.student.class === selectedClass;
      const matchTerm = selectedTerm === 'All' || item.term === selectedTerm;
      const matchSearch = searchQuery.trim() === '' || 
        item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.student.roll).includes(searchQuery);
      return matchClass && matchTerm && matchSearch;
    });
  }, [evaluations, selectedClass, selectedTerm, searchQuery]);

  // 1. Average GPA Trends over the Academic Year
  const gpaTrendsData = useMemo(() => {
    return termsList.map(term => {
      const row: Record<string, any> = { term };
      let schoolGpaSum = 0;
      let schoolCount = 0;

      classesList.forEach(cls => {
        const classTermEvals = evaluations.filter(e => e.term === term && e.student.class === cls);
        if (classTermEvals.length > 0) {
          const avg = Number((classTermEvals.reduce((acc, curr) => acc + curr.gpa, 0) / classTermEvals.length).toFixed(2));
          row[cls] = avg;
          schoolGpaSum += classTermEvals.reduce((acc, curr) => acc + curr.gpa, 0);
          schoolCount += classTermEvals.length;
        } else {
          row[cls] = null;
        }
      });

      row['School Average'] = schoolCount > 0 ? Number((schoolGpaSum / schoolCount).toFixed(2)) : null;
      return row;
    });
  }, [evaluations, termsList, classesList]);

  // 2. Class Comparison Data for Selected Term
  const classComparisonData = useMemo(() => {
    const targetTerm = selectedTerm === 'All' ? termsList[termsList.length - 1] || 'Final Term' : selectedTerm;
    return classesList.map(cls => {
      const classEvals = evaluations.filter(e => e.student.class === cls && e.term === targetTerm);
      if (classEvals.length === 0) {
        return { className: cls, avgGpa: 0, passRate: 0, studentsCount: 0 };
      }
      const avgGpa = Number((classEvals.reduce((acc, c) => acc + c.gpa, 0) / classEvals.length).toFixed(2));
      const passedCount = classEvals.filter(e => !e.hasNG && e.gpa >= 1.6).length;
      const passRate = Number(((passedCount / classEvals.length) * 100).toFixed(1));
      return {
        className: cls,
        avgGpa,
        passRate,
        studentsCount: classEvals.length
      };
    });
  }, [evaluations, selectedTerm, classesList, termsList]);

  // 3. Grade Distribution Data
  const gradeDistributionData = useMemo(() => {
    const counts: Record<string, number> = {
      'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D': 0, 'NG': 0
    };

    currentFilteredEvals.forEach(e => {
      if (counts[e.letterGrade] !== undefined) {
        counts[e.letterGrade]++;
      } else {
        counts['NG']++;
      }
    });

    return Object.entries(counts).map(([grade, count]) => ({
      grade,
      count,
      color: GRADE_COLORS[grade] || '#64748b'
    }));
  }, [currentFilteredEvals]);

  // 4. Subject Performance Data
  const subjectPerformanceData = useMemo(() => {
    const subStats: Record<string, { totalScore: number; count: number; maxScore: number }> = {};
    
    currentFilteredEvals.forEach(e => {
      Object.entries(e.subjectBreakdown || {}).forEach(([sub, data]: [string, any]) => {
        if (!subStats[sub]) {
          subStats[sub] = { totalScore: 0, count: 0, maxScore: 0 };
        }
        subStats[sub].totalScore += data.marks;
        subStats[sub].maxScore += data.fm;
        subStats[sub].count += 1;
      });
    });

    return Object.entries(subStats).map(([subject, stats]) => {
      const avgPercent = stats.maxScore > 0 ? Number(((stats.totalScore / stats.maxScore) * 100).toFixed(1)) : 0;
      return {
        subject: subject.replace('Comp. ', ''),
        fullName: subject,
        avgPercentage: avgPercent,
        studentCount: stats.count
      };
    }).sort((a, b) => b.avgPercentage - a.avgPercentage);
  }, [currentFilteredEvals]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (currentFilteredEvals.length === 0) {
      return {
        avgGpa: '0.00',
        highestGpa: '0.00',
        passRate: '0%',
        evaluatedCount: 0,
        gradeLetter: '-'
      };
    }
    const sumGpa = currentFilteredEvals.reduce((acc, curr) => acc + curr.gpa, 0);
    const avg = Number((sumGpa / currentFilteredEvals.length).toFixed(2));
    const highest = Math.max(...currentFilteredEvals.map(e => e.gpa)).toFixed(2);
    const passed = currentFilteredEvals.filter(e => !e.hasNG && e.gpa >= 1.6).length;
    const rate = ((passed / currentFilteredEvals.length) * 100).toFixed(1);

    let letter = 'C';
    if (avg >= 3.6) letter = 'A+';
    else if (avg >= 3.2) letter = 'A';
    else if (avg >= 2.8) letter = 'B+';
    else if (avg >= 2.4) letter = 'B';
    else if (avg >= 2.0) letter = 'C+';

    return {
      avgGpa: avg.toFixed(2),
      highestGpa: highest,
      passRate: `${rate}%`,
      evaluatedCount: currentFilteredEvals.length,
      gradeLetter: letter
    };
  }, [currentFilteredEvals]);

  // Leaderboard Sorted
  const leaderboardStudents = useMemo(() => {
    return [...currentFilteredEvals]
      .sort((a, b) => b.gpa - a.gpa || b.totalMarks - a.totalMarks)
      .slice(0, 15);
  }, [currentFilteredEvals]);

  // Seed Realistic Demo Data for Rasuwa Secondary School
  const handleSeedDemoData = () => {
    const confirmation = window.confirm(
      "Load realistic examination sample records for Rasuwa Secondary School across Classes 8-12 and all 3 Terms? This enables immediate deep analytics visualization."
    );
    if (!confirmation) return;

    const sampleNepaliNames = [
      "Aarav Tamang", "Bipana Ghale", "Chhewang Lama", "Dawa Sherpa", 
      "Dolma Gurung", "Kiran Shrestha", "Manish Thapa", "Pooja B.K.", 
      "Pravin Neupane", "Roshani Paudel", "Sujan Karki", "Urgen Tamang"
    ];

    const currentPortal = (window as any).state;
    if (!currentPortal) return;

    // Ensure students exist across classes
    if (!currentPortal.students || currentPortal.students.length === 0) {
      let nextId = 1001;
      currentPortal.students = [];
      classesList.forEach(cls => {
        sampleNepaliNames.slice(0, 8).forEach((name, idx) => {
          currentPortal.students.push({
            id: `S${nextId++}`,
            name: `${name} (${cls})`,
            roll: idx + 1,
            class: cls,
            section: 'A',
            gender: idx % 2 === 0 ? 'Male' : 'Female',
            contact: '9800000000'
          });
        });
      });
    }

    // Generate progressive marks for First Term, Second Term, and Final Term
    const newMarks: MarkRecord[] = [];
    const subjects = portalState.subjects || ['Comp. Nepali', 'Comp. English', 'Comp. Math', 'Comp. Science', 'Comp. Social Studies'];

    currentPortal.students.forEach((student: StudentRecord, sIdx: number) => {
      // Base academic aptitude for student
      const baseAptitude = 55 + (sIdx % 40);

      termsList.forEach((term, tIdx) => {
        // Progressive improvement trend over the academic year
        const termBoost = tIdx * 4; 

        subjects.forEach((sub: string, subIdx: number) => {
          // Subject variation
          const subFactor = (subIdx % 3 === 0) ? -4 : (subIdx % 2 === 0 ? 5 : 0);
          const score = Math.min(96, Math.max(38, Math.round(baseAptitude + termBoost + subFactor + (Math.random() * 8 - 4))));

          newMarks.push({
            studentId: student.id,
            term: term,
            subject: sub,
            components: {
              th: Math.round(score * 0.75),
              pr: Math.round(score * 0.25)
            }
          });
        });
      });
    });

    currentPortal.marks = newMarks;

    if (typeof (window as any).saveState === 'function') {
      (window as any).saveState();
    }
    if (typeof (window as any).syncPushToCloud === 'function') {
      (window as any).syncPushToCloud('students', currentPortal.students);
      (window as any).syncPushToCloud('marks', currentPortal.marks);
    }
    if (typeof (window as any).showToast === 'function') {
      (window as any).showToast('Demo examination performance records generated!', 'success');
    }

    setRefreshTrigger(prev => prev + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 fade-in pb-12 font-sans">
      {/* Header & Controls Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-800">Result Analytics & GPA Trends</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Academic Performance Intelligence • Shree Rasuwa Secondary School (Year {selectedYear} B.S.)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {evaluations.length === 0 && (
            <button
              onClick={handleSeedDemoData}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Analytics Data</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Print Analytical Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-xl text-xs transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          {/* Class Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-400 font-medium">Class:</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Classes</option>
              {classesList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Term Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-400 font-medium">Term:</span>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Terms (Trends)</option>
              {termsList.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-400 font-medium">Year:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="2081">2081 B.S.</option>
              <option value="2082">2082 B.S.</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student or roll..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: School/Class GPA */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average GPA</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-gray-800">{summaryMetrics.avgGpa}</span>
              <span className="text-xs text-gray-400">/ 4.00</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Grade {summaryMetrics.gradeLetter} Performance
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            {summaryMetrics.gradeLetter}
          </div>
        </div>

        {/* Card 2: Highest GPA */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top GPA Recorded</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-600">{summaryMetrics.highestGpa}</span>
              <span className="text-xs text-gray-400">GPA</span>
            </div>
            <p className="text-[11px] text-indigo-500 font-medium mt-1">Highest individual achievement</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Pass Rate */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pass Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600">{summaryMetrics.passRate}</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Non-NG clearance rate</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Students Evaluated */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evaluations</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-gray-800">{summaryMetrics.evaluatedCount}</span>
              <span className="text-xs text-gray-400">Records</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">Total exam entries evaluated</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Chart Section: Average GPA Trends over Academic Year */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Academic Year GPA Progression Trends
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Comparative average GPA trajectory across First Term, Second Term, and Final Term examinations
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Target Benchmark: 3.20 GPA</span>
          </div>
        </div>

        {evaluations.length === 0 ? (
          <div className="py-16 text-center text-gray-400 space-y-3">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
            <p className="text-sm font-medium text-gray-600">No examination marks recorded yet</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Please enter student marks in Mark Entry or click "Load Sample Analytics Data" to preview full visualization.
            </p>
            <button
              onClick={handleSeedDemoData}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Sample Exam Data
            </button>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaTrendsData} margin={{ top: 10, right: 25, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="term" 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  domain={[0, 4.0]} 
                  ticks={[1.0, 2.0, 2.8, 3.2, 3.6, 4.0]}
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs space-y-1">
                          <p className="font-bold text-gray-800 border-b pb-1 mb-1">{label}</p>
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex justify-between items-center gap-4">
                              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
                                {entry.name}:
                              </span>
                              <span className="font-bold text-gray-800">{entry.value !== null ? Number(entry.value).toFixed(2) : 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                />
                <ReferenceLine y={3.2} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Target 3.2', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />

                {/* If a specific class is selected, highlight that class */}
                {selectedClass === 'All' ? (
                  <>
                    {classesList.map((cls, idx) => (
                      <Line
                        key={cls}
                        type="monotone"
                        dataKey={cls}
                        name={cls}
                        stroke={CLASS_PALETTE[idx % CLASS_PALETTE.length]}
                        strokeWidth={2.5}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="School Average"
                      name="School Average"
                      stroke="#0f172a"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 5, strokeWidth: 2, fill: '#0f172a' }}
                      connectNulls
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey={selectedClass}
                      name={selectedClass}
                      stroke="#2563eb"
                      strokeWidth={3.5}
                      dot={{ r: 5, strokeWidth: 2, fill: '#2563eb' }}
                      activeDot={{ r: 7 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="School Average"
                      name="School Average Benchmark"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 4, fill: '#94a3b8' }}
                      connectNulls
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Secondary Grid: Class Comparison Bar Chart & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class-wise Comparison for Selected Term */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Student Performance by Class</h3>
              <p className="text-xs text-gray-500">
                Average GPA comparison across classes ({selectedTerm === 'All' ? 'Final Term' : selectedTerm})
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg">
              {selectedTerm === 'All' ? 'Final Term' : selectedTerm}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="className" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 4.0]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs space-y-1">
                          <p className="font-bold text-gray-800">{data.className}</p>
                          <p className="text-blue-600 font-semibold">Average GPA: {data.avgGpa}</p>
                          <p className="text-emerald-600">Pass Rate: {data.passRate}%</p>
                          <p className="text-gray-400">Students: {data.studentsCount}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgGpa" name="Average GPA" radius={[6, 6, 0, 0]}>
                  {classComparisonData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.avgGpa >= 3.2 ? '#10b981' : entry.avgGpa >= 2.8 ? '#3b82f6' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Breakdown (Pie/Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Letter Grade Distribution</h3>
              <p className="text-xs text-gray-500">Student count categorized by Nepal standard grade scale</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 font-semibold rounded-lg">
              {currentFilteredEvals.length} evaluated
            </span>
          </div>

          <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-between">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`grade-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = currentFilteredEvals.length || 1;
                        const pct = ((data.count / total) * 100).toFixed(1);
                        return (
                          <div className="bg-white p-2.5 rounded-xl shadow-lg border border-gray-100 text-xs">
                            <span className="font-bold text-gray-800">Grade {data.grade}: </span>
                            <span className="font-semibold text-blue-600">{data.count} students ({pct}%)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Grid */}
            <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2 text-xs pr-2">
              {gradeDistributionData.map(item => (
                <div key={item.grade} className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-bold text-gray-700">{item.grade}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      {subjectPerformanceData.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Subject-wise Average Marks & Strengths</h3>
              <p className="text-xs text-gray-500">Average percentage achieved by students in curriculum subjects</p>
            </div>
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> {subjectPerformanceData.length} Subjects
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData} layout="vertical" margin={{ top: 5, right: 30, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis type="category" dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-gray-100 text-xs">
                          <p className="font-bold text-gray-800">{data.fullName}</p>
                          <p className="text-blue-600 font-semibold mt-0.5">Average Score: {data.avgPercentage}%</p>
                          <p className="text-gray-400">Total papers: {data.studentCount}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgPercentage" name="Average Marks %" fill="#6366f1" radius={[0, 6, 6, 0]}>
                  {subjectPerformanceData.map((entry, index) => (
                    <Cell 
                      key={`sub-cell-${index}`} 
                      fill={entry.avgPercentage >= 75 ? '#10b981' : entry.avgPercentage >= 60 ? '#3b82f6' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Performing Students Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Top Performing Students Leaderboard
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Honor roll of highest GPA achievers in {selectedClass === 'All' ? 'the School' : selectedClass} ({selectedTerm === 'All' ? 'Overall Terms' : selectedTerm})
            </p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200 self-start sm:self-auto">
            Showing top {leaderboardStudents.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/75 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4 text-right">GPA</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-right">Total Marks</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboardStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    No student evaluation records found.
                  </td>
                </tr>
              ) : (
                leaderboardStudents.map((item, index) => {
                  const isTop3 = index < 3;
                  return (
                    <tr key={`${item.student.id}-${item.term}`} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold">
                        {index === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-[11px]">1</span>
                        ) : index === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-[11px]">2</span>
                        ) : index === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-800/10 text-amber-900 flex items-center justify-center font-extrabold text-[11px]">3</span>
                        ) : (
                          <span className="text-gray-400 pl-2">#{index + 1}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {item.student.name}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{item.student.roll || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-[11px]">
                          {item.student.class}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{item.term}</td>
                      <td className="py-3 px-4 text-right font-black text-gray-900 text-sm">
                        {item.gpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span 
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white inline-block min-w-[28px]"
                          style={{ backgroundColor: GRADE_COLORS[item.letterGrade] || '#64748b' }}
                        >
                          {item.letterGrade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-700">
                        {item.totalMarks} <span className="text-[10px] text-gray-400">/ {item.maxPossibleMarks}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.hasNG ? (
                          <span className="text-red-500 font-semibold text-[11px] flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3" /> NG
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Pass
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

let analyticsMountRoot: Root | null = null;

export function renderResultAnalytics(container: HTMLElement) {
  if (!container) return;

  // Clean previous instance if present
  if (analyticsMountRoot) {
    try {
      analyticsMountRoot.unmount();
    } catch (e) {
      console.warn("Analytics root cleanup notice", e);
    }
    analyticsMountRoot = null;
  }

  container.innerHTML = '<div id="result-analytics-root" class="w-full"></div>';
  const mountPoint = document.getElementById('result-analytics-root');
  if (mountPoint) {
    analyticsMountRoot = createRoot(mountPoint);
    analyticsMountRoot.render(<ResultAnalytics />);
  }
}

// Make accessible to index.html vanilla script execution
(window as any).__mountResultAnalytics = renderResultAnalytics;
(window as any).renderResultAnalytics = renderResultAnalytics;
