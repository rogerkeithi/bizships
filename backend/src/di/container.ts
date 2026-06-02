import { Container } from "inversify";
import { registerUserModule } from "./modules/user-module";

const container = new Container();

registerUserModule(container);

export { container };
