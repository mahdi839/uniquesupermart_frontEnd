import style from "./hero.module.css";

export default function HeroSkeleton() {
  return (
    <div className="container hero_banner" aria-hidden="true">
      <div className={`hero_banner_img ${style["skeleton-banner"]}`} />
    </div>
  );
}
