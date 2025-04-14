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

// Conjunto para armazenar os números já utilizados
const usedNumbers = new Set();

// Função para gerar um número aleatório de 5 dígitos
function generateRandomNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Função para gerar um ID único no formato Qxxx00000
function generateUniqueId(disciplina) {
  // Extrair as três primeiras letras da disciplina e converter para minúsculas
  const prefix = disciplina.substring(0, 3).toLowerCase();
  
  // Gerar um número aleatório de 5 dígitos que não tenha sido usado
  let randomNumber;
  do {
    randomNumber = generateRandomNumber();
  } while (usedNumbers.has(randomNumber));
  
  // Adicionar o número ao conjunto de números usados
  usedNumbers.add(randomNumber);
  
  // Retornar o ID no formato Qxxx00000
  return `Q${prefix}${randomNumber}`;
}

// Função para limpar a coleção de questões
async function clearQuestionsCollection() {
  try {
    console.log('Limpando a coleção de questões...');
    
    // Obter todos os documentos da coleção questions
    const questionsSnapshot = await db.collection('questions').get();
    
    if (questionsSnapshot.size === 0) {
      console.log('Nenhum documento encontrado na coleção questions');
      return;
    }
    
    // Excluir cada documento
    const batch = db.batch();
    questionsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Executar o batch
    await batch.commit();
    console.log(`${questionsSnapshot.size} documentos removidos da coleção questions`);
    
    console.log('Coleção de questões limpa com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar a coleção de questões:', error);
    throw error;
  }
}

// Função para criar a nova estrutura de questões
async function createNewQuestionStructure() {
  try {
    // Limpar a coleção de questões
    await clearQuestionsCollection();
    
    // Definir as séries
    const grades = [
      { id: 'jardim-i', name: 'Jardim I', description: 'Série para crianças de 4 anos', totalTime: 30, order: 1 },
      { id: 'jardim-ii', name: 'Jardim II', description: 'Série para crianças de 5 anos', totalTime: 30, order: 2 },
      { id: '1-ano', name: '1º Ano', description: 'Série para crianças de 6 anos', totalTime: 45, order: 3 }
    ];
    
    // Definir as disciplinas por série
    const subjects = [
      { id: 'matematica', name: 'Matemática', description: 'Disciplina de Matemática', subject: 'math' },
      { id: 'portugues', name: 'Português', description: 'Disciplina de Português', subject: 'portuguese' },
      { id: 'ciencias', name: 'Ciências', description: 'Disciplina de Ciências', subject: 'science' }
    ];
    
    // Definir os tópicos por disciplina
    const topics = {
      'matematica': [
        { id: 'aritmetica', name: 'Aritmética', description: 'Operações matemáticas básicas' },
        { id: 'geometria', name: 'Geometria', description: 'Estudo das formas e espaço' }
      ],
      'portugues': [
        { id: 'gramatica', name: 'Gramática', description: 'Regras e estrutura da língua' }
      ],
      'ciencias': [
        { id: 'corpo-humano', name: 'Corpo Humano', description: 'Estudo do corpo humano e seus sistemas' },
        { id: 'animais', name: 'Animais', description: 'Estudo dos animais e suas características' }
      ]
    };
    
    // Definir os subtópicos por tópico
    const subtopics = {
      'aritmetica': [
        { id: 'adicao', name: 'Adição', description: 'Operação de soma' },
        { id: 'subtracao', name: 'Subtração', description: 'Operação de subtração' }
      ],
      'geometria': [
        { id: 'formas', name: 'Formas Básicas', description: 'Estudo das formas geométricas básicas' }
      ],
      'gramatica': [
        { id: 'substantivos', name: 'Substantivos', description: 'Estudo dos substantivos' },
        { id: 'verbos', name: 'Verbos', description: 'Estudo dos verbos' }
      ],
      'corpo-humano': [
        { id: 'sistema-respiratorio', name: 'Sistema Respiratório', description: 'Estudo do sistema respiratório' },
        { id: 'sistema-digestivo', name: 'Sistema Digestivo', description: 'Estudo do sistema digestivo' }
      ],
      'animais': [
        { id: 'aves', name: 'Aves', description: 'Estudo das aves' }
      ]
    };
    
    // Definir as questões por subtópico e dificuldade
    const questionsBySubtopic = {
      'adicao': {
        'easy': [
          {
            questionText: 'Quanto é 5 + 3?',
            options: ['7', '8', '9', '10'],
            correctAnswer: 1,
            explanation: '5 + 3 = 8'
          },
          {
            questionText: 'Quanto é 2 + 6?',
            options: ['7', '8', '9', '10'],
            correctAnswer: 1,
            explanation: '2 + 6 = 8'
          }
        ],
        'medium': [
          {
            questionText: 'Quanto é 15 + 7?',
            options: ['21', '22', '23', '24'],
            correctAnswer: 1,
            explanation: '15 + 7 = 22'
          }
        ],
        'hard': [
          {
            questionText: 'Quanto é 28 + 14?',
            options: ['40', '41', '42', '43'],
            correctAnswer: 2,
            explanation: '28 + 14 = 42'
          }
        ]
      },
      'subtracao': {
        'easy': [
          {
            questionText: 'Quanto é 8 - 3?',
            options: ['3', '4', '5', '6'],
            correctAnswer: 2,
            explanation: '8 - 3 = 5'
          }
        ],
        'medium': [
          {
            questionText: 'Quanto é 15 - 7?',
            options: ['7', '8', '9', '10'],
            correctAnswer: 1,
            explanation: '15 - 7 = 8'
          }
        ],
        'hard': [
          {
            questionText: 'Quanto é 42 - 17?',
            options: ['23', '24', '25', '26'],
            correctAnswer: 2,
            explanation: '42 - 17 = 25'
          }
        ]
      },
      'formas': {
        'easy': [
          {
            questionText: 'Qual é o nome da forma com 4 lados iguais?',
            options: ['Círculo', 'Triângulo', 'Quadrado', 'Retângulo'],
            correctAnswer: 2,
            explanation: 'O quadrado tem 4 lados iguais'
          }
        ]
      },
      'substantivos': {
        'easy': [
          {
            questionText: 'O que é um substantivo?',
            options: [
              'Palavra que indica ação',
              'Palavra que nomeia seres, lugares, objetos, etc.',
              'Palavra que qualifica o substantivo',
              'Palavra que substitui o substantivo'
            ],
            correctAnswer: 1,
            explanation: 'Substantivo é a palavra que nomeia seres, lugares, objetos, etc.'
          }
        ]
      },
      'verbos': {
        'easy': [
          {
            questionText: 'O que é um verbo?',
            options: [
              'Palavra que indica ação, estado ou fenômeno',
              'Palavra que nomeia seres, lugares, objetos, etc.',
              'Palavra que qualifica o substantivo',
              'Palavra que substitui o substantivo'
            ],
            correctAnswer: 0,
            explanation: 'Verbo é a palavra que indica ação, estado ou fenômeno'
          }
        ]
      },
      'sistema-respiratorio': {
        'easy': [
          {
            questionText: 'Qual é o órgão principal do sistema respiratório?',
            options: ['Coração', 'Pulmão', 'Fígado', 'Estômago'],
            correctAnswer: 1,
            explanation: 'O pulmão é o órgão principal do sistema respiratório'
          }
        ],
        'medium': [
          {
            questionText: 'Qual é o nome do processo de troca de gases nos pulmões?',
            options: ['Digestão', 'Respiração', 'Hematose', 'Circulação'],
            correctAnswer: 2,
            explanation: 'A hematose é o processo de troca de gases nos pulmões'
          }
        ]
      },
      'sistema-digestivo': {
        'easy': [
          {
            questionText: 'Qual é o órgão responsável pela digestão dos alimentos?',
            options: ['Coração', 'Pulmão', 'Fígado', 'Estômago'],
            correctAnswer: 3,
            explanation: 'O estômago é o órgão responsável pela digestão dos alimentos'
          }
        ]
      },
      'aves': {
        'easy': [
          {
            questionText: 'Qual é a característica principal das aves?',
            options: ['Pelos', 'Penas', 'Escamas', 'Nadadeiras'],
            correctAnswer: 1,
            explanation: 'As aves têm o corpo coberto por penas'
          }
        ]
      }
    };
    
    console.log('Criando a nova estrutura de questões...');
    
    // Para cada série (ano escolar)
    for (const grade of grades) {
      console.log(`\nCriando série: ${grade.name} (${grade.id})`);
      
      // Criar documento para a série
      await db.collection('questions').doc(grade.id).set({
        name: grade.name,
        description: grade.description,
        totalTime: grade.totalTime,
        order: grade.order
      });
      
      // Para cada disciplina
      for (const subject of subjects) {
        console.log(`  Criando disciplina: ${subject.name} (${subject.id})`);
        
        // Criar coleção para a disciplina
        const subjectRef = db.collection('questions').doc(grade.id).collection(subject.id);
        
        // Para cada tópico da disciplina
        for (const topic of topics[subject.id]) {
          console.log(`    Criando tópico: ${topic.name} (${topic.id})`);
          
          // Criar documento para o tópico
          await subjectRef.doc(topic.id).set({
            name: topic.name,
            description: topic.description
          });
          
          // Para cada subtópico do tópico
          for (const subtopic of subtopics[topic.id]) {
            console.log(`      Criando subtópico: ${subtopic.name} (${subtopic.id})`);
            
            // Criar coleção para o subtópico
            const subtopicRef = subjectRef.doc(topic.id).collection(subtopic.id);
            
            // Verificar se existem questões para este subtópico
            if (questionsBySubtopic[subtopic.id]) {
              // Para cada nível de dificuldade
              for (const [difficultyId, questions] of Object.entries(questionsBySubtopic[subtopic.id])) {
                console.log(`        Criando nível de dificuldade: ${difficultyId}`);
                
                // Criar documento para o nível de dificuldade
                await subtopicRef.doc(difficultyId).set({
                  name: difficultyId,
                  description: `Questões de nível ${difficultyId}`
                });
                
                // Criar coleção para as questões
                const questionsRef = subtopicRef.doc(difficultyId).collection('questions');
                
                // Para cada questão
                for (const question of questions) {
                  // Gerar um ID único para a questão
                  const questionId = generateUniqueId(subject.id);
                  
                  // Criar documento para a questão
                  await questionsRef.doc(questionId).set({
                    questionText: question.questionText,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation,
                    subtopicName: subtopic.name,
                    topicName: topic.name,
                    subjectName: subject.name,
                    gradeName: grade.name,
                    difficulty: difficultyId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                  });
                  
                  console.log(`          Questão criada: ${questionId} - ${question.questionText}`);
                }
              }
            }
          }
        }
      }
    }
    
    console.log('\nNova estrutura de questões criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar a nova estrutura de questões:', error);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    await createNewQuestionStructure();
  } catch (error) {
    console.error('Erro durante a execução do script:', error);
  } finally {
    // Encerrar o app Firebase Admin
    await admin.app().delete();
    console.log('Firebase Admin SDK desconectado');
  }
}

main();
