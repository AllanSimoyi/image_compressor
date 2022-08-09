export function getImageUrlWithFallback (file, fallbackUrl) {
  return file ?
    URL.createObjectURL(file) :
    fallbackUrl;
}