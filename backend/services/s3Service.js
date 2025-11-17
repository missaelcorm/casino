const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const bucketName = process.env.S3_BUCKET_NAME;

async function listFilesInFolder(folderPath = '') {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: folderPath
        });

        const response = await s3Client.send(command);
        
        if (!response.Contents) {
            return [];
        }

        const files = response.Contents
            .filter(item => !item.Key.endsWith('/'))
            .map(item => ({
                key: item.Key,
                fileName: item.Key.split('/').pop(),
                size: item.Size,
                lastModified: item.LastModified
            }));

        return files;
    } catch (error) {
        console.error('Error listing files from S3:', error);
        throw error;
    }
}

async function getSignedFileUrl(fileKey, expiresIn = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}

function getPublicFileUrl(fileKey) {
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
}

async function getImageUrls(useSignedUrls = false) {
    try {
        const images = await listFilesInFolder('images/');
        
        const imageUrls = {};
        
        for (const image of images) {
            const fileName = image.fileName.split('.')[0];
            
            if (useSignedUrls) {
                imageUrls[fileName] = await getSignedFileUrl(image.key);
            } else {
                imageUrls[fileName] = getPublicFileUrl(image.key);
            }
        }

        return imageUrls;
    } catch (error) {
        console.error('Error getting image URLs:', error);
        throw error;
    }
}

async function getFontUrls(useSignedUrls = false) {
    try {
        const fonts = await listFilesInFolder('fonts/');
        
        const fontUrls = {};
        
        for (const font of fonts) {
            if (useSignedUrls) {
                fontUrls[font.fileName] = await getSignedFileUrl(font.key);
            } else {
                fontUrls[font.fileName] = getPublicFileUrl(font.key);
            }
        }

        return fontUrls;
    } catch (error) {
        console.error('Error getting font URLs:', error);
        throw error;
    }
}

async function getFileUrl(fileKey, useSignedUrl = false) {
    try {
        if (useSignedUrl) {
            return await getSignedFileUrl(fileKey);
        } else {
            return getPublicFileUrl(fileKey);
        }
    } catch (error) {
        console.error('Error getting file URL:', error);
        throw error;
    }
}

async function uploadProfileImage(buffer, fileName, userId, mimeType) {
    try {
        const fileExtension = mimeType.split('/')[1];
        const key = `profile-images/${userId}/${Date.now()}-${fileName}`;
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        });

        await s3Client.send(command);
        
        const url = getPublicFileUrl(key);
        
        return {
            url,
            key
        };
    } catch (error) {
        console.error('Error uploading profile image to S3:', error);
        throw error;
    }
}

async function deleteProfileImage(fileKey) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });

        await s3Client.send(command);
        
        return true;
    } catch (error) {
        console.error('Error deleting profile image from S3:', error);
        throw error;
    }
}

module.exports = {
    listFilesInFolder,
    getSignedFileUrl,
    getPublicFileUrl,
    getImageUrls,
    getFontUrls,
    getFileUrl,
    uploadProfileImage,
    deleteProfileImage,
    s3Client,
    bucketName
};
