import { recipesData } from "@/data/recipes";
import { RecipeDetail } from "@/components/recipe/RecipeDetail";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return recipesData.map((recipe) => ({
    id: recipe.id,
  }));
}

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = recipesData.find((r) => r.id === params.id);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetail recipe={recipe} />;
}
