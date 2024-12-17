export function bufferToWav(audioBuffer) {
    const numOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let offset = 44;

    // Write WAV Header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioBuffer.length * 2, true); // file size - 8
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // size of fmt chunk
    view.setUint16(20, 1, true); // format = PCM
    view.setUint16(22, numOfChannels, true); // number of channels
    view.setUint32(24, 16000, true); // sample rate (16kHz)
    view.setUint32(28, 16000 * numOfChannels * 2, true); // byte rate
    view.setUint16(32, numOfChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample (16-bit)
    writeString(view, 36, 'data');
    view.setUint32(40, audioBuffer.length * numOfChannels * 2, true); // data size

    // Write Audio Data (PCM)
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
    }

    let interleaved = interleave(channels);
    floatTo16BitPCM(view, 44, interleaved);

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function interleave(channels) {
    const length = channels[0].length;
    const result = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        result[i] = channels[0][i]; // Mono: just take the first channel
    }
    return result;
}
