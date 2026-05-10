import { CryptoHasher, S3Client } from "bun";
import { Sharp } from "sharp";
import { rgbaToThumbHash } from "thumbhash";

const s3Client = new S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
  secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
  bucket: Bun.env.S3_BUCKET,
  endpoint: Bun.env.S3_API_ENDPOINT,
  region: Bun.env.S3_REGION,
  retry: Bun.env.S3_RETRY_ATTEMPTS ? Number(Bun.env.S3_RETRY_ATTEMPTS) : 5,
});

export default class MediaUtils {
  static hash(data: ArrayBuffer | Uint8Array): string {
    return new CryptoHasher("sha256").update(data).digest("hex");
  }

  static async generateThumbhash(sharp: Sharp): Promise<string> {
    const { data, info } = await sharp
      .resize(100, 100, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const hash = rgbaToThumbHash(info.width, info.height, data);

    return Buffer.from(hash).toString("base64");
  }
  
  static async uploadToS3(key: string, buffer: ArrayBuffer | Buffer<ArrayBuffer>, mimeType: string): Promise<void> {
    await s3Client.write(key, buffer, { type: mimeType });
  }

  static async deleteFromS3(key: string | string[]): Promise<number> {
    const keys = Array.isArray(key) ? key : [key];

    const deleteTasks = keys.map(async (key) => await s3Client.delete(key));
    
    const deletedItems = await Promise.all(deleteTasks);
    return deletedItems.length;
  }

  static async getObjectList() {
    return await s3Client.list();
  }

  static getPresignedUrl(fileKey: string, expiry: number = 60) {
    return s3Client.presign(fileKey, {
      expiresIn: expiry,
      method: "GET",
    });
  }
}
