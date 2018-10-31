exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"')
  return knex.schema
    // independent tables
    .createTable('clinic', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.integer('unit').notNullable()
      table.string('town').notNullable()
    })
    .createTable('medical_record', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('medical_record_id').notNullable()
    })
    .createTable('appointment', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('appointment_id').notNullable()
    })
    .createTable('laboratory', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('laboratory_id').notNullable()
    })
    .createTable('specialty', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
    })
    .createTable('medicine', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
    })
    .createTable('treatment', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('observations').defaultTo('N/A')
    })
    .createTable('inability', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('observations').defaultTo('N/A')
      table.integer('days').notNullable()
    })
    .createTable('somatometry', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.integer('height').notNullable()
      table.integer('weight').notNullable()
      table.integer('bmi').notNullable()
      table.integer('pulse').notNullable()
      table.integer('blood_pressure').notNullable()
      table.integer('temperature')
    })
    .createTable('physical_exploration', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('observations').defaultTo('N/A')
    })
    .createTable('body_part', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
    })
    // tables with foreign keys
    .createTable('nurse', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.string('last_name').notNullable()
      table.timestamps(false, true)
      table
        .uuid('clinic_id')
        .references('id')
        .inTable('clinic')
        .onDelete('CASCADE')
    })
    .createTable('doctor', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.string('last_name').notNullable()
      table.timestamps(false, true)
      table
        .uuid('clinic_id')
        .references('id')
        .inTable('clinic')
        .onDelete('CASCADE')
    })
    .createTable('beneficiary', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.string('last_name').notNullable()
      table.string('ssn').notNullable()
      table.date('birth_date').notNullable()
      table.timestamps(false, true)
      table
        .uuid('clinic_id')
        .references('id')
        .inTable('clinic')
        .onDelete('CASCADE')
      table
        .uuid('medical_record_id')
        .references('id')
        .inTable('medical_record')
        .onDelete('CASCADE')
      table
        .uuid('current_treatment_id')
        .references('id')
        .inTable('treatment')
        .onDelete('CASCADE')
      table
        .uuid('doctor_id')
        .references('id')
        .inTable('doctor')
        .onDelete('CASCADE')
    })
    .createTable('dependent', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.string('last_name').notNullable()
      table.date('birth_date').notNullable()
      table.timestamps(false, true)
      table
        .uuid('beneficiary_id')
        .references('id')
        .inTable('beneficiary')
        .onDelete('CASCADE')
      table
        .uuid('clinic_id')
        .references('id')
        .inTable('clinic')
        .onDelete('CASCADE')
      table
        .uuid('medical_record_id')
        .references('id')
        .inTable('medical_record')
        .onDelete('CASCADE')
      table
        .uuid('current_treatment_id')
        .references('id')
        .inTable('treatment')
        .onDelete('CASCADE')
      table
        .uuid('doctor_id')
        .references('id')
        .inTable('doctor')
        .onDelete('CASCADE')
    })
    .createTable('consultation', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.date('date').notNullable()
      table.string('reason').notNullable()
      table.string('observations').defaultTo('N/A')
      table.timestamps(false, true)
      table
        .uuid('beneficiary_id')
        .references('id')
        .inTable('beneficiary')
        .onDelete('CASCADE')
      table
        .uuid('doctor_id')
        .references('id')
        .inTable('doctor')
        .onDelete('CASCADE')
      table
        .uuid('treatment_id')
        .references('id')
        .inTable('treatment')
        .onDelete('CASCADE')
      table
        .uuid('inability_id')
        .references('id')
        .inTable('inability')
        .onDelete('CASCADE')
      table
        .uuid('appointment_id')
        .references('id')
        .inTable('appointment')
        .onDelete('CASCADE')
      table
        .uuid('somatometry_id')
        .references('id')
        .inTable('somatometry')
        .onDelete('CASCADE')
      table
        .uuid('physical_exploration_id')
        .references('id')
        .inTable('physical_exploration')
        .onDelete('CASCADE')
    })
    // many to many relation tables
    .createTable('medication', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('dose').notNullable()
      table.string('frequency').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table
        .uuid('treatment_id')
        .references('id')
        .inTable('treatment')
        .onDelete('CASCADE')
      table
        .uuid('medicine_id')
        .references('id')
        .inTable('medicine')
        .onDelete('CASCADE')
    })
    .createTable('doctor_specialty', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table
        .uuid('doctor_id')
        .references('id')
        .inTable('doctor')
        .onDelete('CASCADE')
      table
        .uuid('specialty_id')
        .references('id')
        .inTable('specialty')
        .onDelete('CASCADE')
    })
    .createTable('body_part_exploration', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table
        .uuid('body_part_id')
        .references('id')
        .inTable('body_part')
        .onDelete('CASCADE')
      table
        .uuid('physical_exploration_id')
        .references('id')
        .inTable('physical_exploration')
        .onDelete('CASCADE')
    })
}

exports.down = async (knex) => {
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
  return knex.schema
    .dropTableIfExists('medication')
    .dropTableIfExists('inability')
    .dropTableIfExists('body_part_exploration')
    .dropTableIfExists('doctor_specialty')
    .dropTableIfExists('doctor')
    .dropTableIfExists('nurse')
    .dropTableIfExists('specialty')
    .dropTableIfExists('clinic')
    .dropTableIfExists('laboratory')
    .dropTableIfExists('appointment')
    .dropTableIfExists('medical_record')
    .dropTableIfExists('treatment')
    .dropTableIfExists('medicine')
    .dropTableIfExists('somatometry')
    .dropTableIfExists('body_part')
    .dropTableIfExists('physical_exploration')
    .dropTableIfExists('beneficiary')
    .dropTableIfExists('dependent')
    .dropTableIfExists('consultation')
}
