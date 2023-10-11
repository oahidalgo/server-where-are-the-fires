function areAllIdsDistinct(features) {
  const ids = features.map((feature) => feature.properties.id);
  return ids.every((id, index) => ids.indexOf(id) === index);
}

const features = [];
const result = areAllIdsDistinct(features);
console.log(result);
