import { InternalServerError, NotFoundError, UnprocessableContentError } from "@common/common.http-error";
import MediaRepository from "@media/media.repository";
import { MediaColumn, MediaForm, MediaInsert } from "@media/media.types";
import MediaUtils from "@media/media.utils";
import sharp from "sharp";

export default class MediaService {
  private repo: MediaRepository;
  private bucketName: string;

  constructor(mediaRepository: MediaRepository) {
    const bucketName = Bun.env.S3_BUCKET;
    if (!bucketName)
      throw new Error("S3_BUCKET is undefined");

    this.bucketName = bucketName;
    this.repo = mediaRepository;
  }

  async saveFile(media: MediaForm, uploaderId: string, withUrl: boolean = false) {
    if (!media.file.type.startsWith("image/"))
      throw new UnprocessableContentError("Only images are allowed for now.");

    const arrayBuffer = await media.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileHash = MediaUtils.hash(arrayBuffer);
    const ext = media.file.type.split("/")[1] ?? "bin";
    const key = `${fileHash}.${ext}`;

    const sharpInstance = sharp(buffer);
    const [sharpMeta, thumbhash] = await Promise.all([
      sharpInstance.metadata(),
      MediaUtils.generateThumbhash(sharpInstance),
    ]);

    const mediaData: MediaInsert = {
      uploaderId,
      status: "pending",
      mediaType: "image",
      mimeType: media.file.type,
      key,
      bucketName: this.bucketName,
      fileName: media.file.name,
      fileSize: media.file.size,
      fileHash,
      width: sharpMeta.width,
      height: sharpMeta.height,
      thumbhash,
      extraMetadata: media.extraMetadata,
      altText: media.altText ?? null,
      isPublic: true,
    };
    
    const record = await this.repo.save(mediaData);
    if (!record) throw new InternalServerError("Database reservation failed.");
    
    if (record.status === "ready") return record;

    try {
      await MediaUtils.uploadToS3(key, buffer, media.file.type);
    } catch (err) {
      console.error("S3 Upload Failed:", err);
      await this.repo.deleteByKey(key).catch(console.error);
      throw new InternalServerError("Storage upload failed. System rolled back.");
    }

    try {
      const updatedMedia = await this.repo.updateStatus(key, "ready");

      if (!updatedMedia) {
        console.error("Media result is undefined after status update for key:", key);
        throw new InternalServerError("Media status update failed.");
      }

      if (!withUrl) return updatedMedia;

      const EXPIRY_SECS = 3600;
      const url = MediaUtils.getPresignedUrl(key, EXPIRY_SECS);

      return { ...updatedMedia, url };
      
    } catch (err) {
      console.error("File in S3 but DB update failed:", err);
      await MediaUtils.deleteFromS3(key).catch(console.error);
      throw new InternalServerError("Record update failed. Storage rolled back.");
    }
  }

  async getFilesData(ids: string[], queryColumns: MediaColumn[], withUrl: boolean = false) {
    const columns = withUrl 
      ? [...queryColumns, "key"] as MediaColumn[] 
      : queryColumns;
    
    const mediaData = await this.repo.findByIdsFromQueries(ids, columns);

    console.log(mediaData);

    if (!withUrl) return mediaData;
    
    try {
      const EXPIRY_SECS = 3600;
      return mediaData.map((data) => ({
        ...data, 
        url: MediaUtils.getPresignedUrl(data.key, EXPIRY_SECS)
      }));
    } catch (err) {
      console.error("S3 URL presign error:", err);
      throw err;
    }
  }

  async getAllMediaData() {
    return await this.repo.getAllMediaData();
  }

  async deleteFile(key: string) {
    const deletedFile = await this.repo.deleteByKey(key);

    if (!deletedFile)
      throw new NotFoundError(`Key '${key}' not found in database.`);
    
    await MediaUtils.deleteFromS3(key);

    return deletedFile;
  }

  async clearMediaTable() {
    await this.repo.deleteAll();
  }

  async purgeDanglingFiles() {
    const danglingKeys = await this.repo.findDanglingKeys();

    try {
      const deletedItemsCount = await MediaUtils.deleteFromS3(danglingKeys);
      await this.repo.deleteByKeys(danglingKeys);
      return deletedItemsCount;
    } catch (err) {
      console.error("S3 Delete Failed:", err);
      throw new InternalServerError("Internal storage cleanup error.");
    }
  }
}
