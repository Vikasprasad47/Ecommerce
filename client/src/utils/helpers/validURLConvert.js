// export const validURLConvert = (name) => {
//     const url = name.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&", "-")
//     return url
// }
export const validURLConvert = (name) => {
    return name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")  // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-")       // Replace spaces with hyphens
        .replace(/-+/g, "-");       // Remove duplicate hyphens
};
