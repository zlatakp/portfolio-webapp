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
      <p className="rounded-[2rem] border border-dashed border-stone-300 px-6 py-10 text-sm text-stone-500">
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
          className={`group overflow-hidden rounded-[2.25rem] bg-stone-200 shadow-[0_24px_70px_rgba(58,39,26,0.12)] ${
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent px-5 py-5 text-stone-50">
              <p className="text-sm font-medium">{image.name}</p>
              {image.caption ? (
                <p className="mt-2 text-sm leading-6 text-stone-100/85">{image.caption}</p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
