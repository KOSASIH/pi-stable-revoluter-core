// migrations/1_initial_migration.js

const Migrations = artifacts.require("Migrations");

module.exports = async function (deployer) {
    try {
        await deployer.deploy(Migrations);
        console.log("Migrations contract deployed successfully at:", Migrations.address);
    } catch (error) {
        console.error("Error deploying Migrations contract:", error);
        throw error; // Rethrow to stop the migration process
    }
};
