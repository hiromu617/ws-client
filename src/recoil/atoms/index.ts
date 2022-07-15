import { atom } from 'recoil';

export const voltageState = atom<[number, number][][]>({
  key: 'voltage',
  default: [[], [], [], [], [], [], [], [], []],
});

// export const voltage0 = atom<[number, number][]>({
//   key: 'voltage0',
//   default: [],
// });

// export const voltage1 = atom<[number, number][]>({
//   key: 'voltage1',
//   default: [],
// });

// export const voltage2 = atom<[number, number][]>({
//   key: 'voltage2',
//   default: [],
// });

// export const voltage3 = atom<[number, number][]>({
//   key: 'voltage3',
//   default: [],
// });

// export const voltage4 = atom<[number, number][]>({
//   key: 'voltage4',
//   default: [],
// });

// export const voltage5 = atom<[number, number][]>({
//   key: 'voltage5',
//   default: [],
// });

// export const voltage6 = atom<[number, number][]>({
//   key: 'voltage6',
//   default: [],
// });

// export const voltage7 = atom<[number, number][]>({
//   key: 'voltage7',
//   default: [],
// });

// export const voltage8 = atom<[number, number][]>({
//   key: 'voltage8',
//   default: [],
// });
