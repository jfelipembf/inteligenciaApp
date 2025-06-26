const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// IMPORTANTE: Nunca armazene a chave diretamente no código
// Em vez disso, armazene-a em um arquivo .env ou como variável de ambiente
// Este script espera que você tenha um arquivo serviceAccountKey.json na pasta firestore-export

// Inicializar o app Firebase Admin
try {
  const serviceAccount = require('./serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin SDK inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin SDK:', error);
  console.log('Certifique-se de que o arquivo serviceAccountKey.json existe na pasta firestore-export');
  process.exit(1);
}

const db = admin.firestore();

// Função para explorar recursivamente coleções e subcoleções
async function exploreFirestore(collectionPath = '', depth = 0) {
  const structure = {};
  
  try {
    // Obter todas as coleções no caminho atual
    let collections;
    if (collectionPath === '') {
      collections = await db.listCollections();
    } else {
      collections = await db.collection(collectionPath).listCollections();
    }
    
    // Processar cada coleção
    for (const collection of collections) {
      const collectionName = collection.id;
      const fullPath = collectionPath ? `${collectionPath}/${collectionName}` : collectionName;
      
      console.log(`${' '.repeat(depth * 2)}Explorando coleção: ${fullPath}`);
      
      structure[collectionName] = { documents: {} };
      
      // Obter documentos da coleção (limitado a 50 para evitar sobrecarga)
      const docsSnapshot = await db.collection(fullPath).limit(50).get();
      
      // Processar cada documento
      for (const doc of docsSnapshot.docs) {
        const docId = doc.id;
        const docData = doc.data();
        
        // Armazenar dados completos do documento
        structure[collectionName].documents[docId] = {
          data: docData,
          subcollections: {}
        };
        
        // Explorar subcoleções do documento
        try {
          const docSubcollections = await db.collection(fullPath).doc(docId).listCollections();
          
          if (docSubcollections.length > 0) {
            const subcollectionsPath = `${fullPath}/${docId}`;
            structure[collectionName].documents[docId].subcollections = await exploreFirestore(subcollectionsPath, depth + 1);
          }
        } catch (error) {
          console.error(`Erro ao explorar subcoleções para ${fullPath}/${docId}:`, error);
          structure[collectionName].documents[docId].subcollections = { error: error.message };
        }
      }
    }
    
    return structure;
  } catch (error) {
    console.error(`Erro ao explorar Firestore no caminho ${collectionPath}:`, error);
    return { error: error.message };
  }
}

// Função principal
async function main() {
  try {
    console.log('Iniciando exploração do Firestore...');
    
    const firestoreStructure = await exploreFirestore();
    
    // Criar pasta de saída se não existir
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // Salvar estrutura em arquivo JSON
    const outputFile = path.join(outputDir, `firestore-data-${new Date().toISOString().replace(/:/g, '-')}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(firestoreStructure, null, 2));
    
    console.log(`Exploração concluída! Dados salvos em: ${outputFile}`);
    
  } catch (error) {
    console.error('Erro durante a exploração do Firestore:', error);
  } finally {
    // Encerrar o app Firebase Admin
    await admin.app().delete();
    console.log('Firebase Admin SDK desconectado');
  }
}

main();
