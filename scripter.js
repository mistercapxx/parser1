import { ASN1 } from 'libs/asn1.js';

function parseCertificate(certData) {
    const result = ASN1.decode(certData);
    if (result.typeName() !== 'SEQUENCE') {
        throw 'Invalid certificate structure (expected SEQUENCE)';
    }
    const tbsCertificate = result.sub[0];

    const certificateDetails = {
        commonName: '',
        issuerCN: '',
        validFrom: '',
        validTo: ''
    };
    return certificateDetails;
}

function displayCertificateDetails(certificateDetails) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <p><strong>Common Name:</strong> ${certificateDetails.commonName}</p>
        <p><strong>Issuer CN:</strong> ${certificateDetails.issuerCN}</p>
        <p><strong>Valid From:</strong> ${certificateDetails.validFrom}</p>
        <p><strong>Valid To:</strong> ${certificateDetails.validTo}</p>
    `;
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const certificateData = event.target.result;
        const certificateDetails = parseCertificate(certificateData);

        const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        certificates.push(certificateDetails);
        localStorage.setItem('certificates', JSON.stringify(certificates));

        updateCertificateList();
    };
    reader.readAsArrayBuffer(file);
}

function updateCertificateList() {
    const certificatesDiv = document.getElementById('certificates');
    certificatesDiv.innerHTML = '';
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    certificates.forEach((certificate, index) => {
        const certificateDiv = document.createElement('div');
        certificateDiv.classList.add('certificate');
        certificateDiv.textContent = certificate.commonName;
        certificateDiv.addEventListener('click', () => {
            displayCertificateDetails(certificate);
        });
        certificatesDiv.appendChild(certificateDiv);
    });
}

function init() {
    updateCertificateList();
    const dropArea = document.getElementById('drop-area');
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
    dropArea.addEventListener('drop', handleDrop);
}

init();
