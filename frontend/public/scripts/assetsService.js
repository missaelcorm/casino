class AssetsService {
    constructor() {
        this.cache = {
            images: null,
            fonts: null,
            all: null
        };
    }

    async getImages(useCache = true) {
        if (useCache && this.cache.images) {
            return this.cache.images;
        }

        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASSETS_IMAGES));
            
            if (!response.ok) {
                throw new Error('Error al obtener imágenes');
            }

            const data = await response.json();
            
            if (data.success) {
                this.cache.images = data.images;
                return data.images;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            throw error;
        }
    }


    async getFonts(useCache = true) {
        if (useCache && this.cache.fonts) {
            return this.cache.fonts;
        }

        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASSETS_FONTS));
            
            if (!response.ok) {
                throw new Error('Error al obtener fuentes');
            }

            const data = await response.json();
            
            if (data.success) {
                this.cache.fonts = data.fonts;
                return data.fonts;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllAssets(useCache = true) {
        if (useCache && this.cache.all) {
            return this.cache.all;
        }

        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASSETS_ALL));
            
            if (!response.ok) {
                throw new Error('Error al obtener assets');
            }

            const data = await response.json();
            
            if (data.success) {
                this.cache.all = data.assets;
                this.cache.images = data.assets.images;
                this.cache.fonts = data.assets.fonts;
                return data.assets;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            throw error;
        }
    }


    async getFileUrl(filePath) {
        try {
            const response = await fetch(`${getApiUrl(API_CONFIG.ENDPOINTS.ASSETS_FILE)}/${filePath}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener archivo');
            }

            const data = await response.json();
            
            if (data.success) {
                return data.url;
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            throw error;
        }
    }


    async getImageUrl(imageName) {
        const images = await this.getImages();
        return images[imageName] || null;
    }

    async loadImage(imgElement, imageName) {
        try {
            const url = await this.getImageUrl(imageName);
            
            if (url) {
                imgElement.src = url;
            }
        } catch (error) {
        }
    }


    async loadFonts() {
        try {
            const fonts = await this.getFonts();
            
            for (const [fontName, fontUrl] of Object.entries(fonts)) {
                const fontFace = new FontFace(fontName, `url(${fontUrl})`);
                await fontFace.load();
                document.fonts.add(fontFace);
            }
        } catch (error) {
        }
    }


    async preloadImages() {
        try {
            const images = await this.getImages();
            const promises = [];

            for (const [name, url] of Object.entries(images)) {
                const promise = new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(name);
                    img.onerror = () => reject(name);
                    img.src = url;
                });
                promises.push(promise);
            }

            await Promise.all(promises);
        } catch (error) {
        }
    }


    clearCache() {
        this.cache = {
            images: null,
            fonts: null,
            all: null
        };
    }
}

const assetsService = new AssetsService();
