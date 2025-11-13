(function() {
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'img') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && value && !value.startsWith('http') && !value.startsWith('data:')) {
                    this.setAttribute('data-original-src', value);
                    return originalSetAttribute.call(this, 'src', transparentPixel);
                }
                return originalSetAttribute.call(this, name, value);
            };
            
            Object.defineProperty(element, 'src', {
                get: function() {
                    return this.getAttribute('src');
                },
                set: function(value) {
                    if (value && !value.startsWith('http') && !value.startsWith('data:')) {
                        this.setAttribute('data-original-src', value);
                        this.setAttribute('src', transparentPixel);
                    } else {
                        this.setAttribute('src', value);
                    }
                }
            });
        }
        
        return element;
    };
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'IMG') {
                    const src = node.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                        node.setAttribute('data-original-src', src);
                        node.src = transparentPixel;
                    }
                }
                
                if (node.querySelectorAll) {
                    node.querySelectorAll('img[src]').forEach(function(img) {
                        const src = img.getAttribute('src');
                        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                            if (!img.hasAttribute('data-original-src')) {
                                img.setAttribute('data-original-src', src);
                                img.src = transparentPixel;
                            }
                        }
                    });
                }
            });
        });
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
    
    const checkImages = setInterval(function() {
        document.querySelectorAll('img[src]').forEach(function(img) {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                if (!img.hasAttribute('data-original-src')) {
                    img.setAttribute('data-original-src', src);
                    img.src = transparentPixel;
                }
            }
        });
        
        if (document.readyState === 'complete') {
            clearInterval(checkImages);
        }
    }, 5);
})();
