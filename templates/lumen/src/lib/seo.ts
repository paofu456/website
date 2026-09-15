import company from "../data/company.json";

export function makePageTitle(page?: string) {
  return page ? `${page} | ${company.name}` : `${company.name} | Industrial Solutions`;
}
