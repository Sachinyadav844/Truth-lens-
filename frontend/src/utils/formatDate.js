export function formatDate(value) { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) }
