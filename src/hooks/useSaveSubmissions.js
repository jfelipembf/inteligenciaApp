import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useSaveSubmissions = () => {
  const { userDetails } = useUser();
  const saveSubmissions = async (
    activity,
    classId,
    lessonId,
    id,
    responses
  ) => {
    try {
      console.log(activity, classId, lessonId, id, responses);
      const submissionsRef = firebase
        .firestore()
        .collection("schools")
        .doc(userDetails?.schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId)
        .collection("activities")
        .doc(id)
        .collection("submissions");

      const batch = firebase.firestore().batch();

      responses.forEach((response) => {
        const submissionRef = submissionsRef.doc(response.studentId);
        batch.set(submissionRef, {
          delivered: response.delivered,
          studentId: response.studentId,
          studentName: response.studentName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      return { success: true, message: "Submissões salvas com sucesso!" };
    } catch (error) {
      console.error("Erro ao salvar submissões:", error);
      return { success: false, message: "Erro ao salvar submissões." };
    }
  };

  return { saveSubmissions };
};

export default useSaveSubmissions;
