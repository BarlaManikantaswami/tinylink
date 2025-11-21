import { useState } from 'react';

export default function useClipboard() {
  const [copied, setCopied] = useState(false);
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  }
  return { copied, copyText };
}
