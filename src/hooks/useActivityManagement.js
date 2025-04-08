// src/hooks/useActivityManagement.js

import { useState } from 'react'

// Dados mockados simulando banco de dados local
let mockActivities = [
  {
    id: 1,
    name: 'Atividade de Matemática',
    score: '10',
    startDate: '2025-04-10',
    endDate: '2025-04-20',
    class: { value: 'turma1', label: 'Turma 1' },
    subject: { value: 'matematica', label: 'Matemática' },
    teacher: { value: 'prof1', label: 'Prof. João' }
  },
  {
    id: 2,
    name: 'Atividade de História',
    score: '8',
    startDate: '2025-04-12',
    endDate: '2025-04-18',
    class: { value: 'turma2', label: 'Turma 2' },
    subject: { value: 'historia', label: 'História' },
    teacher: { value: 'prof2', label: 'Prof. Ana' }
  },
  {
    id: 3,
    name: 'Atividade de Geografia',
    score: '7',
    startDate: '2025-04-15',
    endDate: '2025-04-22',
    class: { value: 'turma3', label: 'Turma 3' },
    subject: { value: 'geografia', label: 'Geografia' },
    teacher: { value: 'prof3', label: 'Prof. Carlos' }
  },
  {
    id: 4,
    name: 'Atividade de Física',
    score: '9',
    startDate: '2025-04-11',
    endDate: '2025-04-21',
    class: { value: 'turma1', label: 'Turma 1' },
    subject: { value: 'fisica', label: 'Física' },
    teacher: { value: 'prof4', label: 'Prof. Marta' }
  },
  {
    id: 5,
    name: 'Atividade de Química',
    score: '10',
    startDate: '2025-04-13',
    endDate: '2025-04-19',
    class: { value: 'turma2', label: 'Turma 2' },
    subject: { value: 'quimica', label: 'Química' },
    teacher: { value: 'prof5', label: 'Prof. Ricardo' }
  },
  {
    id: 6,
    name: 'Atividade de Português',
    score: '6',
    startDate: '2025-04-14',
    endDate: '2025-04-23',
    class: { value: 'turma3', label: 'Turma 3' },
    subject: { value: 'portugues', label: 'Português' },
    teacher: { value: 'prof6', label: 'Prof. Juliana' }
  },
  {
    id: 7,
    name: 'Atividade de Inglês',
    score: '7.5',
    startDate: '2025-04-10',
    endDate: '2025-04-17',
    class: { value: 'turma1', label: 'Turma 1' },
    subject: { value: 'ingles', label: 'Inglês' },
    teacher: { value: 'prof7', label: 'Prof. Marcos' }
  },
  {
    id: 8,
    name: 'Atividade de Biologia',
    score: '9.5',
    startDate: '2025-04-16',
    endDate: '2025-04-25',
    class: { value: 'turma2', label: 'Turma 2' },
    subject: { value: 'biologia', label: 'Biologia' },
    teacher: { value: 'prof8', label: 'Prof. Camila' }
  },
  {
    id: 9,
    name: 'Atividade de Artes',
    score: '10',
    startDate: '2025-04-09',
    endDate: '2025-04-15',
    class: { value: 'turma3', label: 'Turma 3' },
    subject: { value: 'artes', label: 'Artes' },
    teacher: { value: 'prof9', label: 'Prof. Lucas' }
  },
  {
    id: 10,
    name: 'Atividade de Educação Física',
    score: '8.5',
    startDate: '2025-04-08',
    endDate: '2025-04-14',
    class: { value: 'turma1', label: 'Turma 1' },
    subject: { value: 'edfisica', label: 'Educação Física' },
    teacher: { value: 'prof10', label: 'Prof. Paula' }
  },
  {
    id: 11,
    name: 'Atividade de Filosofia',
    score: '7',
    startDate: '2025-04-18',
    endDate: '2025-04-24',
    class: { value: 'turma2', label: 'Turma 2' },
    subject: { value: 'filosofia', label: 'Filosofia' },
    teacher: { value: 'prof11', label: 'Prof. André' }
  }
]

export const useActivityManagement = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createActivity = async activityData => {
    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!activityData.name) {
          setError('O nome da atividade é obrigatório.')
          setLoading(false)
          return reject(new Error('O nome da atividade é obrigatório.'))
        }

        const newActivity = {
          id: Date.now(),
          ...activityData
        }

        mockActivities.push(newActivity)
        setLoading(false)
        resolve(newActivity)
      }, 1000)
    })
  }

  const getActivities = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...mockActivities])
      }, 500)
    })
  }

  const getActivityById = async id => {
    return new Promise(resolve => {
      setTimeout(() => {
        const activity = mockActivities.find(a => a.id === Number(id))
        resolve(activity || null)
      }, 500)
    })
  }

  const updateActivity = async (id, updatedData) => {
    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockActivities.findIndex(a => a.id === Number(id))
        if (index === -1) {
          setError('Atividade não encontrada.')
          setLoading(false)
          return reject(new Error('Atividade não encontrada.'))
        }

        mockActivities[index] = { ...mockActivities[index], ...updatedData }
        setLoading(false)
        resolve(mockActivities[index])
      }, 1000)
    })
  }

  const deleteActivity = async id => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simula exclusão no mock
        mockActivities = mockActivities.filter(a => a.id !== id)
        resolve(true)
      }, 300)
    })
  }

  return {
    createActivity,
    updateActivity,
    getActivities,
    deleteActivity,
    getActivityById,
    loading,
    error
  }
}
