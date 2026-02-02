import { App } from "./app";

async function bootstrap() {
  const app = new App();
  await app.startServer();
}

bootstrap().catch((err) => {
  console.error("Failed to start application", err);
  process.exit(1);
});