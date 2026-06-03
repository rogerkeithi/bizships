import { Container } from "inversify";
import { registerUserModule } from "./modules/user-module";
import { registerPasswordHasherModule } from "./modules/password-hasher-module";
import { registerEmailModule } from "./modules/email-service-module";
import { registerAuditModule } from "./modules/audit-module";
import { JwtService } from "@src/services/jwt/jwt.service";
import { registerAuthModule } from "./modules/auth-module";

const container = new Container();
container.bind(JwtService).toSelf();

registerUserModule(container);
registerPasswordHasherModule(container);
registerAuditModule(container);
registerEmailModule(container);
registerAuthModule(container);

export { container };
