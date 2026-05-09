"use client";

import { useState } from "react";
import type { CatalogFilterId } from "@/data/products";
import { CategoryNav } from "./category-nav";
import { RecommendedGrid } from "./recommended-grid";

export function HomeCatalog() {
  const [activeCategory, setActiveCategory] = useState<CatalogFilterId>("all");

  return (
    <>
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main>
        <RecommendedGrid activeCategory={activeCategory} />
      </main>
    </>
  );
}
