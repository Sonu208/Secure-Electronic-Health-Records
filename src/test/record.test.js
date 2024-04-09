const RecordContract = artifacts.require("record");

contract("record", (accounts) => {
  const [admin, doctor, patient, unauthorizedUser, unauthorizedDoctor] =
    accounts;

  let recordInstance;

  beforeEach(async () => {
    recordInstance = await RecordContract.new();
  });

  it("should allow creating a new EHR record", async () => {
    await recordInstance.createEHR(
      "REC001",
      "John Doe",
      "Dr. Alice",
      doctor,
      patient,
      30,
      "Male",
      "Diagnosis details",
      "Prescription details",
      "cid_example",
      "docSignature_example",
      { from: patient }
    );

    const records = await recordInstance.getRecords({ from: patient });
    assert.equal(records.length, 1, "Record was not created");
    assert.equal(
      records[0].patientName,
      "John Doe",
      "Patient name does not match"
    );
  });

  it("should allow a patient to grant permission to a doctor", async () => {
    await recordInstance.grantPermission(doctor, { from: patient });
    const hasPermission = await recordInstance.canViewRecord(patient, doctor);
    assert.equal(hasPermission, true, "Permission was not granted");
  });

  it("should allow a patient to revoke permission from a doctor", async () => {
    await recordInstance.grantPermission(doctor, { from: patient });
    await recordInstance.revokePermission(doctor, { from: patient });
    const hasPermission = await recordInstance.canViewRecord(patient, doctor);
    assert.equal(hasPermission, false, "Permission was not revoked");
  });

  it("should allow viewing records by authorized doctor", async () => {
    await recordInstance.grantPermission(doctor, { from: patient });
    const records = await recordInstance.viewRecord(patient, { from: doctor });
    assert.isArray(records, "Records should be an array");
  });

  it("should prevent unauthorized viewing of records", async () => {
    try {
      await recordInstance.viewRecord(patient, { from: unauthorizedUser });
      assert.fail("The transaction should have thrown an error");
    } catch (err) {
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  it("should not allow a doctor to view a patient's records if permission is not granted", async () => {
    const canView = await recordInstance.canViewRecord(
      patient,
      unauthorizedDoctor,
      { from: unauthorizedDoctor }
    );
    assert.equal(
      canView,
      false,
      "Unauthorized doctor should not be able to view the records"
    );

    try {
      await recordInstance.viewRecord(patient, { from: unauthorizedDoctor });
      assert.fail("The transaction should have thrown an error");
    } catch (err) {
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  // Add more tests as needed for each function
});
