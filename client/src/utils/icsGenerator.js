export function generateICS({ eventName, eventDate, venue }) {
  const date = new Date(eventDate);
  const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(date.getTime() + 8 * 60 * 60 * 1000); // 8 hour event
  
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(date)}
DTEND:${formatDate(endDate)}
SUMMARY:${eventName}
LOCATION:${venue}
DESCRIPTION:You built the ride. Now it's time to take it for a spin!
END:VEVENT
END:VCALENDAR`;
  
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventName.replace(/\s+/g, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
