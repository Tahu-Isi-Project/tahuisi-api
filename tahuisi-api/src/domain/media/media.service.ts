import { NotFoundError } from "@common/common.error";
import MediaRepository from "@media/media.repository";
import { MediaColumn } from "@media/media.types";

export default class MediaService {

  private repo: MediaRepository

  constructor(mediaRepository: MediaRepository) {
    this.repo = mediaRepository;
  }

  async queryByIds(columns: MediaColumn[], ids: string[]) {
    const res = await this.repo.queryByIds(columns, ids);

    if (res.length === 0)
      throw new NotFoundError(
        "No assets found that matches any of the given ids."
      );

    return res;
  }
}