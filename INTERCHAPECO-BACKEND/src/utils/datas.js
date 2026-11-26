
// UTILS — Datas e horários

const FUSO_HORARIO = 'America/Sao_Paulo';

function agoraChapeco() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO_HORARIO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const valores = Object.fromEntries(
    partes.map(({ type, value }) => [type, value])
  );

  return {
    data: `${valores.year}-${valores.month}-${valores.day}`,
    hora: `${valores.hour}:${valores.minute}:${valores.second}`,
  };
}

function atividadeVencida(data, hora) {
  const agora = agoraChapeco();

  const horario = hora.length === 5 ? `${hora}:00` : hora;

  return `${data}T${horario}` <= `${agora.data}T${agora.hora}`;
}

module.exports = {
  agoraChapeco,
  atividadeVencida,
};
