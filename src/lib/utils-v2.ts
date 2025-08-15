export const generateHours = (): string[] => {
    const hours: string[] = [];
    for (let i = 0; i < 24; i++) {
        hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    hours.push('24:00');
    return hours;
};
