import { createCmsConfig } from "./cms-config.ts";
import { cmsEnvironment } from "./environment.ts";

export default createCmsConfig(cmsEnvironment(process.env, "migration"));
