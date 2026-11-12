'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS simpliroute(
      "id" serial PRIMARY KEY,
      "status" VARCHAR(50),
      "status_changed" VARCHAR(50),
      "order" VARCHAR(50),
      "tracking_id" VARCHAR(50),
      "title" VARCHAR(50),
      "address" VARCHAR(100),
      "latitude" VARCHAR(50),
      "longitude" VARCHAR(50),
      "load" VARCHAR(30),
      "load_2" VARCHAR(30),
      "load_3" VARCHAR(30),
      "window_start" VARCHAR(30),
      "window_end" VARCHAR(30),
      "window_start_2" VARCHAR(30),
      "window_end_2" VARCHAR(30),
      "duration" VARCHAR(30),
      "contact_name" VARCHAR(50),
      "contact_phone" VARCHAR(20),
      "contact_email" VARCHAR(30),
      "reference" VARCHAR(30),
      "notes" VARCHAR(254),
      "planned_date" VARCHAR(50),
      "programmed_date" VARCHAR(50),
      "estimated_time_arrival" VARCHAR(50),
      "estimated_time_departure" VARCHAR(50),
      "checkin_time" VARCHAR(50),
      "checkin_latitude" VARCHAR(50),
      "checkin_longitude" VARCHAR(50),
      "checkout_comment" VARCHAR(254),
      "checkout_observation" VARCHAR(254),
      "checkout_user_id" VARCHAR(50),
      "checkout_time" VARCHAR(50),
      "on_its_way" VARCHAR(50),
      "calculated_service_time" VARCHAR(50),
      "current_eta" VARCHAR(50),
      "signature" VARCHAR(254),
      "priority_level" VARCHAR(30),
      "geocode_alert" VARCHAR(30),
      "visit_type" VARCHAR(30),
      "postal_code" VARCHAR(20),
      "fleet" VARCHAR(30),
      "pictures" text[],
      "observation" JSON,
      "account" JSON,
      "route" JSON,
      "plan" JSON,
      "extra_field_values" JSON,
      "create_time" TIMESTAMP NOT NULL DEFAULT current_timestamp,
      "update_time" TIMESTAMP
    );`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    -- Up migration: Eliminar la tabla
    DROP TABLE IF EXIST simpliroute;`);
  },
};
