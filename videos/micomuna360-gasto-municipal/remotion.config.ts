import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

/*
 * En la nube de Claude hay un Chromium ya instalado; en otro computador
 * Remotion descarga el suyo automáticamente.
 */
const LOCAL_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(LOCAL_SHELL)) Config.setBrowserExecutable(LOCAL_SHELL);
