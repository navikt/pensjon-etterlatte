import { ContextObject } from 'axe-core'
import { Options } from 'cypress-axe'

type CypressAxeContext = string | Node | ContextObject | undefined

export const testAccesibility = (context?: CypressAxeContext, options?: Options) => {
    // Her må vi vente litt slik at dataen fra sanity klarer å loade og mountes i DOM'en før UU testene kjøres
    setTimeout(() => {
        cy.injectAxe()
        cy.checkA11y(context, options)
    }, 1000)
}
