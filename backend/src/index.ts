async function bootstrap() {
  const { default: app } = await import("./app");

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
