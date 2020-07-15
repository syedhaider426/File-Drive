export default function selectedIndex(items, id) {
  if (items === undefined) return false;
  for (let i = 0; i < items.length; ++i) {
    if (items[i].id === id || items[i]._id === id) return true;
  }
  return false;
}
