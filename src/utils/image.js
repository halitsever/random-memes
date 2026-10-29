const IMAGE_EXTENSION = /\.(jpe?g|png|gif|webp)$/i;

const isImageUrl = (url) => {
  try {
    return IMAGE_EXTENSION.test(new URL(url).pathname);
  } catch {
    return false;
  }
};

module.exports = { isImageUrl };
