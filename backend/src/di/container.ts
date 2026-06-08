import { Container } from "inversify";
import { registerUserModule } from "./modules/user-module";
import { registerPasswordHasherModule } from "./modules/password-hasher-module";
import { registerEmailModule } from "./modules/email-service-module";
import { registerAuditModule } from "./modules/audit-module";
import { registerAuthModule } from "./modules/auth-module";

const container = new Container();

registerUserModule(container);
registerPasswordHasherModule(container);
registerAuditModule(container);
registerEmailModule(container);
registerAuthModule(container);

export { container };
