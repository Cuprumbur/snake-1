class LeeAlgorithm {

    // <summary>
    // /// Инициализирует новый экземпляр объекта с полем и указанием начальной точки
    // /// </summary>
    constructor(array) {
        this._step = 0;
        this._finishingCellMarked = false;
        this._finishPointI = 0;
        this._finishPointJ = 0;

        this.Path = [];
        this.ArrayGraph = array;
        this.Width = this.ArrayGraph.length;
        this.Heidth = this.ArrayGraph[0].length

        let point = this.FindStartCell();
        this.SetStarCell(point.x, point.y);
        this.LengthPath = 0;
        this.PathFound = this.PathSearch();

    }


    FindStartCell(startX, startY) {
        let w = this.Width;
        let h = this.Heidth;

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if (this.ArrayGraph[i][j] == Figures.StartPosition) {
                    return { x: i, y: j };
                }
            }
        }
        throw new Error("Нет начальной точки");
    }


    SetStarCell(startX, startY) {
        if (startX > this.Width || startX < 0)
            throw new Error("Неправильная координата x");
        if (startY > this.Heidth || startY < 0)
            throw new Error("Неправильная координата x");
        //Пометить стартовую ячейку d:= 0
        this._step = 0;
        this.ArrayGraph[startX][startY] = this._step;
    }

    PathSearch() {  //bool

        if (this.WavePropagation())
            if (this.RestorePath())
                return true;
        return false;
    }

    // Есть. Ортогональный путь
    // Todo. Ортогонально-диагональный путь

    /// <summary>
    /// Распространение волны
    /// </summary>
    /// <returns></returns>
    WavePropagation()//bool
    {
        //ЦИКЛ
        //  ДЛЯ каждой ячейки loc, помеченной числом d
        //    пометить все соседние свободные непомеченные ячейки числом d + 1
        //  КЦ
        //  d := d + 1
        //ПОКА(финишная ячейка не помечена) И(есть возможность распространения волны)

        let w = this.Width;
        let h = this.Heidth;

        let finished = false;
        do {
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (this.ArrayGraph[i][j] == this._step) {
                        // Пометить все соседние свободные непомеченные ячейки числом d + 1
                        if (i != w - 1)
                            if (this.ArrayGraph[i + 1][j] == Figures.EmptySpace) this.ArrayGraph[i + 1][j] = this._step + 1;
                        if (j != h - 1)
                            if (this.ArrayGraph[i][j + 1] == Figures.EmptySpace) this.ArrayGraph[i][j + 1] = this._step + 1;
                        if (i != 0)
                            if (this.ArrayGraph[i - 1][j] == Figures.EmptySpace) this.ArrayGraph[i - 1][j] = this._step + 1;
                        if (j != 0)
                            if (this.ArrayGraph[i][j - 1] == Figures.EmptySpace) this.ArrayGraph[i][j - 1] = this._step + 1;

                        // Путь до финиша проложен
                        if (i < w - 1)
                            if (this.ArrayGraph[i + 1][j] == Figures.Destination) {
                                this._finishPointI = i + 1;
                                this._finishPointJ = j;
                                finished = true;
                            }
                        if (j < h - 1)
                            if (this.ArrayGraph[i][j + 1] == Figures.Destination) {
                                this._finishPointI = i;
                                this._finishPointJ = j + 1;
                                finished = true;
                            }
                        if (i > 0)
                            if (this.ArrayGraph[i - 1][j] == Figures.Destination) {
                                this._finishPointI = i - 1;
                                this._finishPointJ = j;
                                finished = true;
                            }
                        if (j > 0)
                            if (this.ArrayGraph[i][j - 1] == Figures.Destination) {
                                this._finishPointI = i;
                                this._finishPointJ = j - 1;
                                finished = true;
                            }
                    }

                }
            }
            this._step++;
            //ПОКА(финишная ячейка не помечена) И(есть возможность распространения волны)
        } while (!finished && this._step < w * h);
        this._finishingCellMarked = finished;
        return finished;
    }

    /// <summary>
    ///  Восстановление пути
    /// </summary>
    /// <returns></returns>
    RestorePath() //bool
    {
        // ЕСЛИ финишная ячейка помечена
        // ТО
        //   перейти в финишную ячейку
        //   ЦИКЛ
        //     выбрать среди соседних ячейку, помеченную числом на 1 меньше числа в текущей ячейке
        //     перейти в выбранную ячейку и добавить её к пути
        //   ПОКА текущая ячейка — не стартовая
        //   ВОЗВРАТ путь найден
        // ИНАЧЕ
        //   ВОЗВРАТ путь не найден
        if (!this._finishingCellMarked)
            return false;

        let w = this.Width;
        let h = this.Heidth;
        let i = this._finishPointI;
        let j = this._finishPointJ;
        this.Path = [];
        this.AddToPath(i, j);

        do {
            if (i < w - 1)
                if (this.ArrayGraph[i + 1][j] == this._step - 1) {
                    this.AddToPath(++i, j);
                }
            if (j < h - 1)
                if (this.ArrayGraph[i][j + 1] == this._step - 1) {
                    this.AddToPath(i, ++j);
                }
            if (i > 0)
                if (this.ArrayGraph[i - 1][j] == this._step - 1) {
                    this.AddToPath(--i, j);
                }
            if (j > 0)
                if (this.ArrayGraph[i][j - 1] == this._step - 1) {
                    this.AddToPath(i, --j);
                }
            this._step--;
        } while (this._step != 0);
        return true;
    }

    AddToPath(x, y) {
        this.Path.push({ x, y });
    }
}

var Figures =
{
    StartPosition: 0,
    EmptySpace: -1,
    Destination: -2,
    Path: -3,
    Barrier: -4,
}

module.exports = LeeAlgorithm;
