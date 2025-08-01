let designImage, uiImage;
let designImageSize = { width: 0, height: 0 };

document.getElementById('designUpload').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            designImageSize = { width: img.width, height: img.height };
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            designImage = canvas.toDataURL();
            document.getElementById('designPreview').src = designImage;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('uiUpload').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            // Resize UI image ke ukuran desain
            const canvas = document.createElement('canvas');
            canvas.width = designImageSize.width;
            canvas.height = designImageSize.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, designImageSize.width, designImageSize.height);
            uiImage = canvas.toDataURL();
            document.getElementById('uiPreview').src = uiImage;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

function compareImages() {
    if (!designImage || !uiImage) {
        alert("Please upload both images first.");
        return;
    }

    resemble(designImage)
        .compareTo(uiImage)
        .ignoreColors()
        .onComplete(function (data) {
            const diffImage = new Image();
            diffImage.onload = function () {
                const canvas = document.getElementById('diffCanvas');
                canvas.width = diffImage.width;
                canvas.height = diffImage.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(diffImage, 0, 0);
            };
            diffImage.src = data.getImageDataUrl();

            document.getElementById("resultText").innerText =
                `💡 Mismatch Percentage: ${data.misMatchPercentage}%`;
        });
}

function downloadDiff() {
    const canvas = document.getElementById('diffCanvas');
    const link = document.createElement('a');
    link.download = 'diff-result.png';
    link.href = canvas.toDataURL();
    link.click();
}
