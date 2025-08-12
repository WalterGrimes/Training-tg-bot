import sharp from "sharp";

export async function preprocessImage(inputPath: string, outputPath: string) {
    await sharp(inputPath)
        .grayscale()
        .linear(1.2, -(128 * 0.2))
        .threshold(150)
        .sharpen()
        .normalize()
        .toFile(outputPath);
}
