export const cn = (...inputs) => {
    return inputs
        .flat()
        .filter(Boolean)
        .join(' ')
        .trim();
}