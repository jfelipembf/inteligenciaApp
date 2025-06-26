// Script para exportar dados do Firestore
const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Substitua com sua configuração do Firebase
const firebaseConfig = {
  // Você precisa preencher esses valores com sua configuração do Firebase
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const fs = require('fs');

// Função para exportar uma coleção
async function exportCollection(collectionName) {
  console.log(`Exportando coleção: ${collectionName}`);
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`Nenhum documento encontrado na coleção ${collectionName}`);
    return [];
  }
  
  const documents = [];
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const documentWithId = {
      id: doc.id,
      ...data
    };
    
    // Verifica se há subcoleções
    const subcollections = await doc.ref.listCollections();
    if (subcollections.length > 0) {
      documentWithId.subcollections = {};
      
      for (const subcollection of subcollections) {
        const subcollectionName = subcollection.id;
        console.log(`Exportando subcoleção: ${collectionName}/${doc.id}/${subcollectionName}`);
        
        const subSnapshot = await doc.ref.collection(subcollectionName).get();
        const subDocuments = [];
        
        subSnapshot.forEach(subDoc => {
          subDocuments.push({
            id: subDoc.id,
            ...subDoc.data()
          });
        });
        
        documentWithId.subcollections[subcollectionName] = subDocuments;
      }
    }
    
    documents.push(documentWithId);
  }
  
  return documents;
}

// Função principal para exportar todas as coleções principais
async function exportFirestore() {
  try {
    // Lista todas as coleções de nível superior
    const collections = await db.listCollections();
    const collectionNames = collections.map(collection => collection.id);
    
    console.log('Coleções encontradas:', collectionNames);
    
    const exportData = {};
    
    // Exporta cada coleção
    for (const collectionName of collectionNames) {
      exportData[collectionName] = await exportCollection(collectionName);
    }
    
    // Salva os dados em um arquivo JSON
    fs.writeFileSync('./firestore-data.json', JSON.stringify(exportData, null, 2));
    console.log('Exportação concluída! Dados salvos em firestore-data.json');
    
    // Cria um arquivo de estrutura simplificada
    const structure = {};
    for (const collection in exportData) {
      structure[collection] = {
        documentCount: exportData[collection].length,
        documents: exportData[collection].map(doc => {
          const hasSubcollections = doc.subcollections ? Object.keys(doc.subcollections) : [];
          return {
            id: doc.id,
            fields: Object.keys(doc).filter(key => key !== 'id' && key !== 'subcollections'),
            subcollections: hasSubcollections.length > 0 ? hasSubcollections : []
          };
        })
      };
    }
    
    fs.writeFileSync('./firestore-structure.json', JSON.stringify(structure, null, 2));
    console.log('Estrutura do Firestore salva em firestore-structure.json');
    
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
  } finally {
    // Encerra a conexão com o Firebase
    process.exit(0);
  }
}

// Executa a exportação
exportFirestore();
