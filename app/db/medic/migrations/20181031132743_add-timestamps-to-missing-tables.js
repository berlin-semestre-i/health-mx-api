exports.up = knex => knex.schema
  .table('clinic', (t) => {
    t.timestamps(false, true)
  })
  .table('medical_record', (t) => {
    t.timestamps(false, true)
  })
  .table('appointment', (t) => {
    t.timestamps(false, true)
  })
  .table('laboratory', (t) => {
    t.timestamps(false, true)
  })
  .table('specialty', (t) => {
    t.timestamps(false, true)
  })
  .table('medicine', (t) => {
    t.timestamps(false, true)
  })
  .table('treatment', (t) => {
    t.timestamps(false, true)
  })
  .table('inability', (t) => {
    t.timestamps(false, true)
  })
  .table('somatometry', (t) => {
    t.timestamps(false, true)
  })
  .table('physical_exploration', (t) => {
    t.timestamps(false, true)
  })
  .table('body_part', (t) => {
    t.timestamps(false, true)
  })
  .table('medication', (t) => {
    t.timestamps(false, true)
  })
  .table('doctor_specialty', (t) => {
    t.timestamps(false, true)
  })
  .table('body_part_exploration', (t) => {
    t.timestamps(false, true)
  })

exports.down = knex => knex.schema
  .table('clinic', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('medical_record', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('appointment', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('laboratory', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('specialty', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('medicine', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('treatment', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('inability', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('somatometry', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('physical_exploration', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('body_part', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('medication', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('doctor_specialty', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
  .table('body_part_exploration', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
