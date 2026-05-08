interface HeroCardProps {
  eyebrow: string;
  title: string;
  image: string;
}

export function HeroCard({ eyebrow, title, image }: HeroCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm flex-shrink-0 w-[340px] xl:w-[420px] h-full overflow-hidden">
      <div className="p-6 xl:p-8 h-full flex flex-col">
        <p className="text-xs xl:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          {eyebrow}
        </p>
        <h3 className="text-2xl xl:text-3xl font-semibold text-foreground mb-6">
          {title}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain max-h-[300px] xl:max-h-[360px]"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
