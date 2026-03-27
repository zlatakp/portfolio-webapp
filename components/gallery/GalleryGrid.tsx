import Image from "next/image";

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <p className="rounded-[2rem] border border-dashed border-[var(--public-card-border)] px-6 py-10 text-sm text-[var(--public-muted-text)]">
        The portfolio gallery is empty right now. Upload images in the admin dashboard
        to populate this page.
      </p>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {images.map((image, index) => (
        <article
          key={image.id}
          className={`group overflow-hidden rounded-[2.25rem] bg-[var(--public-card-surface)] shadow-[0_24px_70px_var(--public-shadow-color)] ${
            index % 3 === 0 ? "xl:translate-y-10" : index % 3 === 1 ? "xl:-translate-y-2" : ""
          }`}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              alt={image.alt ?? image.name}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              src={image.url}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-5 py-5 text-[var(--public-image-overlay-text)]">
              <p className="text-sm font-medium">{image.name}</p>
              {image.caption ? (
                <p className="mt-2 text-sm leading-6 text-[var(--public-image-overlay-muted-text)]">
                  {image.caption}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
