const {auth, logger} = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.createUserTasks = auth.user().onCreate(async (user) => {
  logger.log("creating tasks for user: ", user.uid);

  const defaultTasks = await getFirestore()
      .collection("defaultTasks")
      .get();

  try {
    // todo: may need to await _all these_ before finishing the function,
    // I think some are being dropped
    
    // from Function logs: Exception from a finished function: Error: 4 DEADLINE_EXCEEDED: Deadline exceeded
    defaultTasks.forEach(async (defaultTask) => {
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
    });
  } catch (e) {
    logger.error(e);
  }
});
