const imageMapping = {
    'assets/images/icon.png': 'icon',
    '/assets/images/icon.png': 'icon',
    '../assets/images/icon.png': 'icon',
    'assets/images/full_logo.png': 'full_logo',
    '/assets/images/full_logo.png': 'full_logo',
    '../assets/images/full_logo.png': 'full_logo',
    'assets/images/pos.jpg': 'pos',
    '/assets/images/pos.jpg': 'pos',
    '../assets/images/pos.jpg': 'pos',
    'assets/images/flag.png': 'flag',
    '/assets/images/flag.png': 'flag',
    '../assets/images/flag.png': 'flag',
    'assets/images/pnt.svg': 'pnt',
    '/assets/images/pnt.svg': 'pnt',
    '../assets/images/pnt.svg': 'pnt',
    'assets/images/cleanImages/rouletteCar.jpg': 'roulette_car',
    '/assets/images/cleanImages/rouletteCar.jpg': 'roulette_car',
    '../assets/images/cleanImages/rouletteCar.jpg': 'roulette_car',
    'assets/images/cleanImages/hiloCar.jpg': 'hilo_car',
    '/assets/images/cleanImages/hiloCar.jpg': 'hilo_car',
    '../assets/images/cleanImages/hiloCar.jpg': 'hilo_car',
    'assets/images/cleanImages/mine.jpg': 'mine',
    '/assets/images/cleanImages/mine.jpg': 'mine',
    '../assets/images/cleanImages/mine.jpg': 'mine',
    'assets/images/cleanImages/slideCar.jpg': 'slideCar',
    '/assets/images/cleanImages/slideCar.jpg': 'slideCar',
    '../assets/images/cleanImages/slideCar.jpg': 'slideCar',
    'assets/images/cleanImages/pokerCar.jpg': 'pokerCar',
    '/assets/images/cleanImages/pokerCar.jpg': 'pokerCar',
    '../assets/images/cleanImages/pokerCar.jpg': 'pokerCar',
    'assets/images/cleanImages/limboCar.jpg': 'limboCar',
    '/assets/images/cleanImages/limboCar.jpg': 'limboCar',
    '../assets/images/cleanImages/limboCar.jpg': 'limboCar',
    'assets/images/cleanImages/diamondsCart.jpg': 'diamondsCart',
    '/assets/images/cleanImages/diamondsCart.jpg': 'diamondsCart',
    '../assets/images/cleanImages/diamondsCart.jpg': 'diamondsCart',
    'assets/images/cleanImages/crashCar.jpg': 'crash_car',
    '/assets/images/cleanImages/crashCar.jpg': 'crash_car',
    '../assets/images/cleanImages/crashCar.jpg': 'crash_car',
    'assets/images/cleanImages/slotsCar.jpg': 'slots_car',
    '/assets/images/cleanImages/slotsCar.jpg': 'slots_car',
    '../assets/images/cleanImages/slotsCar.jpg': 'slots_car'
};

let s3Images = {};
let s3ImagesLoaded = false;

async function loadS3Images() {
    if (s3ImagesLoaded) {
        return s3Images;
    }

    try {
        s3Images = await assetsService.getImages();
        s3ImagesLoaded = true;
        return s3Images;
    } catch (error) {
        return {};
    }
}

function getS3Url(localPath) {
    const imageName = imageMapping[localPath];
    if (imageName && s3Images[imageName]) {
        return s3Images[imageName];
    }
    return null;
}

function replaceImage(element, attribute = 'src') {
    const originalSrc = element.getAttribute(attribute);
    if (!originalSrc || originalSrc.startsWith('http') || originalSrc.startsWith('data:')) {
        if (element.tagName === 'IMG') {
            element.setAttribute('data-s3-loaded', 'true');
        }
        return;
    }

    const s3Url = getS3Url(originalSrc);
    if (s3Url) {
        element.setAttribute(attribute, s3Url);
        element.setAttribute('data-original-src', originalSrc);
        element.removeAttribute('data-s3-error');
        
        if (element.tagName === 'IMG') {
            element.setAttribute('data-s3-loaded', 'true');
        }
        
    } else {
        element.setAttribute('data-s3-error', 'true');
        if (element.tagName === 'IMG') {
            element.setAttribute('data-s3-loaded', 'true');
        }
    }
}

function replaceAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        const dataSrc = img.getAttribute('data-src');
        const s3Url = getS3Url(dataSrc);
        
        if (s3Url) {
            img.src = s3Url;
            img.removeAttribute('data-src');
            
            img.onload = function() {
                this.removeAttribute('data-s3-loading');
                this.setAttribute('data-s3-loaded', 'true');
            };
            
            img.onerror = function() {
                this.removeAttribute('data-s3-loading');
                this.setAttribute('data-s3-loaded', 'true');
                this.onerror = null;
            };
            
        } else {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.removeAttribute('data-s3-loading');
            img.setAttribute('data-s3-loaded', 'true');
        }
    });

    document.querySelectorAll('img[data-original-src]').forEach(img => {
        const originalSrc = img.getAttribute('data-original-src');
        const s3Url = getS3Url(originalSrc);
        
        if (s3Url) {
            img.src = s3Url;
            
            img.onload = function() {
                this.removeAttribute('data-s3-loading');
                this.setAttribute('data-s3-loaded', 'true');
            };
            
            img.onerror = function() {
                this.src = originalSrc;
                this.removeAttribute('data-s3-loading');
                this.setAttribute('data-s3-loaded', 'true');
                this.onerror = null;
            };
            
        } else {
            img.src = originalSrc;
            img.removeAttribute('data-s3-loading');
            img.setAttribute('data-s3-loaded', 'true');
        }
    });

    document.querySelectorAll('link[rel="icon"][href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('data:')) {
            const s3Url = getS3Url(href);
            if (s3Url) {
                link.setAttribute('href', s3Url);
            }
        }
    });

    document.querySelectorAll('[style*="background-image"]').forEach(element => {
        const style = element.getAttribute('style');
        const urlMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        if (urlMatch) {
            const originalUrl = urlMatch[1];
            const s3Url = getS3Url(originalUrl);
            if (s3Url) {
                const newStyle = style.replace(originalUrl, s3Url);
                element.setAttribute('style', newStyle);
            }
        }
    });
}

function observeNewImages() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.tagName === 'IMG') {
                        if (node.hasAttribute('data-src')) {
                            const dataSrc = node.getAttribute('data-src');
                            const s3Url = getS3Url(dataSrc);
                            if (s3Url) {
                                node.src = s3Url;
                                node.removeAttribute('data-src');
                            }
                        } else {
                            replaceImage(node, 'src');
                        }
                    } else if (node.tagName === 'LINK' && node.getAttribute('rel') === 'icon') {
                        replaceImage(node, 'href');
                    }
                    
                    node.querySelectorAll && node.querySelectorAll('img[data-src]').forEach(img => {
                        const dataSrc = img.getAttribute('data-src');
                        const s3Url = getS3Url(dataSrc);
                        if (s3Url) {
                            img.src = s3Url;
                            img.removeAttribute('data-src');
                        }
                    });

                    node.querySelectorAll && node.querySelectorAll('img[src]').forEach(img => {
                        replaceImage(img, 'src');
                    });
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function addLoadingStyles() {
    const style = document.createElement('style');
    style.id = 's3-loading-styles';
    style.textContent = `
        img[data-s3-loading="true"] {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: s3-loading 1.5s infinite;
            min-height: 50px;
            min-width: 50px;
        }
        
        @keyframes s3-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        img[data-s3-loaded="true"] {
            animation: s3-fade-in 0.3s ease-in;
        }
        
        @keyframes s3-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function preventImageErrors() {
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            img.setAttribute('data-original-src', src);
            img.src = transparentPixel;
            img.setAttribute('data-s3-loading', 'true');
        }
    });
}

async function initS3Images() {
    addLoadingStyles();
    preventImageErrors();
    
    try {
        await loadS3Images();
        
        if (Object.keys(s3Images).length > 0) {
            replaceAllImages();
            observeNewImages();
        } else {
            document.querySelectorAll('img[data-original-src]').forEach(img => {
                const originalSrc = img.getAttribute('data-original-src');
                img.src = originalSrc;
                img.removeAttribute('data-s3-loading');
            });
        }
    } catch (error) {
        document.querySelectorAll('img[data-original-src]').forEach(img => {
            const originalSrc = img.getAttribute('data-original-src');
            img.src = originalSrc;
            img.removeAttribute('data-s3-loading');
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initS3Images);
} else {
    initS3Images();
}

(function() {
    const intervalId = setInterval(function() {
        const images = document.querySelectorAll('img[src]');
        if (images.length > 0) {
            const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            
            images.forEach(function(img) {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                    if (!img.hasAttribute('data-original-src')) {
                        img.setAttribute('data-original-src', src);
                        img.src = transparentPixel;
                    }
                }
            });
        }
        
        if (document.readyState !== 'loading') {
            clearInterval(intervalId);
        }
    }, 10);
})();

window.s3ImageLoader = {
    load: loadS3Images,
    replace: replaceAllImages,
    getUrl: getS3Url,
    init: initS3Images
};
