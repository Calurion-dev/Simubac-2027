const STORAGE_KEY = 'simulateurBacNotes';
let saveTimeout = null;

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') return data;
      }
      return null;
    } catch {
      return null;
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  autoSave(data) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => this.save(data), 500);
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
