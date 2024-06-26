const {auth, logger} = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.createUserActivities = auth.user().onCreate(async (user) => {
  logger.log("creating activities for user: ", user.uid);

  const testActivities = await getFirestore()
      .collection("testActivities")
      .get();

  await createAccomplishmentForUser(user);

  Promise.all(testActivities.docs.map(createTestActivityForUser(user))).catch(
      logger.error,
  );
});

const createAccomplishmentForUser = async (user) => {
  await getFirestore()
      .collection("accomplishments")
      .add({
        userId: user.uid,
        createdAt: Date.now(),
        createdBy: -1,
        updatedAt: Date.now(),
        updatedBy: -1,
        content: {
          9: "",
          10: "",
          11: "",
          12: "",
        },
      });
};

const createTestActivityForUser = (user) => async (testActivity) => {
  const {year, semester, name, id, order, overview, description} =
    testActivity.data();
  await getFirestore().collection("activities").add({
    userId: user.uid,
    createdAt: Date.now(),
    createdBy: -1,
    updatedAt: Date.now(),
    updatedBy: -1,
    complete: false,
    testActivityId: id,
    order,
    year,
    semester,
    name,
    overview,
    description,
  });
};
