/**
 * Application principale de gestion des notes
 */

class GradeManagementApp {
    constructor() {
        this.data = Storage.load();
        this.init();
    }
    
    init() {
        this.renderAll();
        this.attachEventListeners();
        this.setupAutoSave();
    }
    
    // === GESTION DES DONNÉES ===
    
    saveData() {
        Storage.save(this.data);
        Utils.showStatus('Données sauvegardées automatiquement', 'success');
    }
    
    // === GESTION DES ÉLÈVES ===
    
    addStudent(name) {
        if (!name || name.trim() === '') {
            Utils.showStatus('Veuillez entrer un nom', 'error');
            return;
        }
        
        const student = {
            id: Utils.generateId(),
            name: name.trim()
        };
        
        this.data.students.push(student);
        this.saveData();
        this.renderAll();
        Utils.showStatus(`Élève "${name}" ajouté avec succès`, 'success');
    }
    
    deleteStudent(studentId) {
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;
        
        if (!Utils.confirm(`Êtes-vous sûr de vouloir supprimer l'élève "${student.name}" et toutes ses notes ?`)) {
            return;
        }
        
        // Supprimer l'élève
        this.data.students = this.data.students.filter(s => s.id !== studentId);
        
        // Supprimer toutes les notes de l'élève
        Object.keys(this.data.grades).forEach(key => {
            if (key.startsWith(studentId + '_')) {
                delete this.data.grades[key];
            }
        });
        
        this.saveData();
        this.renderAll();
        Utils.showStatus('Élève supprimé avec succès', 'success');
    }
    
    editStudent(studentId) {
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;
        
        const newName = prompt('Nouveau nom:', student.name);
        if (newName && newName.trim() !== '') {
            student.name = newName.trim();
            this.saveData();
            this.renderAll();
            Utils.showStatus('Élève modifié avec succès', 'success');
        }
    }
    
    // === GESTION DES MATIÈRES ===
    
    addSubject(name) {
        if (!name || name.trim() === '') {
            Utils.showStatus('Veuillez entrer un nom de matière', 'error');
            return;
        }
        
        const subject = {
            id: Utils.generateId(),
            name: name.trim().toUpperCase(),
            evaluations: ['N1', 'N2', 'N3', 'N4']
        };
        
        this.data.subjects.push(subject);
        this.saveData();
        this.renderAll();
        this.closeModal('subjectModal');
        Utils.showStatus(`Matière "${name}" ajoutée avec succès`, 'success');
    }
    
    deleteSubject(subjectId) {
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        if (!Utils.confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" et toutes les notes associées ?`)) {
            return;
        }
        
        // Supprimer la matière
        this.data.subjects = this.data.subjects.filter(s => s.id !== subjectId);
        
        // Supprimer toutes les notes de la matière
        Object.keys(this.data.grades).forEach(key => {
            if (key.includes('_' + subjectId + '_')) {
                delete this.data.grades[key];
            }
        });
        
        this.saveData();
        this.renderAll();
        Utils.showStatus('Matière supprimée avec succès', 'success');
    }
    
    editSubject(subjectId) {
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        const newName = prompt('Nouveau nom:', subject.name);
        if (newName && newName.trim() !== '') {
            subject.name = newName.trim().toUpperCase();
            this.saveData();
            this.renderAll();
            Utils.showStatus('Matière modifiée avec succès', 'success');
        }
    }
    
    // === GESTION DES ÉVALUATIONS ===
    
    addEvaluation(subjectId, evalName) {
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        if (!evalName || evalName.trim() === '') {
            Utils.showStatus('Veuillez entrer un nom d\'évaluation', 'error');
            return;
        }
        
        subject.evaluations.push(evalName.trim());
        this.saveData();
        this.renderAll();
        Utils.showStatus('Évaluation ajoutée avec succès', 'success');
    }
    
    deleteEvaluation(subjectId, evalIndex) {
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject || evalIndex < 0 || evalIndex >= subject.evaluations.length) return;
        
        const evalId = subject.evaluations[evalIndex];
        
        if (!Utils.confirm(`Êtes-vous sûr de vouloir supprimer l'évaluation "${evalId}" et toutes les notes associées ?`)) {
            return;
        }
        
        // Supprimer l'évaluation
        subject.evaluations.splice(evalIndex, 1);
        
        // Supprimer toutes les notes de cette évaluation
        Object.keys(this.data.grades).forEach(key => {
            if (key.endsWith('_' + subjectId + '_' + evalId)) {
                delete this.data.grades[key];
            }
        });
        
        this.saveData();
        this.renderAll();
        Utils.showStatus('Évaluation supprimée avec succès', 'success');
    }
    
    // === GESTION DES NOTES ===
    
    setGrade(studentId, subjectId, evalId, grade) {
        const key = `${studentId}_${subjectId}_${evalId}`;
        
        if (grade === '' || grade === null) {
            delete this.data.grades[key];
        } else {
            if (!Utils.validateGrade(grade)) {
                Utils.showStatus('Note invalide (0-10)', 'error');
                return;
            }
            this.data.grades[key] = parseFloat(grade);
        }
        
        this.saveData();
        this.updateCalculations();
    }
    
    getGrade(studentId, subjectId, evalId) {
        const key = `${studentId}_${subjectId}_${evalId}`;
        return this.data.grades[key];
    }
    
    // === CALCULS ===
    
    calculateStudentSubjectAverage(studentId, subjectId) {
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return null;
        
        const grades = subject.evaluations.map(evalId => {
            return this.getGrade(studentId, subjectId, evalId);
        }).filter(g => g !== undefined && g !== null);
        
        return Utils.calculateAverage(grades);
    }
    
    calculateStudentGeneralAverage(studentId) {
        const averages = this.data.subjects.map(subject => {
            return this.calculateStudentSubjectAverage(studentId, subject.id);
        }).filter(avg => avg !== null);
        
        return Utils.calculateAverage(averages);
    }
    
    calculateClassStats() {
        const allGrades = Object.values(this.data.grades).filter(g => g !== null && g !== undefined);
        return Utils.calculateStats(allGrades);
    }
    
    // === RENDU ===
    
    renderAll() {
        this.renderDashboard();
        this.renderGradeTable();
        this.renderSubjectList();
    }
    
    renderDashboard() {
        const stats = this.calculateClassStats();
        const dashboard = document.getElementById('dashboard');
        
        dashboard.innerHTML = `
            <div class="stat-card">
                <h3>📚 Élèves</h3>
                <div class="stat-value">${this.data.students.length}</div>
            </div>
            <div class="stat-card">
                <h3>📖 Matières</h3>
                <div class="stat-value">${this.data.subjects.length}</div>
            </div>
            <div class="stat-card">
                <h3>📊 Moyenne Classe</h3>
                <div class="stat-value">${stats.avg !== null ? stats.avg.toFixed(2) : '-'}/10</div>
            </div>
            <div class="stat-card">
                <h3>📈 Min / Max</h3>
                <div class="stat-value">${stats.min !== null ? stats.min.toFixed(1) : '-'} / ${stats.max !== null ? stats.max.toFixed(1) : '-'}</div>
            </div>
        `;
    }
    
    renderGradeTable() {
        const tbody = document.getElementById('gradeTableBody');
        const thead = document.getElementById('gradeTableHead');
        
        if (this.data.students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="100" class="empty-state">
                        <div class="empty-state-icon">📚</div>
                        <h3>Aucun élève</h3>
                        <p>Ajoutez des élèves pour commencer la saisie des notes</p>
                    </td>
                </tr>
            `;
            thead.innerHTML = '<tr><th class="student-col">Élève</th><th>Actions</th></tr>';
            return;
        }
        
        // En-tête du tableau
        let headerHtml = '<tr><th class="student-col">Élève</th>';
        this.data.subjects.forEach(subject => {
            subject.evaluations.forEach(evalId => {
                headerHtml += `<th>${subject.name}<br>${evalId}</th>`;
            });
            headerHtml += `<th class="average-cell">${subject.name}<br>Moyenne</th>`;
        });
        headerHtml += '<th class="average-cell">Moyenne<br>Générale</th>';
        headerHtml += '<th>Actions</th></tr>';
        thead.innerHTML = headerHtml;
        
        // Corps du tableau
        let bodyHtml = '';
        this.data.students.forEach(student => {
            bodyHtml += `<tr>`;
            bodyHtml += `<td class="student-name">${student.name}</td>`;
            
            // Notes par matière
            this.data.subjects.forEach(subject => {
                subject.evaluations.forEach(evalId => {
                    const grade = this.getGrade(student.id, subject.id, evalId);
                    const gradeClass = Utils.getGradeClass(grade);
                    bodyHtml += `<td>
                        <input type="number" 
                               class="grade-input ${gradeClass}" 
                               min="0" 
                               max="10" 
                               step="0.01" 
                               value="${grade !== undefined && grade !== null ? grade : ''}"
                               data-student="${student.id}"
                               data-subject="${subject.id}"
                               data-eval="${evalId}"
                               placeholder="-">
                    </td>`;
                });
                
                // Moyenne de la matière
                const avg = this.calculateStudentSubjectAverage(student.id, subject.id);
                const avgClass = Utils.getGradeClass(avg);
                bodyHtml += `<td class="average-cell ${avgClass}">
                    ${avg !== null ? Utils.getGradeEmoji(avg) + ' ' + avg.toFixed(2) : '-'}
                </td>`;
            });
            
            // Moyenne générale
            const generalAvg = this.calculateStudentGeneralAverage(student.id);
            const generalAvgClass = Utils.getGradeClass(generalAvg);
            bodyHtml += `<td class="average-cell ${generalAvgClass}">
                <strong>${generalAvg !== null ? Utils.getGradeEmoji(generalAvg) + ' ' + generalAvg.toFixed(2) : '-'}</strong>
            </td>`;
            
            // Actions
            bodyHtml += `<td>
                <button class="btn btn-small btn-secondary" onclick="app.editStudent('${student.id}')">✏️</button>
                <button class="btn btn-small btn-danger" onclick="app.deleteStudent('${student.id}')">🗑️</button>
            </td>`;
            
            bodyHtml += `</tr>`;
        });
        
        tbody.innerHTML = bodyHtml;
        
        // Attacher les événements aux inputs
        document.querySelectorAll('.grade-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const studentId = e.target.dataset.student;
                const subjectId = e.target.dataset.subject;
                const evalId = e.target.dataset.eval;
                const grade = e.target.value;
                
                this.setGrade(studentId, subjectId, evalId, grade);
                
                // Mettre à jour la classe CSS de l'input
                e.target.className = 'grade-input ' + Utils.getGradeClass(grade);
            });
        });
    }
    
    renderSubjectList() {
        const list = document.getElementById('subjectList');
        if (!list) return;
        
        let html = '';
        this.data.subjects.forEach(subject => {
            html += `
                <li>
                    <span><strong>${subject.name}</strong> (${subject.evaluations.length} évaluations)</span>
                    <div class="item-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.editSubject('${subject.id}')">✏️</button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteSubject('${subject.id}')">🗑️</button>
                    </div>
                </li>
            `;
        });
        
        list.innerHTML = html || '<li>Aucune matière</li>';
    }
    
    updateCalculations() {
        this.renderDashboard();
        this.renderGradeTable();
    }
    
    // === MODALES ===
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // === IMPORT/EXPORT ===
    
    exportPDF() {
        if (this.data.students.length === 0) {
            Utils.showStatus('Aucune donnée à exporter', 'error');
            return;
        }
        ExportManager.exportToPDF(this.data);
        Utils.showStatus('PDF généré avec succès', 'success');
    }
    
    exportExcel() {
        if (this.data.students.length === 0) {
            Utils.showStatus('Aucune donnée à exporter', 'error');
            return;
        }
        ExportManager.exportToExcel(this.data);
        Utils.showStatus('Excel généré avec succès', 'success');
    }
    
    exportJSON() {
        Storage.exportToJSON();
        Utils.showStatus('Sauvegarde exportée avec succès', 'success');
    }
    
    async importJSON(file) {
        try {
            const data = await Storage.importFromJSON(file);
            this.data = data;
            this.renderAll();
            Utils.showStatus('Données importées avec succès', 'success');
        } catch (error) {
            Utils.showStatus('Erreur lors de l\'importation: ' + error.message, 'error');
        }
    }
    
    async importExcel(file) {
        try {
            const result = await ExportManager.importFromExcel(file);
            if (result.students.length > 0) {
                this.data.students = [...this.data.students, ...result.students];
                this.data.grades = { ...this.data.grades, ...result.grades };
                this.saveData();
                this.renderAll();
                Utils.showStatus('Données Excel importées avec succès', 'success');
            }
        } catch (error) {
            Utils.showStatus('Erreur lors de l\'importation: ' + error.message, 'error');
        }
    }
    
    clearAllData() {
        if (!Utils.confirm('⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir effacer TOUTES les données ?\n\nCette action est irréversible !')) {
            return;
        }
        
        Storage.clear();
        this.data = Storage.load();
        this.renderAll();
        Utils.showStatus('Toutes les données ont été effacées', 'success');
    }
    
    // === EVENT LISTENERS ===
    
    attachEventListeners() {
        // Bouton ajouter élève
        const addStudentBtn = document.getElementById('addStudentBtn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => {
                this.openModal('studentModal');
            });
        }
        
        // Formulaire ajouter élève
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('studentName').value;
                this.addStudent(name);
                this.closeModal('studentModal');
                document.getElementById('studentName').value = '';
            });
        }
        
        // Bouton ajouter matière
        const addSubjectBtn = document.getElementById('addSubjectBtn');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => {
                this.openModal('subjectModal');
            });
        }
        
        // Formulaire ajouter matière
        const subjectForm = document.getElementById('subjectForm');
        if (subjectForm) {
            subjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('subjectName').value;
                this.addSubject(name);
                document.getElementById('subjectName').value = '';
            });
        }
        
        // Fermer les modales
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                }
            });
        });
        
        // Export PDF
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportPDF());
        }
        
        // Export Excel
        const exportExcelBtn = document.getElementById('exportExcelBtn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.exportExcel());
        }
        
        // Export JSON
        const exportJsonBtn = document.getElementById('exportJsonBtn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.exportJSON());
        }
        
        // Import JSON
        const importJsonInput = document.getElementById('importJsonInput');
        if (importJsonInput) {
            importJsonInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.importJSON(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }
        
        // Import Excel
        const importExcelInput = document.getElementById('importExcelInput');
        if (importExcelInput) {
            importExcelInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.importExcel(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }
        
        // Effacer données
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }
    }
    
    setupAutoSave() {
        // Sauvegarde automatique toutes les 30 secondes
        setInterval(() => {
            this.saveData();
        }, 30000);
    }
}

// Initialiser l'application au chargement de la page
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GradeManagementApp();
});
