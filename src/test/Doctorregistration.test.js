const DoctorRegistration = artifacts.require("DoctorRegistration");

contract("DoctorRegistration", (accounts) => {
  const [admin, doctor] = accounts;
  let doctorRegistrationInstance;

  beforeEach(async () => {
    doctorRegistrationInstance = await DoctorRegistration.new();
  });

  it("should allow a new doctor to be registered", async () => {
    const doctorDetails = {
      doctorAddress: doctor,
      doctorName: "Dr. Alice",
      hospitalName: "General Hospital",
      dateOfBirth: "1970-01-01",
      gender: "Female",
      hhNumber: "1234567890",
      specialization: "Cardiology",
      department: "Cardiology",
      designation: "Senior Consultant",
      workExperience: "20 years",
    };

    await doctorRegistrationInstance.registerDoctor(
      doctorDetails.doctorAddress,
      doctorDetails.doctorName,
      doctorDetails.hospitalName,
      doctorDetails.dateOfBirth,
      doctorDetails.gender,
      doctorDetails.hhNumber,
      doctorDetails.specialization,
      doctorDetails.department,
      doctorDetails.designation,
      doctorDetails.workExperience,
      { from: admin }
    );

    const registeredDoctor = await doctorRegistrationInstance.getDoctorDetails(
      doctor
    );
    assert.equal(
      registeredDoctor.doctorName,
      doctorDetails.doctorName,
      "Doctor's name should match the registered details"
    );
  });

  it("should not allow a doctor to be registered twice", async () => {
    const doctorDetails = {
      doctorAddress: doctor,
      doctorName: "Dr. Alice",
      hospitalName: "General Hospital",
      dateOfBirth: "1970-01-01",
      gender: "Female",
      hhNumber: "1234567890",
      specialization: "Cardiology",
      department: "Cardiology",
      designation: "Senior Consultant",
      workExperience: "20 years",
    };

    await doctorRegistrationInstance.registerDoctor(
      doctorDetails.doctorAddress,
      doctorDetails.doctorName,
      doctorDetails.hospitalName,
      doctorDetails.dateOfBirth,
      doctorDetails.gender,
      doctorDetails.hhNumber,
      doctorDetails.specialization,
      doctorDetails.department,
      doctorDetails.designation,
      doctorDetails.workExperience,
      { from: admin }
    );

    try {
      await doctorRegistrationInstance.registerDoctor(
        doctorDetails.doctorAddress,
        doctorDetails.doctorName,
        doctorDetails.hospitalName,
        doctorDetails.dateOfBirth,
        doctorDetails.gender,
        doctorDetails.hhNumber,
        doctorDetails.specialization,
        doctorDetails.department,
        doctorDetails.designation,
        doctorDetails.workExperience,
        { from: admin }
      );
      assert.fail("The same doctor should not be registerable twice");
    } catch (error) {
      assert.include(
        error.message,
        "Doctor already registered",
        "Error should be for already registered doctor"
      );
    }
  });

  it("should correctly report registration status", async () => {
    const doctorDetails = {
      doctorAddress: doctor,
      doctorName: "Dr. Alice",
      hospitalName: "General Hospital",
      dateOfBirth: "1970-01-01",
      gender: "Female",
      hhNumber: "1234567890",
      specialization: "Cardiology",
      department: "Cardiology",
      designation: "Senior Consultant",
      workExperience: "20 years",
    };

    let isRegistered = await doctorRegistrationInstance.isRegisteredDoctor(
      doctor
    );
    assert.equal(
      isRegistered,
      false,
      "Doctor should not be registered initially"
    );

    await doctorRegistrationInstance.registerDoctor(
      doctorDetails.doctorAddress,
      doctorDetails.doctorName,
      doctorDetails.hospitalName,
      doctorDetails.dateOfBirth,
      doctorDetails.gender,
      doctorDetails.hhNumber,
      doctorDetails.specialization,
      doctorDetails.department,
      doctorDetails.designation,
      doctorDetails.workExperience,
      { from: admin }
    );

    isRegistered = await doctorRegistrationInstance.isRegisteredDoctor(doctor);
    assert.equal(
      isRegistered,
      true,
      "Doctor should be registered after registration"
    );
  });

  // Add more tests as needed for each function
});
