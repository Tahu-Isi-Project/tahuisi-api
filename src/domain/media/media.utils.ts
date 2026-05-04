import { authService } from "@common/common.singleton";
import { CryptoHasher, S3Client } from "bun";
import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

const s3Client = new S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
  secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
  bucket: Bun.env.S3_BUCKET,
  endpoint: Bun.env.S3_ENDPOINT,
  region: Bun.env.S3_REGION,
});

export default class MediaUtils {
  static hash(data: ArrayBuffer | Uint8Array): string {
    return new CryptoHasher("sha256").update(data).digest("hex");
  }

  static async generateThumbhash(arrayBuffer: ArrayBuffer): Promise<string> {
    const { data, info } = await sharp(arrayBuffer)
      .resize(100, 100, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const hash = rgbaToThumbHash(info.width, info.height, data);

    return Buffer.from(hash).toString("base64");
  }

  static getExtension(mimeType: string): string {
    return mimeType.split("/")[1] ?? "bin";
  }

  static async uploadToS3(key: string, buffer: ArrayBuffer, mimeType: string): Promise<void> {
    await s3Client.write(key, buffer, { type: mimeType });
  }

  static async deleteFromS3(key: string): Promise<void> {
    await s3Client.delete(key);
  }

  static async checkUploader(uploaderId: string): Promise<boolean> {
    const [user] = await authService.getDisplayNames([uploaderId]);
    return user !== undefined;
  }
}
