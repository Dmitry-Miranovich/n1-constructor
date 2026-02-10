// init-db.js
const fs = require("fs");
const path = require("path");

const defaultDB = {
  colorBG: [
    {
      id: "color",
      value: "#FFF",
    },
  ],
  blocks: [
    {
      id: "0",
      type: "cardTypes",
    },
    {
      id: "1",
      type: "cards",
    },
    {
      id: "2",
      type: "banners",
    },
  ],
  cardTypes: [
    {
      id: "0",
      name: "Casinos",
      icon: "/uploads/cardTypes/chart-2.svg",
      filter: "casinos",
    },
  ],
  cards: [
    {
      id: "0",
      name: "Card 1",
      imageUrl: "/uploads/cards/card-4.webp",
      type: "casinos",
      status: "exclusive",
      href: "no link",
    },
    {
      id: "1",
      name: "Card 2",
      imageUrl: "/uploads/cards/card-6.webp",
      type: "casinos",
      status: "top",
      href: "no link",
    },
  ],
  banner: [
    {
      id: "0",
      name: "Mega Jackpot Adventure",
      provider: "NetEnt",
      description: "Spin to win big with our progressive jackpot slots",
      imageUrl: "/uploads/banners/banner-3.webp",
    },
    {
      id: "1",
      name: "Live Casino Experience",
      provider: "Evolution Gaming",
      description: "Real dealers, real excitement in HD quality",
      imageUrl: "/uploads/banners/banner-2.webp",
    },
    {
      id: "2",
      name: "Sports Betting Pro",
      provider: "Betsoft",
      description: "Bet on your favorite teams with best odds",
      imageUrl: "/uploads/banners/banner-1.webp",
    },
    {
      id: "3",
      name: "VIP Poker Tables",
      provider: "Playtech",
      description: "High stakes poker with professional players",
      imageUrl: "/uploads/banners/banner-4.webp",
    },
    {
      id: "4",
      name: "Daily Bonus Bonanza",
      provider: "Microgaming",
      description: "Claim your daily rewards and free spins",
      imageUrl: "/uploads/banners/banner-4.webp",
    },
    {
      id: "5",
      name: "Mobile Gaming Hub",
      provider: "Yggdrasil",
      description: "Play anywhere, anytime on your mobile device",
      imageUrl: "/uploads/banners/banner-1.webp",
    },
  ],
};

const dbPath = path.join(__dirname, "db.json");

if (!fs.existsSync(dbPath)) {
  console.log("📁 db.json not found. Creating with default data...");
  fs.writeFileSync(dbPath, JSON.stringify(defaultDB, null, 2));
  console.log("✅ db.json created successfully!");
} else {
  console.log("✅ db.json already exists.");

  try {
    JSON.parse(fs.readFileSync(dbPath, "utf8"));
    console.log("✅ db.json is valid JSON");
  } catch (error) {
    console.error("❌ db.json is corrupted. Creating fresh...");
    fs.writeFileSync(dbPath, JSON.stringify(defaultDB, null, 2));
  }
}
