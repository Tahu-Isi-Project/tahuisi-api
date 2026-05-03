import sharp from "sharp";
import { ConflictError, InternalServerError, UnprocessableContentError } from "@common/common.http-error";
import MediaRepository from "@media/media.repository";
import { MediaColumn, MediaForm } from "@media/media.types";
import { UNIQUE_CONSTRAINT_ERROR } from "@common/common.constants";
import MediaUtils from "@media/media.utils";
import { mediaEntitySchema } from "@media/media.entity";

export default class MediaService {
  private repo: MediaRepository;
  private bucketName: string

  constructor(mediaRepository: MediaRepository) {
    const bucketName = Bun.env.S3_BUCKET;
    if (!bucketName)
      throw new Error("S3_BUCKET is undefined");

    this.bucketName = bucketName;
    this.repo = mediaRepository;
  }

  async saveFile(media: MediaForm): Promise<void> {
    const uploaderExists = await MediaUtils.checkUploader(media.uploaderId);
    if (!uploaderExists)
      throw new UnprocessableContentError("Uploader does not exist.");

    const [mediaType] = media.file.type.split("/", 1);

    if (mediaType !== "image")
      throw new UnprocessableContentError("Only images are allowed (for now).");

    const arrayBuffer = await media.file.arrayBuffer();
    const mimeType = media.file.type;
    const ext = MediaUtils.getExtension(mimeType);

    const fileHash = MediaUtils.hash(arrayBuffer);
    const key = `${fileHash}.${ext}`;

    const [sharpMeta, thumbhash] = await Promise.all([
      sharp(arrayBuffer).metadata(),
      MediaUtils.generateThumbhash(arrayBuffer),
    ]);

    const mediaData = mediaEntitySchema.parse({
      uploaderId: media.uploaderId,
      mediaType,
      mimeType,
      bucketName: this.bucketName,
      key,
      fileName: `${fileHash}.${ext}`,
      fileSize: media.file.size,
      fileHash,
      width: sharpMeta.width,
      height: sharpMeta.height,
      thumbhash,
      altText: media.altText ?? null,
      isPublic: true,
    });

    try {
      await this.repo.saveMediaData(mediaData);
    } catch (err: any) {
      if (err.code === UNIQUE_CONSTRAINT_ERROR && err.message.includes("media.file_hash"))
        throw new ConflictError("Existing file hash already exists in database.");
      
      console.error("DB operation failed: ", err);
      throw err;
    }

    try {
      await MediaUtils.uploadToS3(key, arrayBuffer, mimeType);
    } catch (err: any) {
      await this.repo.deleteMediaDataByKey(key);

      console.error("S3 upload failed: ", err);
      throw new InternalServerError("Internal error occurred during file upload.");
    }
  }

  async getFiles(queryColumns: MediaColumn[], ids: string[]) {
    return await this.repo.findFilesByIds(queryColumns, ids);
  }

  async getAllMediaData() {
    return await this.repo.getAllMediaData();
  }

  async deleteFile(key: string) {
    await this.repo.deleteMediaDataByKey(key);
    await MediaUtils.deleteFromS3(key);
  }

  async clearMediaTable() {
    await this.repo.deleteAll();
  }
}
