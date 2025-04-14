const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar o app Firebase Admin
try {
  const serviceAccount = require('./serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin SDK inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();

// Função para explorar a estrutura de questões
async function exploreQuestions() {
  try {
    console.log('Explorando a nova estrutura de questões...');
    
    // Obter todas as séries
    const gradesSnapshot = await db.collection('questions').get();
    
    if (gradesSnapshot.empty) {
      console.log('Nenhuma série encontrada na coleção questions');
      return;
    }
    
    console.log(`Encontradas ${gradesSnapshot.size} séries`);
    
    // Estatísticas
    const stats = {
      totalQuestions: 0,
      byGrade: {},
      bySubject: {},
      byTopic: {},
      bySubtopic: {},
      byDifficulty: {}
    };
    
    // Armazenar todas as questões para exportação
    const allQuestions = [];
    
    // Para cada série
    for (const gradeDoc of gradesSnapshot.docs) {
      const gradeId = gradeDoc.id;
      const gradeName = gradeDoc.data().name;
      
      console.log(`\nExplorando série: ${gradeName} (${gradeId})`);
      
      // Inicializar contadores
      stats.byGrade[gradeId] = {
        name: gradeName,
        count: 0
      };
      
      // Obter todas as disciplinas
      const subjectsCollections = await gradeDoc.ref.listCollections();
      
      for (const subjectCollection of subjectsCollections) {
        const subjectId = subjectCollection.id;
        
        // Inicializar contador da disciplina se não existir
        if (!stats.bySubject[subjectId]) {
          stats.bySubject[subjectId] = {
            name: subjectId,
            count: 0
          };
        }
        
        // Obter todos os tópicos
        const topicsSnapshot = await subjectCollection.get();
        
        for (const topicDoc of topicsSnapshot.docs) {
          const topicId = topicDoc.id;
          const topicName = topicDoc.data().name;
          
          // Inicializar contador do tópico se não existir
          if (!stats.byTopic[topicId]) {
            stats.byTopic[topicId] = {
              name: topicName,
              count: 0
            };
          }
          
          // Obter todos os subtópicos
          const subtopicCollections = await topicDoc.ref.listCollections();
          
          for (const subtopicCollection of subtopicCollections) {
            const subtopicId = subtopicCollection.id;
            
            // Inicializar contador do subtópico se não existir
            if (!stats.bySubtopic[subtopicId]) {
              stats.bySubtopic[subtopicId] = {
                name: subtopicId,
                count: 0
              };
            }
            
            // Obter todos os níveis de dificuldade
            const difficultyDocs = await subtopicCollection.get();
            
            for (const difficultyDoc of difficultyDocs.docs) {
              const difficultyId = difficultyDoc.id;
              
              // Inicializar contador da dificuldade se não existir
              if (!stats.byDifficulty[difficultyId]) {
                stats.byDifficulty[difficultyId] = {
                  name: difficultyId,
                  count: 0
                };
              }
              
              // Obter a coleção de questões
              const questionsCollection = difficultyDoc.ref.collection('questions');
              const questionsSnapshot = await questionsCollection.get();
              
              for (const questionDoc of questionsSnapshot.docs) {
                const questionId = questionDoc.id;
                const questionData = questionDoc.data();
                
                // Verificar se o ID da questão segue o formato correto
                const idPattern = /^Q(cie|mat|por)\d{5}$/;
                const isValidId = idPattern.test(questionId);
                
                if (!isValidId) {
                  console.warn(`Aviso: ID de questão inválido: ${questionId}`);
                }
                
                // Incrementar contadores
                stats.totalQuestions++;
                stats.byGrade[gradeId].count++;
                stats.bySubject[subjectId].count++;
                stats.byTopic[topicId].count++;
                stats.bySubtopic[subtopicId].count++;
                stats.byDifficulty[difficultyId].count++;
                
                // Adicionar questão à lista
                allQuestions.push({
                  id: questionId,
                  grade: {
                    id: gradeId,
                    name: gradeName
                  },
                  subject: {
                    id: subjectId,
                    name: questionData.subjectName || subjectId
                  },
                  topic: {
                    id: topicId,
                    name: questionData.topicName || topicName
                  },
                  subtopic: {
                    id: subtopicId,
                    name: questionData.subtopicName || subtopicId
                  },
                  difficulty: difficultyId,
                  questionText: questionData.questionText,
                  options: questionData.options,
                  correctAnswer: questionData.correctAnswer,
                  explanation: questionData.explanation
                });
              }
            }
          }
        }
      }
    }
    
    // Exibir estatísticas
    console.log(`\nEncontradas ${stats.totalQuestions} questões no total`);
    
    console.log('\nResumo das questões:');
    
    console.log('\nQuestões por série:');
    Object.entries(stats.byGrade).forEach(([id, data]) => {
      console.log(`  ${data.name} (${id}): ${data.count} questões`);
    });
    
    console.log('\nQuestões por disciplina:');
    Object.entries(stats.bySubject).forEach(([id, data]) => {
      console.log(`  ${data.name} (${id}): ${data.count} questões`);
    });
    
    console.log('\nQuestões por tópico:');
    Object.entries(stats.byTopic).forEach(([id, data]) => {
      console.log(`  ${data.name} (${id}): ${data.count} questões`);
    });
    
    console.log('\nQuestões por subtópico:');
    Object.entries(stats.bySubtopic).forEach(([id, data]) => {
      console.log(`  ${data.name} (${id}): ${data.count} questões`);
    });
    
    console.log('\nQuestões por dificuldade:');
    Object.entries(stats.byDifficulty).forEach(([id, data]) => {
      console.log(`  ${id}: ${data.count} questões`);
    });
    
    // Exemplos de consultas
    console.log('\nExemplos de consultas:');
    
    // Exemplo 1: Questões de Matemática do Jardim I
    console.log('\n1. Questões de Matemática do Jardim I:');
    const mathJardimIQuestions = allQuestions.filter(q => 
      q.grade.id === 'jardim-i' && q.subject.id === 'matematica'
    );
    
    console.log(`  Encontradas ${mathJardimIQuestions.length} questões`);
    mathJardimIQuestions.forEach(q => {
      console.log(`  - ${q.id}: ${q.questionText} (${q.topic.name} > ${q.subtopic.name} > ${q.difficulty})`);
    });
    
    // Exemplo 2: Questões fáceis de Ciências
    console.log('\n2. Questões fáceis de Ciências:');
    const easyScienceQuestions = allQuestions.filter(q => 
      q.subject.id === 'ciencias' && q.difficulty === 'easy'
    );
    
    console.log(`  Encontradas ${easyScienceQuestions.length} questões`);
    easyScienceQuestions.forEach(q => {
      console.log(`  - ${q.id}: ${q.questionText} (${q.grade.name} > ${q.topic.name} > ${q.subtopic.name})`);
    });
    
    // Exemplo 3: Questões do Sistema Respiratório
    console.log('\n3. Questões do Sistema Respiratório:');
    const respiratoryQuestions = allQuestions.filter(q => 
      q.subtopic.id === 'sistema-respiratorio'
    );
    
    console.log(`  Encontradas ${respiratoryQuestions.length} questões`);
    respiratoryQuestions.forEach(q => {
      console.log(`  - ${q.id}: ${q.questionText} (${q.grade.name} > ${q.difficulty})`);
    });
    
    // Exemplo 4: Como buscar uma questão específica pelo ID
    console.log('\n4. Como buscar uma questão específica pelo ID:');
    if (allQuestions.length > 0) {
      const sampleQuestionId = allQuestions[0].id;
      console.log(`  Exemplo de busca para o ID: ${sampleQuestionId}`);
      
      // Extrair informações do ID
      const subjectPrefix = sampleQuestionId.substring(1, 4);
      
      // Mapear o prefixo para o ID da disciplina
      const subjectMap = {
        'cie': 'ciencias',
        'mat': 'matematica',
        'por': 'portugues'
      };
      
      const subjectId = subjectMap[subjectPrefix];
      
      console.log(`  Prefixo da disciplina: ${subjectPrefix} (${subjectId})`);
      console.log(`  Código de consulta para encontrar esta questão:`);
      console.log(`    
  // Primeiro, precisamos encontrar em qual série, tópico, subtópico e dificuldade a questão está
  // Isso pode ser feito com uma consulta de busca em todas as séries
  async function findQuestionById(questionId) {
    const grades = await db.collection('questions').get();
    
    for (const grade of grades.docs) {
      const subjects = await grade.ref.listCollections();
      
      for (const subject of subjects) {
        // Verificar apenas a disciplina correspondente ao prefixo do ID
        if (subject.id === '${subjectId}') {
          const topics = await subject.get();
          
          for (const topic of topics.docs) {
            const subtopics = await topic.ref.listCollections();
            
            for (const subtopic of subtopics) {
              const difficulties = await subtopic.get();
              
              for (const difficulty of difficulties.docs) {
                // Verificar se a questão existe nesta coleção
                const questionRef = difficulty.ref.collection('questions').doc('${sampleQuestionId}');
                const question = await questionRef.get();
                
                if (question.exists) {
                  return {
                    gradeId: grade.id,
                    gradeName: grade.data().name,
                    subjectId: subject.id,
                    topicId: topic.id,
                    topicName: topic.data().name,
                    subtopicId: subtopic.id,
                    difficultyId: difficulty.id,
                    questionData: question.data()
                  };
                }
              }
            }
          }
        }
      }
    }
    
    return null; // Questão não encontrada
  }
      `);
    }
    
    // Exportar dados para um arquivo JSON
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const outputPath = path.join(__dirname, 'output', `new-questions-${timestamp}.json`);
    
    // Criar diretório de saída se não existir
    if (!fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'));
    }
    
    // Escrever dados no arquivo
    fs.writeFileSync(outputPath, JSON.stringify({
      stats,
      questions: allQuestions
    }, null, 2));
    
    console.log(`\nExploração concluída! Dados salvos em: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao explorar a estrutura de questões:', error);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    await exploreQuestions();
  } catch (error) {
    console.error('Erro durante a execução do script:', error);
  } finally {
    // Encerrar o app Firebase Admin
    await admin.app().delete();
    console.log('Firebase Admin SDK desconectado');
  }
}

main();
