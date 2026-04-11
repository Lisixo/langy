export default function join(
  ...txt: (string | number | boolean | null | undefined | {})[]
) {
  return txt
    .filter((e) => e)
    .map(e => typeof e === 'string' ? e.trim() : e)
    .join(' ');
}
export function joinLang(...txt: string[]) {
  return txt
    .filter((e) => e)
    .join(".")
    .trim();
}
