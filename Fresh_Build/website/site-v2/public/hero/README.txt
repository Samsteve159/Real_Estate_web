MANIFEST SITE — HERO VIDEO SWAP POINT
======================================

Drop Akshay's real footage here:

  public/hero/hero.mp4          <- the video (autoPlay muted loop)
  public/hero/hero-poster.jpg   <- a single static frame for the poster
                                   (shown before video loads + on reduced-motion)

The <video> tag in src/components/MotionHero.tsx already points to these paths.
No code change needed — just add the files.

UNTIL REAL FOOTAGE EXISTS:
  The site shows a CSS-animated dark gradient (slow drift) instead.
  It looks intentional — not broken — and keeps the layout identical.

LOGO NOTE:
  The coloured Manifest logo (navy+gold on white) does not read well on a
  black background. The site currently uses a white Raleway wordmark as a
  fallback. To use the real logo on the dark nav, provide a white/mono
  version of the logo:

    public/manifest-logo-white.png   (or .svg)

  Then update src/components/Shell.tsx (search for "LOGO ASSET NOTE").
