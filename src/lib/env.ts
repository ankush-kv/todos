function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Set it in .env locally or in your hosting platform's environment settings, then rebuild.`,
    );
  }
  return value;
}

export const DATABASE_URL = required("DATABASE_URL", process.env.DATABASE_URL);
