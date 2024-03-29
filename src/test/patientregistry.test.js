const PatientRegistry = artifacts.require("PatientRegistry");

contract("PatientRegistry", (accounts) => {
  const [admin, patient1, patient2, unauthorizedUser] = accounts;
  let patientRegistryInstance;

  beforeEach(async () => {
    patientRegistryInstance = await PatientRegistry.new();
  });

  it("should register a patient", async () => {
    await patientRegistryInstance.registerPatient(
      "Alice",
      "1990-01-01",
      "123 Main St",
      "555-555-5555",
      patient1,
      "Female",
      { from: patient1 }
    );

    const isRegistered = await patientRegistryInstance.isRegisteredPatient(
      patient1
    );
    assert.equal(isRegistered, true, "Patient should be registered");

    const eventList = await patientRegistryInstance.getPastEvents(
      "PatientRegistered",
      { fromBlock: 0, toBlock: "latest" }
    );
    assert.equal(
      eventList.length,
      1,
      "Should have emitted PatientRegistered event"
    );
  });

  it("should not allow re-registering a patient", async () => {
    await patientRegistryInstance.registerPatient(
      "Alice",
      "1990-01-01",
      "123 Main St",
      "555-555-5555",
      patient1,
      "Female",
      { from: patient1 }
    );

    try {
      await patientRegistryInstance.registerPatient(
        "Alice",
        "1990-01-01",
        "123 Main St",
        "555-555-5555",
        patient1,
        "Female",
        { from: patient1 }
      );
      assert.fail("The transaction should have thrown an error");
    } catch (err) {
      assert.include(
        err.message,
        "Patient already registered",
        "The error message should contain 'Patient already registered'"
      );
    }
  });

  it("should give permission to create", async () => {
    await patientRegistryInstance.givepermissioncreate(patient2, {
      from: patient1,
    });
    const hasPermission = await patientRegistryInstance.haspermission(
      patient1,
      patient2
    );
    assert.equal(hasPermission, true, "Permission should be granted");
  });

  it("should revoke permission to create", async () => {
    await patientRegistryInstance.givepermissioncreate(patient2, {
      from: patient1,
    });
    await patientRegistryInstance.revokepermissioncreate(patient2, {
      from: patient1,
    });
    const hasPermission = await patientRegistryInstance.haspermission(
      patient1,
      patient2
    );
    assert.equal(hasPermission, false, "Permission should be revoked");
  });

  it("should check if a user is a registered patient", async () => {
    await patientRegistryInstance.registerPatient(
      "Bob",
      "1985-12-12",
      "456 Main St",
      "555-555-5555",
      patient2,
      "Male",
      { from: patient2 }
    );

    const isRegistered = await patientRegistryInstance.isRegisteredPatient(
      patient2
    );
    assert.equal(isRegistered, true, "User should be a registered patient");

    const isNotRegistered = await patientRegistryInstance.isRegisteredPatient(
      unauthorizedUser
    );
    assert.equal(
      isNotRegistered,
      false,
      "User should not be a registered patient"
    );
  });

  // Add more tests as needed for each function
});
