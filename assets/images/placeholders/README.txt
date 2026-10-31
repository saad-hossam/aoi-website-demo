AOI Frontend — Image placeholders

Phase 1 does not ship official AOI imagery. The homepage hero uses
a CSS gradient with a subtle industrial grid pattern as a clearly
temporary visual. When official licensed imagery becomes available:

  1. Place the hero image at:
       assets/images/hero/hero-main.jpg
  2. In assets/css/style.css, within `.hero__bg`, replace the
     gradient background with:
       background-image: url('../../assets/images/hero/hero-main.jpg');
       background-size: cover;
       background-position: center;
  3. Keep `.hero__overlay` to preserve text readability.

Folder intent (Phase 1 only creates the folder; files are added later):
  logo/       – temporary wordmark or official logo (SVG preferred)
  hero/       – hero images
  chairman/   – portraits (with consent, official use only)
  products/   – product photos
  projects/   – project photos
  news/       – news thumbnails
  partners/   – partner logos (with permission)

Note: This project does NOT include an invented official AOI logo.
The header uses a clearly labeled "AOI" text mark as a temporary
placeholder and must be replaced with the officially approved logo.