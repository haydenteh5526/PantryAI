import { getProteinSafety, selectCookingMethod, buildRecipeSystemPrompt } from "../services/recipeEngine";

describe("getProteinSafety", () => {
  it("returns chicken safety for chicken breast", () => {
    const result = getProteinSafety(["Chicken Breast", "Rice"]);
    expect(result).toContain("165°F");
    expect(result).toContain("Do not wash raw chicken");
  });

  it("returns beef steak safety for steak", () => {
    const result = getProteinSafety(["Beef Steak", "Potatoes"]);
    expect(result).toContain("145°F");
  });

  it("returns shrimp safety for shrimp", () => {
    const result = getProteinSafety(["Shrimp", "Pasta"]);
    expect(result).toContain("opaque");
  });

  it("returns default safety when no known protein", () => {
    const result = getProteinSafety(["Rice", "Broccoli"]);
    expect(result).toContain("piping hot");
  });

  it("handles multiple proteins", () => {
    const result = getProteinSafety(["Chicken Breast", "Shrimp"]);
    expect(result).toContain("165°F");
    expect(result).toContain("opaque");
  });
});

describe("selectCookingMethod", () => {
  it("selects stir fry for Asian ingredients", () => {
    const method = selectCookingMethod(["Soy Sauce", "Rice", "Ginger"]);
    expect(method.id).toBe("method_stir_fry");
  });

  it("selects pan sear for steak", () => {
    const method = selectCookingMethod(["Beef Steak", "Butter", "Thyme"]);
    expect(method.id).toBe("method_pan_sear");
  });

  it("selects boil for pasta", () => {
    const method = selectCookingMethod(["Pasta", "Tomato Sauce"]);
    expect(method.id).toBe("method_boil_pasta");
  });

  it("selects oven roast for potatoes and chicken thigh", () => {
    const method = selectCookingMethod(["Potato", "Chicken Thigh", "Rosemary"]);
    expect(method.id).toBe("method_oven_roast");
  });

  it("returns first method as fallback for unknown ingredients", () => {
    const method = selectCookingMethod(["Mystery Ingredient"]);
    expect(method.id).toBe("method_stir_fry");
  });
});

describe("buildRecipeSystemPrompt", () => {
  it("includes ingredients and vibe", () => {
    const method = selectCookingMethod(["Chicken Breast"]);
    const safety = getProteinSafety(["Chicken Breast"]);
    const prompt = buildRecipeSystemPrompt(["Chicken Breast", "Rice"], "eco", method, safety);

    expect(prompt).toContain("Chicken Breast, Rice");
    expect(prompt).toContain("eco");
    expect(prompt).toContain("165°F");
    expect(prompt).toContain("BASE TECHNIQUE");
  });
});
