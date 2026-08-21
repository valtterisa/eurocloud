export function withBase(path = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (path === "/" || path === "") {
    return base === "" ? "/" : base;
  }
  return `${base}/${path.replace(/^\//, "")}`;
}
