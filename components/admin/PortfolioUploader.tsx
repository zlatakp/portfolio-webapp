import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";

interface PortfolioFile {
  id: string;
  name: string;
  created_at?: string;
}

interface PortfolioUploaderProps {
  initialFiles: PortfolioFile[];
}

export async function PortfolioUploader({ initialFiles }: PortfolioUploaderProps) {
  async function uploadPortfolioImage(formData: FormData) {
    "use server";

    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return;
    }

    const supabase = getSupabaseServerClient();
    const filePath = `gallery/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from("portfolio")
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard/portfolio");
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] border border-stone-800 bg-stone-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">Portfolio</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
          Upload gallery images for the public portfolio.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
          Files are uploaded into the public `portfolio` bucket under the `gallery/`
          path. The bucket must already exist in Supabase.
        </p>

        <form action={uploadPortfolioImage} className="mt-6 flex flex-col gap-4 sm:flex-row">
          <input
            accept="image/jpeg,image/png,image/webp"
            className="block w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 file:mr-4 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-950"
            name="image"
            required
            type="file"
          />
          <button
            className="rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100"
            type="submit"
          >
            Upload image
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {initialFiles.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-stone-700 px-5 py-6 text-sm text-stone-400">
            No portfolio images uploaded yet.
          </p>
        ) : (
          initialFiles.map((file) => (
            <article
              key={file.id}
              className="rounded-[1.5rem] border border-stone-800 bg-stone-900/60 p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Gallery asset
              </p>
              <h3 className="mt-3 break-all text-base font-medium text-stone-50">
                {file.name}
              </h3>
              {file.created_at ? (
                <p className="mt-2 text-sm text-stone-400">{file.created_at}</p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
