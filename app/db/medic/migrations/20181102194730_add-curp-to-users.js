
exports.up = knex => knex.schema
  .table('doctor', (t) => {
    t.string('curp').notNullable()
  })
  .table('beneficiary', (t) => {
    t.string('curp').notNullable()
  })
  .table('nurse', (t) => {
    t.string('curp').notNullable()
  })
  .table('dependent', (t) => {
    t.string('curp').notNullable()
  })

exports.down = knex => knex.schema
  .table('doctor', (t) => {
    t.dropColumn('curp')
  })
  .table('beneficiary', (t) => {
    t.dropColumn('curp')
  })
  .table('nurse', (t) => {
    t.dropColumn('curp')
  })
  .table('dependent', (t) => {
    t.dropColumn('curp')
  })
