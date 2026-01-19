"use client";

import { useEffect, useState } from "react";

type Props = {
  title?: string;
};

export default function ShareLinkButtons({ title = "Thirukkural – A Day" }: Props) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const waHref = `https://wa.me/?text=${encodeURIComponent(url)}`;

  return (
    <div className="mt-4 flex items-center gap-4">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-green-600 hover:underline"
      >
        Share on WhatsApp
      </a>

      <button
        type="button"
        onClick={async () => {
          if (navigator.share) {
            await navigator.share({ title, url });
          }
        }}
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        Share
      </button>
    </div>
  );
}
