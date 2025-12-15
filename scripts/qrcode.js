/* eslint-disable no-undef */
import encodeQR from 'qr';

const txt = 'https://pausebreak.github.io/darts/';
const svgElement = encodeQR(txt, 'svg');

console.log(svgElement)
