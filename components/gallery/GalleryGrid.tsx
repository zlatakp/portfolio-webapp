import Image from "next/image";

interface GalleryImage {
  id: string;
  name: string;
  url: string;
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
          className={`group overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_24px_70px_rgba(58,39,26,0.12)] ${
            index % 3 === 0 ? "xl:translate-y-10" : ""
          }`}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              alt={image.name}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              src={image.url}
            />
          </div>
          <div className="bg-white px-5 py-4">
            <p className="text-sm font-medium text-stone-700">{image.name}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
