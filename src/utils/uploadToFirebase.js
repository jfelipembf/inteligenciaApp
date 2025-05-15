import firebase from "firebase/compat/app";
import "firebase/compat/storage";

/**
 * Faz upload de um arquivo para o Firebase Storage.
 * @param {File} file - O arquivo a ser enviado.
 * @param {string} path - O caminho no Firebase Storage onde o arquivo será salvo.
 * @param {string} schoolId - O ID da escola para organizar os arquivos no Storage.
 * @returns {Promise<string>} - Retorna a URL de download do arquivo.
 */
const uploadToFirebase = async (file, path, schoolId) => {
  if (!file) throw new Error("Nenhum arquivo fornecido para upload.");
  if (!schoolId) throw new Error("schoolId não fornecido.");

  const storageRef = firebase.storage().ref();

  const fileRef = storageRef.child(`${schoolId}/${path}/${file.name}`); // Define o caminho no Storage
  await fileRef.put(file); // Faz o upload do arquivo
};

export default uploadToFirebase;
