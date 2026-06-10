import { getFavorites, addFavorite, removeFavorite, isFavorited } from "../lib/favorites";

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; return Promise.resolve(); }),
}));

const mockRecipe = {
  title: "Test Recipe",
  calories: 500,
  ingredients: ["Chicken", "Rice"],
  steps: ["Step 1", "Step 2"],
  vibe: "eco",
};

beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
});

describe("favorites", () => {
  it("returns empty array when no favorites", async () => {
    const result = await getFavorites();
    expect(result).toEqual([]);
  });

  it("adds a favorite", async () => {
    await addFavorite(mockRecipe, "japanese");
    const result = await getFavorites();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Test Recipe");
    expect(result[0].cuisine).toBe("japanese");
    expect(result[0].id).toBeDefined();
    expect(result[0].savedAt).toBeDefined();
  });

  it("removes a favorite by id", async () => {
    await addFavorite(mockRecipe);
    const before = await getFavorites();
    expect(before).toHaveLength(1);

    await removeFavorite(before[0].id);
    const after = await getFavorites();
    expect(after).toHaveLength(0);
  });

  it("checks if recipe is favorited by title", async () => {
    expect(await isFavorited("Test Recipe")).toBe(false);
    await addFavorite(mockRecipe);
    expect(await isFavorited("Test Recipe")).toBe(true);
    expect(await isFavorited("Other Recipe")).toBe(false);
  });

  it("adds newest favorites first", async () => {
    await addFavorite({ ...mockRecipe, title: "First" });
    await addFavorite({ ...mockRecipe, title: "Second" });
    const result = await getFavorites();
    expect(result[0].title).toBe("Second");
    expect(result[1].title).toBe("First");
  });
});
