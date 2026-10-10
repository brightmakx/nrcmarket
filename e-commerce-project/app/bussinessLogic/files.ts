
import { writeFile, mkdir,unlink } from "fs/promises";
import path from "path";
import * as fs from "fs";
 

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
];

export async function saveImages(files: (File | Blob)[]) {
    const uploadDir = path.join(
        process.cwd(),
        "public",
        "images"
    );

    if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    for (const f of files) {
        const validation = await validateImage(f);

        if (!validation.valid) {
            continue;
        }

        const bytes = await f.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName =
            (f as File).name ||
            `upload_${Date.now()}.jpg`;

        const filePath = path.join(
            uploadDir,
            fileName
        );

        await writeFile(filePath, buffer);
    }
}

export async function saveImage(
    file: File | Blob,
    name: string
) {
    const validation = await validateImage(file);

    if (!validation.valid) {
        return false;
    }

    const uploadDir = path.join(
        process.cwd(),
        "public",
        "images"
    );

    if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
        uploadDir,
        name
    );

    await writeFile(filePath, buffer);

    return true;
}

export async function saveVideo(
    file: File | Blob,
    name: string
) {
    const uploadDir = path.join(
        process.cwd(),
        "public",
        "images"
    );

    if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
        uploadDir,
        name
    );

    await writeFile(filePath, buffer);
}


/**
 * Validate an image before saving it.
 *
 * Checks:
 * 1. File exists
 * 2. File is not empty
 * 3. File size
 * 4. MIME type
 * 5. Actual file signature
 */
export async function validateImage(
    file: File | Blob
): Promise<{
    valid: boolean;
    error?: string;
}> {
    try {
        // -----------------------------
        // Check file exists
        // -----------------------------

        if (!file) {
            return {
                valid: false,
                error: "Image is required",
            };
        }

        // -----------------------------
        // Check empty file
        // -----------------------------

        if (file.size <= 0) {
            return {
                valid: false,
                error: "Image file is empty",
            };
        }

        // -----------------------------
        // Check file size
        // -----------------------------

        if (file.size > MAX_IMAGE_SIZE) {
            return {
                valid: false,
                error: "Image must not exceed 5MB",
            };
        }

        // -----------------------------
        // Check MIME type
        // -----------------------------

        if (
            file.type &&
            !ALLOWED_IMAGE_TYPES.includes(
                file.type.toLowerCase()
            )
        ) {
            return {
                valid: false,
                error: "Unsupported image type",
            };
        }

        // -----------------------------
        // Check actual file signature
        // -----------------------------

        const signatureValid =
            await isImageBySignature(file);

        if (!signatureValid) {
            return {
                valid: false,
                error: "Invalid image file",
            };
        }

        return {
            valid: true,
        };

    } catch {
        return {
            valid: false,
            error: "Failed to validate image",
        };
    }
}


/**
 * Check the actual binary signature of the image.
 *
 * This prevents someone from simply changing:
 *
 * malicious.exe → malicious.jpg
 *
 * and uploading it as an image.
 */
export async function isImageBySignature(
    file: File | Blob
): Promise<boolean> {
    try {
        const buffer = await file
            .slice(0, 32)
            .arrayBuffer();

        const bytes = new Uint8Array(buffer);

        // --------------------------------
        // JPEG
        // FF D8 FF
        // --------------------------------

        const isJpeg =
            bytes.length >= 3 &&
            bytes[0] === 0xff &&
            bytes[1] === 0xd8 &&
            bytes[2] === 0xff;

        if (isJpeg) {
            return true;
        }

        // --------------------------------
        // PNG
        // 89 50 4E 47 0D 0A 1A 0A
        // --------------------------------

        const pngSignature = [
            0x89,
            0x50,
            0x4e,
            0x47,
            0x0d,
            0x0a,
            0x1a,
            0x0a,
        ];

        const isPng =
            bytes.length >=
                pngSignature.length &&
            pngSignature.every(
                (byte, index) =>
                    bytes[index] === byte
            );

        if (isPng) {
            return true;
        }

        // --------------------------------
        // GIF
        // GIF87a
        // GIF89a
        // --------------------------------

        const isGif =
            bytes.length >= 6 &&
            bytes[0] === 0x47 &&
            bytes[1] === 0x49 &&
            bytes[2] === 0x46 &&
            bytes[3] === 0x38 &&
            (bytes[4] === 0x37 ||
                bytes[4] === 0x39) &&
            bytes[5] === 0x61;

        if (isGif) {
            return true;
        }

        // --------------------------------
        // WEBP
        //
        // RIFF....WEBP
        // --------------------------------

        const isWebp =
            bytes.length >= 12 &&
            bytes[0] === 0x52 &&
            bytes[1] === 0x49 &&
            bytes[2] === 0x46 &&
            bytes[3] === 0x46 &&
            bytes[8] === 0x57 &&
            bytes[9] === 0x45 &&
            bytes[10] === 0x42 &&
            bytes[11] === 0x50;

        if (isWebp) {
            return true;
        }

        // --------------------------------
        // HEIC / HEIF
        //
        // ISO Base Media File Format
        // --------------------------------

        const isFtyp =
            bytes.length >= 12 &&
            bytes[4] === 0x66 &&
            bytes[5] === 0x74 &&
            bytes[6] === 0x79 &&
            bytes[7] === 0x70;

        if (isFtyp) {
            const brand =
                String.fromCharCode(
                    bytes[8],
                    bytes[9],
                    bytes[10],
                    bytes[11]
                );

            const heicBrands = [
                "heic",
                "heix",
                "hevc",
                "hevx",
                "heim",
                "heis",
                "mif1",
                "msf1",
            ];

            if (
                heicBrands.includes(brand)
            ) {
                return true;
            }

            // Check compatible brands
            for (
                let i = 16;
                i + 3 < bytes.length;
                i += 4
            ) {
                const compatibleBrand =
                    String.fromCharCode(
                        bytes[i],
                        bytes[i + 1],
                        bytes[i + 2],
                        bytes[i + 3]
                    );

                if (
                    heicBrands.includes(
                        compatibleBrand
                    )
                ) {
                    return true;
                }
            }
        }

        return false;

    } catch {
        return false;
    }
}

 


export async function deleteFile(
    fileName: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!fileName) {
            return {
                success: false,
                error: "File name is required",
            };
        }

        const uploadDir = path.join(
            process.cwd(),
            "public",
            "images"
        );

        // Securely resolve the file path
        const filePath = path.resolve(uploadDir, fileName);

        // Security check: Ensure the resolved path stays within the intended directory
        if (!filePath.startsWith(uploadDir)) {
            return {
                success: false,
                error: "Invalid file path",
            };
        }

        // Delete the file
        await unlink(filePath);

        return {
            success: true,
        };

    } catch (error: any) {
        // Handle case where the file doesn't exist
        if (error.code === "ENOENT") {
            return {
                success: false,
                error: "File not found",
            };
        }

        return {
            success: false,
            error: "Failed to delete file",
        };
    }
}