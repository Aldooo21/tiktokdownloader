// DOM Elements
const videoUrlInput = document.getElementById('video-url');
const downloadBtn = document.getElementById('download-btn');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const previewImg = document.getElementById('preview-img');
const nowmDownloadBtn = document.getElementById('nowm-download');
const wmDownloadBtn = document.getElementById('wm-download');
const audioDownloadBtn = document.getElementById('audio-download');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const author = document.getElementById('author');
const title = document.getElementById('title');

// API Configuration
const API_KEY = 'RichadNiBoss'; // Ganti dengan API key Anda
const API_URL = 'https://api.botcahx.eu.org/api/dowloader/tiktok';

// Data video saat ini
let currentVideoData = null;

// Event listener untuk tombol download
downloadBtn.addEventListener('click', fetchTikTokVideo);

// Event listeners untuk tombol download format
nowmDownloadBtn.addEventListener('click', () => downloadVideo('nowm'));
wmDownloadBtn.addEventListener('click', () => downloadVideo('wm'));
audioDownloadBtn.addEventListener('click', () => downloadVideo('audio'));

// Fungsi untuk mendapatkan data video TikTok dari API
async function fetchTikTokVideo() {
    const url = videoUrlInput.value.trim();
    
    if (!url) {
        showError('Mohon masukkan URL video TikTok');
        return;
    }
    
    if (!url.includes('tiktok.com')) {
        showError('URL tidak valid. Pastikan URL dari TikTok');
        return;
    }
    
    // Tampilkan loading
    loader.style.display = 'block';
    result.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
        // Buat URL API dengan parameter
        const fullApiUrl = `${API_URL}?url=${encodeURIComponent(url)}&apikey=${API_KEY}`;
        
        // Fetch data dari API
        const response = await fetch(fullApiUrl);
        const data = await response.json();
        
        // Check if API returned an error
        if (!response.ok || data.status === false) {
            throw new Error(data.message || 'Terjadi kesalahan saat mengunduh video');
        }
        
        // Simpan data video untuk digunakan saat download
        currentVideoData = data;
        
        // Tampilkan hasil
        displayResult(data);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Terjadi kesalahan saat mengunduh video');
    } finally {
        // Sembunyikan loading
        loader.style.display = 'none';
    }
}

// Fungsi untuk menampilkan hasil
function displayResult(data) {
    // Set thumbnail preview
    previewImg.src = data.result.thumbnail || data.result.thumb;
    
    // Set informasi video
    author.textContent = data.result.author.nickname || data.result.author.unique_id || 'Unknown';
    title.textContent = data.result.description || data.result.title || 'No description';
    
    // Tampilkan hasil
    result.style.display = 'block';
    
    // Scroll ke hasil
    result.scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk download video
function downloadVideo(type) {
    if (!currentVideoData) {
        showError('Tidak ada data video. Silakan coba lagi.');
        return;
    }
    
    let downloadUrl;
    let filename;
    
    switch (type) {
        case 'nowm':
            downloadUrl = currentVideoData.result.nowm || currentVideoData.result.no_watermark;
            filename = 'tiktok_no_watermark.mp4';
            break;
        case 'wm':
            downloadUrl = currentVideoData.result.wm || currentVideoData.result.with_watermark;
            filename = 'tiktok_with_watermark.mp4';
            break;
        case 'audio':
            downloadUrl = currentVideoData.result.audio || currentVideoData.result.music;
            filename = 'tiktok_audio.mp3';
            break;
        default:
            downloadUrl = currentVideoData.result.nowm || currentVideoData.result.no_watermark;
            filename = 'tiktok_video.mp4';
    }
    
    if (!downloadUrl) {
        showError(`Format ${type} tidak tersedia untuk video ini`);
        return;
    }
    
    // Buat elemen anchor untuk download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}

// Auto-focus pada input saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    videoUrlInput.focus();
});