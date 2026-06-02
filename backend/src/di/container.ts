import { Container } from "inversify";
import { registerUserModule } from "./modules/user-module";
import { registerPasswordHasherModule } from "./modules/password-hasher-module";
import { registerEmailModule } from "./modules/email-service-module";

const container = new Container();

registerUserModule(container);
registerPasswordHasherModule(container);
registerEmailModule(container);

export { container };
