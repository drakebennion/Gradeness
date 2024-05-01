import { Colors, GradeLevels } from '../Constants';

export const getColorForYear = (year: number, dark?: boolean) => {
  let gradeLevelName = getGradeLevelNameForYear(year).toLowerCase();
  return Colors[(gradeLevelName += dark ? 'Dark' : '')];
};

export const getGradeLevelNameForYear = (year: number) => {
  return (
    GradeLevels.find(gradeLevel => gradeLevel.year === year)?.name || 'Freshman'
  );
};

export const getGradeLevelYearForName = (name: string) => {
  return GradeLevels.find(gradeLevel => gradeLevel.name === name)?.year || 9;
};

export const getGradeLevelObjectiveForYear = (year: number) => {
  return (
    GradeLevels.find(gradeLevel => gradeLevel.year === year)?.objective ||
    'Begin your story'
  );
};
