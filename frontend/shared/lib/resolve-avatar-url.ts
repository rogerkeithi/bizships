const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function resolveAvatarUrl(avatarUrl?: string) {
  if (!avatarUrl) {
    return undefined;
  }

  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return `${API_BASE_URL}${avatarUrl}`;
}
