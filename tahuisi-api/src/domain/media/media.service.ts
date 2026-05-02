import MediaRepository from "@media/media.repository";
import { MediaColumn } from "@media/media.types";

export default class MediaService {

  private repo: MediaRepository

  constructor(mediaRepository: MediaRepository) {
    this.repo = mediaRepository;
  }

  async queryByIds(columns: MediaColumn[], ids: string[]) {
    return await this.repo.queryByIds(columns, ids);
  }
}