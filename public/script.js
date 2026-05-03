const API_BASE = "/api";
let selectedFile = null;
let uploadedUrl = null;
let copyToastTimeout = null;

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const hostSelect = document.getElementById('host-select');
const uploadBtn = document.getElementById('upload-btn');
const fileNameDiv = document.getElementById('file-name');
const progressContainer = document.getElementById('progress-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercent = document.getElementById('progress-percent');
const progressStatus = document.getElementById('progress-status');
const resultContainer = document.getElementById('result-container');
const resultHeader = document.getElementById('result-header');
const resultUrlDiv = document.getElementById('result-url');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

const toast = document.createElement('div');
toast.id = 'copy-toast';
toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--green-600);
    color: white;
    padding: 12px 24px;
    border-radius: 0;
    border: var(--border-width) solid var(--black);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    box-shadow: 5px 5px 0 var(--black);
    white-space: nowrap;
`;
document.body.appendChild(toast);

function showToast(message, isError = false) {
    if (copyToastTimeout) clearTimeout(copyToastTimeout);
    
    toast.style.backgroundColor = isError ? 'var(--red-600)' : 'var(--green-600)';
    toast.textContent = message;
    toast.style.opacity = '1';
    
    copyToastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    selectedFile = file;
    const fileSize = (file.size / 1024).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeText = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSize} KB`;
    fileNameDiv.innerHTML = `📄 ${file.name} (${sizeText})`;
    uploadBtn.disabled = false;
    
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
}

function selectFile() {
    fileInput.click();
}

async function uploadFile() {
    if (!selectedFile) {
        showError('Pilih file terlebih dahulu!');
        return;
    }
    
    const host = hostSelect.value;
    const hostLabel = host === 'uguu' ? 'Uguu' : 'Ikyy CDN';
    
    uploadBtn.disabled = true;
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    progressContainer.style.display = 'block';
    progressBarFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressStatus.textContent = `Mengupload ke ${hostLabel}...`;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10;
            progress = Math.min(progress, 90);
            progressBarFill.style.width = progress + '%';
            progressPercent.textContent = Math.round(progress) + '%';
        }
    }, 200);
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('host', host);
        
        const startTime = Date.now();
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        clearInterval(progressInterval);
        
        let url = null;
        
        if (host === 'uguu' && data.result?.files?.[0]?.url) {
            url = data.result.files[0].url;
        } 
        else if (host === 'cdn' && data.result?.url) {
            url = data.result.url;
        }
        else if (data.url) {
            url = data.url;
        }
        else if (data.result && typeof data.result === 'string' && data.result.startsWith('http')) {
            url = data.result;
        }
        
        if (url && url.startsWith('http')) {
            progressBarFill.style.width = '100%';
            progressPercent.textContent = '100%';
            progressStatus.textContent = 'Upload berhasil!';
            
            uploadedUrl = url;
            resultHeader.textContent = `✅ UPLOAD BERHASIL (${hostLabel})`;
            resultUrlDiv.innerHTML = `<strong>🔗 URL:</strong><br><a href="${url}" target="_blank" style="color: var(--blue-600); word-break: break-all;">${url}</a>`;
            resultContainer.style.display = 'block';
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 1000);
        } else {
            throw new Error(data.message || data.error || 'Upload gagal, coba lagi');
        }
        
    } catch (err) {
        clearInterval(progressInterval);
        progressContainer.style.display = 'none';
        showError(err.message);
    } finally {
        uploadBtn.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = `❌ ${message}`;
    errorContainer.style.display = 'block';
    showToast(message, true);
}

function copyUrl() {
    if (uploadedUrl) {
        navigator.clipboard.writeText(uploadedUrl).then(() => {
            showToast('✅ URL berhasil disalin!');
        }).catch(() => {
            showToast('❌ Gagal menyalin URL', true);
        });
    } else {
        showToast('❌ Tidak ada URL untuk disalin', true);
    }
}

function openUrl() {
    if (uploadedUrl) {
        window.open(uploadedUrl, '_blank');
    } else {
        showToast('❌ Tidak ada URL untuk dibuka', true);
    }
}

function resetUploader() {
    selectedFile = null;
    fileNameDiv.innerHTML = '';
    uploadBtn.disabled = true;
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    progressContainer.style.display = 'none';
    fileInput.value = '';
}