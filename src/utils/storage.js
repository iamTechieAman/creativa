import { 
  getIsolatedUserProjects, 
  saveIsolatedUserProject, 
  deleteIsolatedUserProject,
  getScopedKey
} from './userSession';

export const getSavedProjects = () => {
  return getIsolatedUserProjects();
};

export const saveProjectToStorage = (project) => {
  const updatedList = saveIsolatedUserProject(project);
  try {
    localStorage.setItem(getScopedKey('active_id'), project.id);
  } catch (e) {}
  return project;
};

export const deleteProjectFromStorage = (projectId) => {
  return deleteIsolatedUserProject(projectId);
};

export const getActiveProjectId = () => {
  try {
    return localStorage.getItem(getScopedKey('active_id'));
  } catch (e) {
    return null;
  }
};

export const exportProjectFile = (projectData) => {
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectData.title || 'creativa-design'}.creativa.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const parseImportedFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
