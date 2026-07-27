import fs from "node:fs";
import path from "node:path";
import { generateProject } from "../packages/generator/src/index.js";

const sampleBuilderConfig = {
  version: 1,
  app: {
    name: "Cà Phê Phố",
    description: "App đặt nước uống mang đi",
    primaryColor: "#006af5",
    locale: "vi",
  },
  pages: [
    {
      id: "home",
      title: "Trang chủ",
      path: "/",
      showInTabBar: true,
      icon: "zi-home",
      blocks: [
        {
          id: "b1",
          type: "banner",
          props: {
            images: [
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
            ],
            autoplay: true,
          },
        },
        {
          id: "b2",
          type: "product-list",
          props: {
            title: "Món hot hôm nay",
          },
        },
      ],
    },
    {
      id: "booking",
      title: "Đặt bàn trước",
      path: "/booking",
      showInTabBar: true,
      icon: "zi-calendar",
      blocks: [
        {
          id: "b3",
          type: "booking-form",
          props: {},
        },
      ],
    },
  ],
};

function main() {
  const outputDir = path.resolve(process.cwd(), "output-app");
  console.log(`🚀 Generative Output Project to: ${outputDir}`);

  // Generate virtual file tree
  const tree = generateProject({ config: sampleBuilderConfig });

  // Clean output directory if exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  // Write files to disk
  for (const file of tree) {
    const filePath = path.join(outputDir, file.path);
    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(filePath, file.content, "utf-8");
    console.log(`  ✓ Generated: ${file.path}`);
  }

  console.log(`\n🎉 Project successfully generated to disk!`);
  console.log(`👉 Run commands to test:`);
  console.log(`   cd output-app`);
  console.log(`   npm install`);
  console.log(`   npx zmp start\n`);
}

main();
