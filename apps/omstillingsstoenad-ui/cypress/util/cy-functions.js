export const gaaTilNesteSide = () => cy.get('[type="button"]').contains("Neste").click();
export const gaaTilbake = () => cy.get('[type="button"]').contains("Tilbake").click();
export const getById = (id) => cy.get(`[id="${id}"]`);
export const selectValue = (value) => cy.get(`[value="${value}"]`).check({ force: true });
export const selectValueForId = (id, value) => getById(id).find(`[value="${value}"]`).check({ force: true });
export const basePath = "/omstillingsstoenad/soknad";
export const a11yCheck = () => cy.checkA11y(null, { rules: { 'svg-img-alt' :  {enabled: false} }}, null, true);