import type { AwilixContainer } from "awilix";
import type { AppContainer } from "@/containers/container";

declare global {
  namespace Express {
    interface Application {
      locals: {
        dbReady: boolean;
        container: AwilixContainer<AppContainer> | null;
        [key: string]: any;
      };
    }
  }
}
export {};
