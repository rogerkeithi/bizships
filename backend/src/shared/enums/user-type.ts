export enum UserType {
  ADMINISTRATOR = "ADMINISTRATOR",
  USER = "USER",
  MODERATOR = "MODERATOR",
}

export const UserTypeLabels: Record<UserType, string> = {
  [UserType.ADMINISTRATOR]: "Administrador",
  [UserType.USER]: "Usuário",
  [UserType.MODERATOR]: "Moderador",
};
