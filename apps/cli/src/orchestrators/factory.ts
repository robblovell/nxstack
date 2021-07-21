import {
    Intercept,
    Teleport
} from './'

export const Factory = {
    Intercept: (params) => new Intercept(params),
    Teleport: (params) => new Teleport(params)
}