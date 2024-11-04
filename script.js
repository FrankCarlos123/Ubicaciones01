// Estructura de datos para las carpetas
let folderStructure = {
    currentPath: [],
    folders: {}
};

// Inicializar la aplicación
window.onload = function() {
    // Cargar datos guardados o iniciar con estructura vacía
    const savedData = localStorage.getItem('folderStructure');
    if (savedData) {
        folderStructure = JSON.parse(savedData);
    }
    renderCurrentFolder();
    updateBreadcrumb();
};

// Renderizar la carpeta actual
function renderCurrentFolder() {
    const grid = document.getElementById('qrGrid');
    grid.innerHTML = '';
    
    // Obtener la carpeta actual
    let currentFolder = folderStructure.folders;
    for (let folder of folderStructure.currentPath) {
        currentFolder = currentFolder[folder].contents;
    }
    
    // Renderizar cada carpeta
    Object.keys(currentFolder).forEach(folderName => {
        const div = document.createElement('div');
        div.className = 'qr-item';
        div.onclick = () => navigateToFolder(folderName);
        
        const qrDiv = document.createElement('div');
        new QRCode(qrDiv, {
            text: folderName,
            width: 100,
            height: 100
        });
        
        const label = document.createElement('div');
        label.className = 'qr-label';
        label.textContent = folderName;
        
        div.appendChild(qrDiv);
        div.appendChild(label);
        grid.appendChild(div);
    });
}

// Actualizar la ruta de navegación
function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';
    
    // Agregar inicio
    const homeItem = document.createElement('span');
    homeItem.className = 'breadcrumb-item';
    homeItem.textContent = 'Inicio';
    homeItem.onclick = () => navigateToRoot();
    breadcrumb.appendChild(homeItem);
    
    // Agregar cada nivel de carpeta
    folderStructure.currentPath.forEach((folder, index) => {
        const item = document.createElement('span');
        item.className = 'breadcrumb-item';
        item.textContent = folder;
        item.onclick = () => navigateToPath(index);
        breadcrumb.appendChild(item);
    });
}

// Navegación
function navigateToFolder(folderName) {
    folderStructure.currentPath.push(folderName);
    renderCurrentFolder();
    updateBreadcrumb();
}

function navigateToRoot() {
    folderStructure.currentPath = [];
    renderCurrentFolder();
    updateBreadcrumb();
}

function navigateToPath(index) {
    folderStructure.currentPath = folderStructure.currentPath.slice(0, index + 1);
    renderCurrentFolder();
    updateBreadcrumb();
}

// Gestión de carpetas
function showAddFolderDialog() {
    document.getElementById('addFolderView').style.display = 'block';
}

function cancelAdd() {
    document.getElementById('addFolderView').style.display = 'none';
    document.getElementById('folderName').value = '';
}

function addNewFolder() {
    const folderName = document.getElementById('folderName').value.trim();
    if (!folderName) return;
    
    // Obtener la carpeta actual
    let currentFolder = folderStructure.folders;
    for (let folder of folderStructure.currentPath) {
        currentFolder = currentFolder[folder].contents;
    }
    
    // Agregar nueva carpeta
    currentFolder[folderName] = {
        contents: {},
        created: new Date().toISOString()
    };
    
    // Guardar y actualizar
    saveToLocalStorage();
    renderCurrentFolder();
    cancelAdd();
}

// Búsqueda
function toggleSearch() {
    // Implementar función de búsqueda
    alert('Función de búsqueda');
}

// Persistencia
function saveToLocalStorage() {
    localStorage.setItem('folderStructure', JSON.stringify(folderStructure));
}