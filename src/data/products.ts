export const mockProducts = Array.from({ length: 22 }, (_, i) => ({
  id: (i + 1).toString(),
  title: `Premium Digital Product ${i + 1}`,
  price: Math.floor(Math.random() * 50) + 10,
  description: "High quality asset for your digital journey. This exclusive digital product comes with everything you need to skyrocket your productivity and aesthetic.",
  category: i % 2 === 0 ? "Template" : "Course",
  images: [
    "https://via.placeholder.com/600x400/111111/FFFFFF?text=Product+Image+1",
    "https://via.placeholder.com/600x400/222222/FFFFFF?text=Product+Image+2",
    "https://via.placeholder.com/600x400/333333/FFFFFF?text=Product+Image+3"
  ]
}));
