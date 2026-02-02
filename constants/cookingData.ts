// ==========================================
// 1. GENERAL KITCHEN SAFETY (Applies to ALL)
// ==========================================
export const GENERAL_SAFETY_RULES = [
    "Wash hands with soap for 20 seconds before and after handling food.",
    "Never place cooked food back on the same plate that held raw meat.",
    "Wash all WHOLE produce under cold running water, even if you plan to peel it.",
    "Do NOT re-wash bagged greens labeled 'triple-washed' or 'ready-to-eat' (this increases risk of cross-contamination from your sink).",
    "Refrigerate perishable foods within 2 hours (1 hour if temp is above 90°F/32°C).",
    "When in doubt, throw it out."
  ];
  
// ==========================================
// 2. PROTEIN & INGREDIENT SPECIFIC SAFETY (The Critical List)
// ==========================================
// The AI will look up the user's protein here to inject the specific rule.
export const PROTEIN_SAFETY: Record<string, string> = {
    // POULTRY (Strict USDA Standards)
    chicken: "Cook to internal temp of 165°F (74°C). Juices must run clear. Do not wash raw chicken (spreads bacteria).",
    turkey: "Cook to internal temp of 165°F (74°C). Check the thickest part of the thigh.",
    duck: "Cook to internal temp of 165°F (74°C) for full safety. (Note: Culinary preference is often lower, but 165°F is the safe standard).",

    // RED MEAT
    beef_steak: "Cook to 145°F (63°C) for medium-rare, 160°F (71°C) for medium. Rest for 3 mins.",
    beef_ground: "Cook to 160°F (71°C). No pink should remain. (Bacteria mixes throughout ground meat).",
    pork_chops: "Cook to 145°F (63°C). A little pink in the center is safe. Rest for 3 mins.",
    pork_ground: "Cook to 160°F (71°C).",
    lamb: "Cook to 145°F (63°C) for medium-rare. Rest for 3 mins.",

    // SEAFOOD
    fish: "Cook to 145°F (63°C) or until flesh is opaque and flakes easily with a fork.",
    salmon: "Cook to 145°F (63°C). Flesh should flake. Skin should be crisp if seared.",
    shrimp: "Cook until opaque and pearly pink. Shape should curl into a 'C'. Do not overcook or it becomes rubbery.",
    scallops: "Sear quickly (2 mins per side) until milky white and firm. Do not overcook.",
    mussels: "Discard any that don't close before cooking. Discard any that don't open after cooking.",

    // VEGETARIAN / TOXIN WARNINGS
    eggs: "Cook until yolks and whites are firm. Dishes containing eggs: 160°F (71°C).",
    tofu: "Safe to eat raw, but for crispy texture, press out water and fry until golden.",
    beans_kidney: "DANGER - TOXIN RISK: If using dried beans, soak 5 hours, drain, then boil vigorously in fresh water for at least 10 minutes. NEVER cook dried kidney beans directly in a slow cooker.",
    leftovers: "Reheat strictly to 165°F (74°C) before eating."
};

// ==========================================
// 3. MASTER COOKING METHODS (The Logic)
// ==========================================
export const COOKING_METHODS = [
    {
      id: 'method_stir_fry',
      title: 'Stir Fry / Wok Toss',
      description: 'High heat, fast cooking. Best for Asian styles or quick meals.',
      keywords: ['wok', 'soy sauce', 'ginger', 'rice', 'noodles', 'snap peas', 'pepper', 'thin strips'],
      generic_steps: [
        'Prep: Cut protein and veg into uniform bite-sized pieces.',
        'Heat: Get pan/wok ripping hot with high-smoke-point oil (canola, vegetable).',
        'Sear Protein: Cook protein first until safe temp is reached. Remove.',
        'Cook Veg: Add hard veg (carrots, broccoli) first (2-3 mins), then soft veg (greens) last.',
        'Sauce: Return protein, add aromatics (garlic/ginger) and sauce. Toss for 60 seconds.',
        'Serve immediately.'
      ]
    },
    {
      id: 'method_oven_roast',
      title: 'Sheet Pan Roast',
      description: 'Hands-off, caramelization. Good for root veg and chicken parts.',
      keywords: ['potato', 'sweet potato', 'chicken thigh', 'drumstick', 'rosemary', 'sheet', 'tray'],
      generic_steps: [
        'Preheat oven to 400°F (200°C).',
        'Dry ingredients thoroughly with paper towels (moisture = steam, not roast).',
        'Toss with oil, salt, and seasonings.',
        'Spread in single layer. Do not overcrowd.',
        'Roast for 20-30 mins (Veggies) or until Protein hits safety temp.',
        'Flip halfway through.'
      ]
    },
    {
      id: 'method_pan_sear',
      title: 'Pan Sear / Sauté',
      description: 'Crispy crust, juicy inside. Best for steaks, fish fillets, chops.',
      keywords: ['steak', 'salmon', 'fillet', 'chop', 'butter', 'thyme', 'breast'],
      generic_steps: [
        'Pat protein completely dry.',
        'Season heavily with salt and pepper.',
        'Heat oil in skillet (Cast iron is best) over medium-high.',
        'Lay protein away from you. Do not touch for 3-4 mins to form crust.',
        'Flip, lower heat, and cook to specific safety temp.',
        'Rest meat for 5-10 mins before slicing.'
      ]
    },
    {
      id: 'method_soup_stew',
      title: 'Soup / Stew / Curry',
      description: 'Low and slow. Best for tough meats, root veg, and comfort.',
      keywords: ['broth', 'stock', 'onion', 'carrot', 'celery', 'coconut milk', 'curry', 'stew meat'],
      generic_steps: [
        'Sauté aromatics (onion, garlic, spices) in oil until soft.',
        'Add main ingredients and cover with liquid (broth/water/coconut milk).',
        'Bring to boil, then immediately reduce to LOW simmer.',
        'Cover and cook. (Veg: 20 mins. Chicken: 30 mins. Beef chunks: 2 hours).',
        'Check if fork-tender.',
        'Season with salt/acid (lemon/lime) at the very end.'
      ]
    },
    {
      id: 'method_boil_pasta',
      title: 'Boiling (Pasta/Grains)',
      description: 'Cooking in liquid. For starch bases.',
      keywords: ['pasta', 'spaghetti', 'macaroni', 'quinoa', 'lentil', 'rice'],
      generic_steps: [
        'Boil a large pot of salted water (tastes like the sea).',
        'Add grains/pasta.',
        'Cook according to package (usually 8-12 mins) until al dente.',
        'Reserve 1 cup of starchy cooking water before draining.',
        'Drain and toss with sauce/oil immediately.'
      ]
    },
    {
      id: 'method_steam',
      title: 'Steaming',
      description: 'Gentle, healthy, moist. Best for delicate fish and greens.',
      keywords: ['fish fillet', 'dumpling', 'bok choy', 'broccoli', 'steamer'],
      generic_steps: [
        'Bring 1 inch of water to boil in a pot.',
        'Place ingredients in steamer basket (don\'t let water touch food).',
        'Cover tightly.',
        'Steam until done (Greens: 3-5 mins. Fish: 6-10 mins).',
        'Be careful of hot steam when opening lid.'
      ]
    },
    {
      id: 'method_air_fry',
      title: 'Air Fryer',
      description: 'Convection crisping. Faster than oven.',
      keywords: ['frozen', 'wing', 'fry', 'nugget', 'potato wedge', 'tofu'],
      generic_steps: [
        'Preheat Air Fryer to 375°F (190°C).',
        'Toss ingredients in a small amount of oil (essential for conduction).',
        'Arrange in basket without stacking too high.',
        'Cook for 10-15 mins, shaking the basket every 5 mins.',
        'Check internal temp for safety.'
      ]
    },
    {
      id: 'method_salad',
      title: 'Raw / Cold Assembly',
      description: 'No cooking required.',
      keywords: ['lettuce', 'cucumber', 'tomato', 'avocado', 'canned tuna', 'salad'],
      generic_steps: [
        'Wash and dry all produce.',
        'Chop into bite-sized pieces.',
        'Whisk dressing (3 parts oil, 1 part vinegar/citrus).',
        'If using protein (chicken/egg), ensure it is pre-cooked and cooled.',
        'Toss everything together right before eating to prevent sogginess.'
      ]
    },
    {
      id: 'method_braise',
      title: 'Braise',
      description: 'Sear then simmer. Best for whole legs or large cuts.',
      keywords: ['thigh', 'leg', 'roast', 'dutch oven', 'wine'],
      generic_steps: [
        'Sear meat on all sides in hot oil until brown.',
        'Remove meat, sauté veggies in same pan.',
        'Add liquid (wine/broth) to scrape up browned bits (deglaze).',
        'Return meat, liquid should cover halfway.',
        'Cover and simmer on low (stovetop or oven) until meat falls off bone.'
      ]
    },
    {
      id: 'method_slow_cooker',
      title: 'Slow Cooker / Crockpot',
      description: 'Set and forget.',
      keywords: ['chuck roast', 'shoulder', 'pulled pork', 'slow cooker'],
      generic_steps: [
        'Place firm vegetables (potatoes, carrots) at the bottom.',
        'Place meat on top.',
        'Pour in liquids and seasonings.',
        'Cover and cook: High for 4 hours OR Low for 8 hours.',
        'Do not lift lid (releases heat).'
      ]
    }
  ];