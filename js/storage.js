/**
 * Storage Module - Gestion de la persistance des données
 * Utilise localStorage pour la sauvegarde automatique
 */

const Storage = {
    STORAGE_KEY: 'grade_management_data',
    
    /**
     * Sauvegarder les données dans localStorage
     */
    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            console.log('Données sauvegardées avec succès');
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    },
    
    /**
     * Charger les données depuis localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            return this.getDefaultData();
        }
    },
    
    /**
     * Structure de données par défaut
     */
    getDefaultData() {
        return {
            students: [],
            subjects: [
                {
                    id: 'fr',
                    name: 'FRANÇAIS',
                    evaluations: ['N1', 'N2', 'N3', 'N4']
                },
                {
                    id: 'math',
                    name: 'MATHS',
                    evaluations: ['N1', 'N2', 'N3', 'N4']
                }
            ],
            grades: {}
        };
    },
    
    /**
     * Effacer toutes les données
     */
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('Données effacées avec succès');
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'effacement:', error);
            return false;
        }
    },
    
    /**
     * Exporter les données en JSON
     */
    exportToJSON() {
        const data = this.load();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `notes_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },
    
    /**
     * Importer des données depuis JSON
     */
    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.save(data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
