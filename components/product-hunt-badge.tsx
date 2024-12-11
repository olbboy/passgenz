"use client";

export function ProductHuntBadge() {
  return (
    <div className="inline-block z-50">
      <a
        href="https://www.producthunt.com/posts/passgenz?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-passgenz"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-90 transition-opacity"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=694044&theme=light"
          alt="PassGenZ - Generate quantum-safe passwords instantly | Product Hunt"
          width="250"
          height="54"
          className="w-[250px] h-[54px]"
        />
      </a>
    </div>
  );
} 