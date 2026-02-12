/**
 * Export Module - Gestion des exports PDF et Excel
 */

const ExportManager = {
    /**
     * Exporter en PDF (format bulletin)
     */
    exportToPDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // En-tête
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Relevé de Notes', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 105, 30, { align: 'center' });
        
        let yPosition = 45;
        
        // Pour chaque élève
        data.students.forEach((student, index) => {
            // Nouvelle page si nécessaire
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Nom de l'élève
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Élève : ${student.name}`, 20, yPosition);
            yPosition += 10;
            
            // Tableau des notes
            const tableData = [];
            let totalAverage = 0;
            let subjectCount = 0;
            
            data.subjects.forEach(subject => {
                const grades = [];
                subject.evaluations.forEach(evalId => {
                    const key = `${student.id}_${subject.id}_${evalId}`;
                    const grade = data.grades[key];
                    grades.push(grade !== undefined && grade !== null ? grade : '-');
                });
                
                const validGrades = grades.filter(g => g !== '-' && !isNaN(g));
                const average = validGrades.length > 0 
                    ? Utils.calculateAverage(validGrades) 
                    : '-';
                
                if (average !== '-') {
                    totalAverage += average;
                    subjectCount++;
                }
                
                tableData.push([
                    subject.name,
                    ...grades,
                    average !== '-' ? average.toFixed(2) : '-'
                ]);
            });
            
            const headers = ['Matière', ...data.subjects[0].evaluations, 'Moyenne'];
            
            doc.autoTable({
                startY: yPosition,
                head: [headers],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' },
                margin: { left: 20, right: 20 }
            });
            
            yPosition = doc.lastAutoTable.finalY + 10;
            
            // Moyenne générale
            const generalAverage = subjectCount > 0 
                ? (totalAverage / subjectCount).toFixed(2) 
                : '-';
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Moyenne générale : ${generalAverage}/10`, 20, yPosition);
            
            yPosition += 15;
            
            // Ligne de séparation
            if (index < data.students.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.line(20, yPosition, 190, yPosition);
                yPosition += 10;
            }
        });
        
        // Sauvegarder le PDF
        doc.save(`bulletin_notes_${new Date().toISOString().split('T')[0]}.pdf`);
    },
    
    /**
     * Exporter en Excel (CSV)
     */
    exportToExcel(data) {
        let csv = 'Élève';
        
        // En-têtes
        data.subjects.forEach(subject => {
            subject.evaluations.forEach(evalId => {
                csv += `;${subject.name} - ${evalId}`;
            });
            csv += `;${subject.name} - Moyenne`;
        });
        csv += ';Moyenne Générale\n';
        
        // Données des élèves
        data.students.forEach(student => {
            csv += student.name;
            
            let totalAverage = 0;
            let subjectCount = 0;
            
            data.subjects.forEach(subject => {
                const grades = [];
                
                subject.evaluations.forEach(evalId => {
                    const key = `${student.id}_${subject.id}_${evalId}`;
                    const grade = data.grades[key];
                    csv += `;${grade !== undefined && grade !== null ? grade : ''}`;
                    if (grade !== undefined && grade !== null) {
                        grades.push(parseFloat(grade));
                    }
                });
                
                const average = grades.length > 0 
                    ? Utils.calculateAverage(grades) 
                    : '';
                
                csv += `;${average !== '' ? average.toFixed(2) : ''}`;
                
                if (average !== '') {
                    totalAverage += average;
                    subjectCount++;
                }
            });
            
            const generalAverage = subjectCount > 0 
                ? (totalAverage / subjectCount).toFixed(2) 
                : '';
            
            csv += `;${generalAverage}\n`;
        });
        
        // Télécharger le fichier
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `notes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Importer depuis Excel (CSV)
     * Note: Cette fonction est basique et importe uniquement les noms d'élèves.
     * Pour un import complet avec les notes, utiliser la fonction de Restore JSON.
     */
    importFromExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const lines = content.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        reject(new Error('Fichier vide ou invalide'));
                        return;
                    }
                    
                    // Ignorer la première ligne (en-têtes)
                    const students = [];
                    
                    // Parser les lignes de données (format: Nom de l'élève)
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(';').map(v => v.trim());
                        if (values.length > 0 && values[0]) {
                            const studentName = values[0];
                            const studentId = Utils.generateId();
                            students.push({ id: studentId, name: studentName });
                        }
                    }
                    
                    resolve({ students, grades: {} });
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsText(file, 'UTF-8');
        });
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}
