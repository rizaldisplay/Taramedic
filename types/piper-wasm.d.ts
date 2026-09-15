declare module '@diffusionstudio/piper-wasm' {
    export interface PiperModule {
        callMain(args: string[]): void;
    }

    export interface PiperModuleOptions {
        print?: (data: string) => void;
        printErr?: (message: string) => void;
        locateFile?: (url: string, scriptDirectory?: string) => string;
    }

    export default function createPiperPhonemize(
        options?: PiperModuleOptions,
    ): Promise<PiperModule>;
}