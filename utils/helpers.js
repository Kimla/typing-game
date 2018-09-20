import wordList from './words';

export default function getWords(num) {
    const words = wordList.split('\n').filter(word => word.length > 0);
    const choosen = [];

    for (let i = 0; i < num; i++) {
        const number = Math.floor(Math.random() * words.length);
        choosen.push(words[number]);
    }

    return choosen;
}
