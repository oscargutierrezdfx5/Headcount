require("dotenv").config();
const { Sequelize } = require("sequelize");

// ✅ Conexión Sequelize con variables de entorno coherentes
const sequelize = new Sequelize(
  process.env.DB_NAME,         // nombre de la base de datos
  process.env.DB_USER,         // usuario
  process.env.DB_PASSWORD,     // contraseña
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres",
    define: {
      // freezeTableName: true,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false, // desactiva logs SQL
  }
);

// 🔍 Validar conexión
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection successful");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- Carga de modelos ---
db.appUser = require("./appUser")(sequelize, Sequelize);
db.changeHistory = require("./changeHistory")(sequelize, Sequelize);
db.company = require("./company")(sequelize, Sequelize);
db.department = require("./department")(sequelize, Sequelize);
db.document = require("./document")(sequelize, Sequelize);
db.employee = require("./employee")(sequelize, Sequelize);
db.permission = require("./permission")(sequelize, Sequelize);
db.role = require("./role")(sequelize, Sequelize);
db.socialProfile = require("./socialProfile")(sequelize, Sequelize);
db.team = require("./team")(sequelize, Sequelize);
db.timeOff = require("./timeOff")(sequelize, Sequelize);
db.timeOffHistory = require("./timeOffHistory")(sequelize, Sequelize);
db.passwordHistory = require("./passwordHistory")(sequelize, Sequelize);
db.notification = require("./notification")(sequelize, Sequelize);
db.notificationRecipient = require("./notificationRecipient")(sequelize, Sequelize);
db.reportTo = require("./reportTo")(sequelize, Sequelize);
db.employeeAnnualTimeOff = require("./employeeAnnualTimeOff")(sequelize, Sequelize);
db.timeOffRenewalDate = require("./timeOffRenewalDate")(sequelize, Sequelize);

// --- Offboarding models ---
db.offboarding = require("./offboarding/offboarding")(sequelize, Sequelize);
db.offboardingSurveyQuestion = require("./offboarding/offboardingSurveyQuestion")(sequelize, Sequelize);
db.offboardingSurveyResponse = require("./offboarding/offboardingSurveyResponse")(sequelize, Sequelize);
db.offboardingDocument = require("./offboarding/offboardingDocument")(sequelize, Sequelize);
db.offboardingSignedDocument = require("./offboarding/offboardingSignedDocument")(sequelize, Sequelize);
db.offboardingSurvey = require("./offboarding/offboardingSurvey")(sequelize, Sequelize);
db.offboardingDocumentation = require("./offboarding/offboardingDocumentation")(sequelize, Sequelize);

// --- Satisfaction models ---
db.satisfactionSurvey = require("./satisfactionSurvey/satisfactionSurvey")(sequelize, Sequelize);
db.satisfactionSurveyQuestion = require("./satisfactionSurvey/satisfactionSurveyQuestion")(sequelize, Sequelize);
db.satisfactionSurveyRespondent = require("./satisfactionSurvey/satisfactionSurveyRespondent")(sequelize, Sequelize);
db.satisfactionSurveyResponse = require("./satisfactionSurvey/satisfactionSurveyResponse")(sequelize, Sequelize);
db.satisfactionSurveyRecipient = require("./satisfactionSurvey/satisfactionSurveyRecipient")(sequelize, Sequelize);

// --- Otros modelos ---
db.onBoarding = require("./onBoarding")(sequelize, Sequelize);
db.video = require("./video")(sequelize, Sequelize);
db.file = require("./file")(sequelize, Sequelize);
db.fileName = require("./fileName")(sequelize, Sequelize);
db.task = require("./task")(sequelize, Sequelize);
db.taskName = require("./taskName")(sequelize, Sequelize);
db.surveyQuestion = require("./surveyQuestion")(sequelize, Sequelize);
db.surveyResponse = require("./surveyResponse")(sequelize, Sequelize);
db.onBoardingSurvey = require("./onBoardingSurvey")(sequelize, Sequelize);

// --- Relaciones corregidas ---
db.employee.hasMany(db.reportTo, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "employeeId",
});

db.reportTo.belongsTo(db.employee, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "employeeId",
});

db.role.hasMany(db.employee, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "roleId",
});

db.employee.belongsTo(db.role, {
  as: "role",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "roleId",
});

db.department.hasMany(db.employee, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "departmentId",
});

db.employee.belongsTo(db.department, {
  as: "department",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "departmentId",
});

db.team.hasMany(db.employee, {
  as: "employees",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "teamId",
});

db.employee.belongsTo(db.team, {
  as: "team",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "teamId",
});

// appUser <-> permission
db.appUser.belongsTo(db.permission, {
  as: "permission",
  foreignKey: "permissionId",
});
db.permission.hasMany(db.appUser, {
  as: "users",
  foreignKey: "permissionId",
});

// Employee <-> SocialProfile
db.employee.hasMany(db.socialProfile, {
  as: "socialProfiles",
  foreignKey: "employeeId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.socialProfile.belongsTo(db.employee, {
  as: "employee",
  foreignKey: "employeeId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// --- Self reference: un empleado puede reportar a otro ---
db.employee.hasMany(db.employee, {
  as: "subordinates",
  foreignKey: "managerId",
});

db.employee.belongsTo(db.employee, {
  as: "manager",
  foreignKey: "managerId",
});
// TimeOffHistory associations
db.employee.hasMany(db.timeOffHistory, {
  foreignKey: "empId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.timeOffHistory.belongsTo(db.employee, {
  foreignKey: "empId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.employee.hasMany(db.timeOffHistory, {
  as: "managedTimeOffs",
  foreignKey: "managerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.timeOffHistory.belongsTo(db.employee, {
  as: "approver",
  foreignKey: "managerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.timeOff.hasMany(db.timeOffHistory, {
  foreignKey: "timeOffId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.timeOffHistory.belongsTo(db.timeOff, {
  foreignKey: "timeOffId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = db;
