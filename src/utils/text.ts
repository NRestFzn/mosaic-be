export const chunkText = (text: string, maxLength = 800) => {
  const chunks: string[] = [];
  let current = "";

  const parts = text.split(/\n\n+/);
  for (const part of parts) {
    if ((current + "\n\n" + part).length <= maxLength) {
      current = current ? `${current}\n\n${part}` : part;
    } else {
      if (current) chunks.push(current.trim());
      if (part.length <= maxLength) {
        current = part;
      } else {
        for (let i = 0; i < part.length; i += maxLength) {
          chunks.push(part.slice(i, i + maxLength));
        }
        current = "";
      }
    }
  }

  if (current) chunks.push(current.trim());
  return chunks.filter(Boolean);
};
