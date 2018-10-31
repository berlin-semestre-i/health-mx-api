exports.up = knex => knex.schema
  .table('doctor', (t) => {
    t.string('avatar_url')
  })
  .table('beneficiary', (t) => {
    t.string('avatar_url')
  })
  .table('nurse', (t) => {
    t.string('avatar_url')
  })
  .table('dependent', (t) => {
    t.string('avatar_url')
  })

exports.down = knex => knex.schema
  .table('doctor', (t) => {
    t.dropColumn('avatar_url')
  })
  .table('beneficiary', (t) => {
    t.dropColumn('avatar_url')
  })
  .table('nurse', (t) => {
    t.dropColumn('avatar_url')
  })
  .table('dependent', (t) => {
    t.dropColumn('avatar_url')
  })
