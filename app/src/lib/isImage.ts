export function isImage(filename: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"]
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension !== undefined && imageExtensions.includes(extension)
}