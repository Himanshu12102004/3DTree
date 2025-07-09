export async function loadShader(shaderPath: string): Promise<string> {
  const file = await fetch(shaderPath);
  return file.text();
}
