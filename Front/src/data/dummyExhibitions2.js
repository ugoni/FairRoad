const topics = ["🎨 문화", "💻 IT", "🏭 산업", "🌿 환경"];

const dummyExhibitions2 = Array.from({ length: 100 }, (_, index) => {
  const topic = topics[index % topics.length];
  return {
    id: index + 1,
    topic,
    name: `${topic.split(' ')[1]} 전시 ${index + 1}`,
    place: `장소 ${index + 1}`,
    date: `2025-08-${(index % 28) + 1} ~ 2025-09-${(index % 28) + 2}`,
    image: `https://source.unsplash.com/400x300/?exhibition,${index + 1}`
  };
});

export default dummyExhibitions2;
