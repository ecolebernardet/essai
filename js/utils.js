/**
 * Utils Module - Fonctions utilitaires
 */

const Utils = {
    /**
     * Générer un ID unique
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
    
    /**
     * Calculer la moyenne d'un tableau de notes
     */
    calculateAverage(grades) {
        if (!grades || grades.length === 0) return null;
        const validGrades = grades.filter(g => g !== null && g !== undefined && !isNaN(g));
        if (validGrades.length === 0) return null;
        const sum = validGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);
        return Math.round((sum / validGrades.length) * 100) / 100;
    },
    
    /**
     * Calculer les statistiques d'une série de notes
     */
    calculateStats(grades) {
        if (!grades || grades.length === 0) {
            return { min: null, max: null, avg: null, stdDev: null };
        }
        
        const validGrades = grades.filter(g => g !== null && g !== undefined && !isNaN(g));
        if (validGrades.length === 0) {
            return { min: null, max: null, avg: null, stdDev: null };
        }
        
        const min = Math.min(...validGrades);
        const max = Math.max(...validGrades);
        const avg = this.calculateAverage(validGrades);
        
        // Calcul de l'écart-type
        const squareDiffs = validGrades.map(grade => Math.pow(grade - avg, 2));
        const avgSquareDiff = this.calculateAverage(squareDiffs);
        const stdDev = Math.round(Math.sqrt(avgSquareDiff) * 100) / 100;
        
        return { min, max, avg, stdDev };
    },
    
    /**
     * Obtenir la classe CSS selon la note (sur 10)
     */
    getGradeClass(grade) {
        if (grade === null || grade === undefined || isNaN(grade)) return '';
        const g = parseFloat(grade);
        if (g > 8.5) return 'grade-excellent';
        if (g > 7) return 'grade-good';
        if (g >= 5) return 'grade-average';
        return 'grade-poor';
    },
    
    /**
     * Obtenir l'emoji selon la note
     */
    getGradeEmoji(grade) {
        if (grade === null || grade === undefined || isNaN(grade)) return '';
        const g = parseFloat(grade);
        if (g > 8.5) return '🟡';
        if (g > 7) return '🟢';
        if (g >= 5) return '🟠';
        return '🔴';
    },
    
    /**
     * Formater une note pour l'affichage
     */
    formatGrade(grade) {
        if (grade === null || grade === undefined || grade === '') return '-';
        return parseFloat(grade).toFixed(2);
    },
    
    /**
     * Valider une note (0-10)
     */
    validateGrade(grade) {
        if (grade === null || grade === undefined || grade === '') return true;
        const g = parseFloat(grade);
        return !isNaN(g) && g >= 0 && g <= 10;
    },
    
    /**
     * Afficher un message de statut
     */
    showStatus(message, type = 'success') {
        const statusDiv = document.getElementById('statusMessage');
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = `status-message status-${type}`;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    },
    
    /**
     * Confirmer une action
     */
    confirm(message) {
        return window.confirm(message);
    },
    
    /**
     * Trier un tableau d'objets par propriété
     */
    sortBy(array, property, ascending = true) {
        return array.sort((a, b) => {
            const aVal = a[property];
            const bVal = b[property];
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
    },
    
    /**
     * Formater une date
     */
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR');
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
