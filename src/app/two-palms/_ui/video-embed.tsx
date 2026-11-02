"use client";

// The session recording: our own cover (not Drive's auto-thumbnail of whoever
// was on camera) until someone presses play, then the Drive player in place.
import { useState } from "react";

const driveId = (url: string) => url.match(/\/file\/d\/([^/]+)/)?.[1] ?? null;

export function VideoEmbed({ url, title, cover = "/two-palms/img/h/recording.jpg" }: { url: string; title: string; cover?: string }) {
  const [on, setOn] = useState(false);
  const id = driveId(url);
  const src = id ? `https://drive.google.com/file/d/${id}/preview` : url;
  return (
    <div className="vx">
      {on ? (
        <iframe className="vx-frame" src={src} title={title} allow="autoplay; fullscreen" allowFullScreen />
      ) : (
        <button type="button" className="vx-cover" onClick={() => setOn(true)} aria-label={`Play: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" />
          <span className="vx-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
          <span className="vx-lab"><span className="mono">Recording</span>{title}</span>
        </button>
      )}
      <a className="vx-out" href={url} target="_blank" rel="noreferrer">Open in Drive ↗</a>
    </div>
  );
}
