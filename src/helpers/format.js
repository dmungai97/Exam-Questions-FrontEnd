const dateTimeFormatter = Intl.DateTimeFormat('default', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
});

export default dateTimeFormatter;
