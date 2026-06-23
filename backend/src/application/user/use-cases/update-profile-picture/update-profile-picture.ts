import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { inject, injectable } from "inversify";

import { TYPES } from "@src/di/types";
import { IUserRepository } from "@src/domain/user/repositories/use-repository.interface";
import {
  InvalidProfileImageError,
  ProfileImageTooLargeError,
  UserNotFoundError,
} from "@src/shared/errors/user-errors";
import { UpdateProfilePictureReq } from "./update-profile-picture.req.dto";
import { UpdateProfilePictureRes } from "./update-profile-picture.res.dto";

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const uploadRoot = process.env.UPLOADS_DIR ?? path.resolve("uploads");
const profilePicturesDir = path.join(uploadRoot, "profile-pictures");
const publicUploadPath = "/uploads/profile-pictures";

const extensionByMimeType: Record<UpdateProfilePictureReq["mimeType"], string> =
  {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

@injectable()
export class UpdateProfilePictureUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: UpdateProfilePictureReq): Promise<UpdateProfilePictureRes> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const imageBuffer = Buffer.from(
      data.imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );

    if (!imageBuffer.length) {
      throw new InvalidProfileImageError();
    }

    if (imageBuffer.byteLength > MAX_IMAGE_BYTES) {
      throw new ProfileImageTooLargeError();
    }

    const extension = extensionByMimeType[data.mimeType];
    const fileName = `${user.userId}-${randomUUID()}.${extension}`;
    const filePath = path.join(profilePicturesDir, fileName);
    const avatarUrl = `${publicUploadPath}/${fileName}`;

    await fs.mkdir(profilePicturesDir, { recursive: true });
    await fs.writeFile(filePath, imageBuffer);

    await this.removePreviousLocalAvatar(user.avatarUrl);

    user.setAvatarUrl(avatarUrl);
    await this.userRepository.update(user);

    return { avatarUrl };
  }

  private async removePreviousLocalAvatar(avatarUrl?: string) {
    if (!avatarUrl?.startsWith(`${publicUploadPath}/`)) {
      return;
    }

    const fileName = path.basename(avatarUrl);
    const filePath = path.join(profilePicturesDir, fileName);

    try {
      await fs.unlink(filePath);
    } catch {
      // The old file may have been removed by a deployment or volume cleanup.
    }
  }
}
