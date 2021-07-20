import {resultProduction, resultDevelop, resultStaging} from './fixtures/app.results'
import {mergeProvisionerYaml} from '../src/parser'

describe('manifest helper tests', () => {
    describe('manifestUtilities', () => {
        const basePath = __dirname + '/fixtures'
        const primaryFile = basePath + '/app.yaml'
        it('Production:latest reads and merges yaml file data (mergeProvisionerYaml)', () => {
            const data = mergeProvisionerYaml(basePath, primaryFile, '')
            expect(data).toEqual(resultProduction)
        })
        it('Develop:dragon reads and merges yaml file data (mergeProvisionerYaml)', () => {
            const data = mergeProvisionerYaml(basePath, primaryFile, 'develop')
            expect(data).toEqual(resultDevelop)
        })
        it('Staging:canary- reads and merges yaml file data (mergeProvisionerYaml)', () => {
            const data = mergeProvisionerYaml(basePath, primaryFile, 'staging')
            expect(data).toEqual(resultStaging)
        })
    })
})