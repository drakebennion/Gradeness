const {auth, logger} = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.createUserActivities = auth.user().onCreate(async (user) => {
  logger.log("creating activities for user: ", user.uid);

  const defaultActivities = await getFirestore()
      .collection("defaultActivities")
      .get();

  Promise.all(
      defaultActivities.docs.map(createDefaultActivityForUser(user)),
  )
      .catch(logger.error);
});

const createDefaultActivityForUser = (user) => async (defaultActivity) => {
  const {year, semester, objective, id, order} = defaultActivity.data();
  await getFirestore()
      .collection("activities")
      .add({
        userId: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        complete: false,
        defaultActivityId: id,
        order,
        year,
        semester,
        objective,
      });
};
