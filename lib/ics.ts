export function downloadAppointmentIcs(params: {
  title: string;
  description: string;
  location: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  durationMinutes: number;
}) {
  const [year, month, day] = params.date.split("-").map(Number);
  const [hour, minute] = params.time.split(":").map(Number);
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + params.durationMinutes * 60000);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Khoury Clinic Demo//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description}`,
    `LOCATION:${params.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "khoury-clinic-appointment.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
