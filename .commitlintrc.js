const configAngular = require('@commitlint/config-angular')

const typeEnum = configAngular.rules['type-enum'][2]
typeEnum.push('chore')
typeEnum.push('code_review')

module.exports = {
  extends: ['@commitlint/config-angular'],
}
