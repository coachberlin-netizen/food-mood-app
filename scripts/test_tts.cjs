const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
async function test() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('es-ES-ElviraNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  // toStream returns an object with audioStream and metadataStream
  const result = tts.toStream('Hola, bienvenido a Food Mood. Un sorbo antes del café.');
  console.log('result type:', typeof result, Object.keys(result));
  const stream = result.audioStream || result;
  const chunks = [];
  stream.on('data', d => chunks.push(d));
  stream.on('end', () => {
    const buf = Buffer.concat(chunks);
    console.log('OK — size:', buf.length, 'bytes');
    fs.writeFileSync('C:/Users/coach/Downloads/test_tts.mp3', buf);
    console.log('Saved to Downloads');
  });
  stream.on('error', e => console.error('Stream ERR:', e.message));
}
test().catch(e => console.error('CATCH:', e.message, e.stack));
