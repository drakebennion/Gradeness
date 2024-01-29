const {auth, logger} = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.createUserTasks = auth.user().onCreate(async (user) => {
  logger.log("creating tasks for user: ", user.uid);

  const defaultTasks = await getFirestore()
      .collection("defaultTasks")
      .get();

  Promise.all(
      defaultTasks.docs.map(createDefaultTaskForUser(user)),
  )
      .catch(logger.error);
});

const createDefaultTaskForUser = (user) => async (defaultTask) => {
  const {year, semester, objective, id, order} = defaultTask.data();
  await getFirestore()
      .collection("tasks")
      .add({
        userId: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        complete: false,
        defaultTaskId: id,
        order,
        year,
        semester,
        objective,
      });
};
