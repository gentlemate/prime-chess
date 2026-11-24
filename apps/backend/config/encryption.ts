import env from "#start/env";
import { defineConfig, drivers } from "@adonisjs/core/encryption";

const encryptionConfig = defineConfig({
    default: "legacy",

    list: {
        legacy: drivers.legacy({
            keys: [env.get("APP_KEY")],
        }),
    },
});

export default encryptionConfig;

declare module "@adonisjs/core/types" {
    export interface EncryptorsList extends InferEncryptors<typeof encryptionConfig> {}
}
