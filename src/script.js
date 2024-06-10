import configBuilder from './config/configBuilder.js';
import createHeader from './config/createHeader.js';
import colors from './definedValues/colors.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const foregroundColorSelect = document.getElementById('foregroundColor');
    const backgroundColorSelect = document.getElementById('backgroundColor');

    for (const colorKey in colors) {
        const color = colors[colorKey];
        const option = document.createElement('option');
        option.value = colorKey;
        option.textContent = color.name;
        foregroundColorSelect.appendChild(option.cloneNode(true));
        backgroundColorSelect.appendChild(option.cloneNode(true));
    }

    updateColorPreview('foregroundColorPreview', 'ColorBlack');
    updateColorPreview('backgroundColorPreview', 'ColorWhite');

    backgroundColorSelect.value = 'ColorWhite';
});

function handleScaleChange() {
    const scaleSelect = document.getElementById('scale');
    const customScaleInput = document.getElementById('customScale');
    if (scaleSelect.value === 'Custom') {
        customScaleInput.classList.remove('d-none');
    } else {
        customScaleInput.classList.add('d-none');
    }
}

function updateColorPreview(previewId, colorKey) {
    const color = colors[colorKey];
    const rgbaColor = `rgba(${color.rgb.slice(0, 3).map(c => Math.round(c * 255)).join(',')}, ${color.rgb[3]})`;
    const previewElement = document.getElementById(previewId);
    previewElement.style.backgroundColor = rgbaColor;
}

function generateQRCode() {
    const text = document.getElementById('qrText').value;
    const compName = document.getElementById('compName').value;
    // if text is more than 150 characters, show an alert
    if (text.length > 150) {
        alert('Text is too long. Please enter a text with less than 150 characters.');
        return;
    }

    const qrArray = generateQRArray(text);
    const compositionFileContent = configBuilder('QRCodeLayer', qrArray, 'ColorBlack', 'ColorWhite');
    const headerContent = createHeader(compName);

    downloadZip(compName, compositionFileContent, headerContent);
}

function generateQRArray(text) {
    const maxSize = 40; // Maximum size for the QR code
    const qrCodeElement = document.createElement('div');
    
    const qrCode = new QRCode(qrCodeElement, {
        text: text,
        width: maxSize,
        height: maxSize,
        correctLevel: QRCode.CorrectLevel.H
    });

    const canvas = qrCodeElement.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const size = canvas.width;
    const qrArray = [];

    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            const offset = (y * size + x) * 4;
            const isBlack = imageData[offset] === 0 && imageData[offset + 1] === 0 && imageData[offset + 2] === 0;
            row.push(isBlack ? 1 : 0);
        }
        qrArray.push(row);
    }

    return qrArray;
}

function sanitizeCompName(name) {
    return name.replace(/[^a-z0-9]/gi, '').replace(/\s+/g, '%20');
}

function downloadZip(compName, compositionFileContent, headerContent) {
    const zip = new JSZip();
    const sanitizedCompName = sanitizeCompName(compName);
    const folder = zip.folder(sanitizedCompName);

    folder.file('composition.sqe', compositionFileContent);
    folder.file('header.sqe', headerContent);

    zip.generateAsync({ type: 'blob' })
        .then(content => {
            saveAs(content, `${sanitizedCompName}.zip`);
        });
}

window.handleScaleChange = handleScaleChange;
window.updateColorPreview = updateColorPreview;
window.generateQRCode = generateQRCode;
