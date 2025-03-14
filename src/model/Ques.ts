// import quiz from "../../data/quiz.json";

export default class Ques {
    id: number = -1;
    ques: string|null = null;

    options: {[x: string]: string}|null = null;

    correct: string|null = null;

    selected: string|null = null;

    constructor(id: number, data: any) {
        this.id = id;
        this.ques = data.ques;
        this.options = data.options;
        this.correct = data.correct;
        this.selected = null;
    }
}