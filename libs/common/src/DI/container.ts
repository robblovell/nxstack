// Client side code requires inversify-props
// which internally creates a container
// everything has to use this one container
// so we don't do a new inversify.Container
import 'reflect-metadata'
import { Container, injectable } from 'inversify'
import getDecorators from 'inversify-inject-decorators'

const container = new Container({skipBaseClassChecks: true})
const decorators = getDecorators(container)
const inject = decorators.lazyInject

export {
    container,
    injectable,
    inject
}