import { GradeLevels } from '../Roadmap/Repository'

export const getColorForYear = (year: number) => {
  if (year === 9) return '#4AF466'
  if (year === 10) return '#F6629D'
  if (year === 11) return '#3CD0F5'
  if (year === 12) return '#FCD411'
  return '#4AF466'
}

export const getGradeLevelNameForYear = (year: number) => {
  return GradeLevels
    .find(gradeLevel => gradeLevel.year === year)?.name ||
             'Freshman'
}

export const getGradeLevelYearForName = (name: string) => {
  return GradeLevels
    .find(gradeLevel => gradeLevel.name === name)?.year ||
             0
}

export const getGradeLevelObjectiveForYear = (year: number) => {
  return GradeLevels
    .find(gradeLevel => gradeLevel.year === year)?.objective ||
             'Your objective'
}
