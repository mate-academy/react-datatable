# React Datatable component
Используя данные [phonesFromServer](https://mate-academy.github.io/phone-catalogue-static/api/phones.json)
напишите компонент **Datatable** который будет работать аналогично [этому примеру](https://datatables.net/)

1. Он принимает данные в виде массива объектов `items` и конфигурацию колонок `columnConfig`
1. По полученным данным строит таблицу
    ```jsx harmony
    const App = () => {
      const columnConfig = {
        name: { // так называется ключ в объекте для которого конфигурируется колонка
          title: 'Название', // в таблице колонка будет так называться
          sortType: 'string', // Значит что по этой колонке можно сортировать (сравниваем строки)
          isSearchable: true, // Значит по этой колонке будет происходить поиск и фильтрация
        },
        age: {
          title: 'Возраст',
          sortType: 'number',
        },
        snippet: { // Только для тех ключей которые есть в columnConfig будут колонки в таблице
          title: 'Описание',
          isSearchable: true, // В этой колонке тоже будет происходить поиск query
        }
      };

      return (
        <Datatable
          items={phonesFromServer}
          columnConfig={columnConfig}
          onSelectionChanged={(selectedItems) => {}}
        />
      );

    }
    ```
1. Настройки колонок берём из `columsConfig` (если свойства нет то колонку не показываем)
1. Для колонок у которых есть `sortType` реализуем сортировку в обе стороны. (Учитывать тип данных)
1. Реализуем текстовое поле для фильтрации строк по полям у которых `isSearchable: true` (поиск регистронезависимый)
1. Если передан callback `onSelectionChanged` добавить колонку с чекбоксом для выделения
    - В заголовке должен быть аналогичный чекбокс который выделяет всё
    - Если снять галочку в заголовке - снимаются все галочки
    - Если снять галочку с одной сроки то галочка в загаловке тоже снимает
    - При любом изменении вызывать callback `onSelectionChanged` передавая ему массив выбранных объектов
1. Добавить пагинацию сверу краткую, снизу полную (с информацием `6 - 10 of 20`).
    Детальнее [тут](https://github.com/mate-academy/react_pagination#react-pagination)
1. (*) Реализовать возможность редактирования данных в ячейках таблицы по двойному клику
    - показывать текстовое поле с `х` или `esc` для отмены
    - сохранять по `enter` или потере фокуса
1. (**) Отдельно можно реализовать сохрание данных таблицы в `localStorage`
    - перед закрытием страницы спрашивать пользователя хочет ли он сохранить данные
    - Выдавать запрос только если данные в таблице отличаются от сохранённых

## Workflow
- Fork the repository with task
- Clone forked repository
    ```bash
    git clone git@github.com:<user_name>/<task_repository>.git
    ```
- Run `npm install` to install dependencies.
- Then develop

## Development mode
- Run `npm start` to start development server on `http://localhost:3000`
    When you run server the command line window will no longer be available for
    writing commands until you stop server (`ctrl + c`). All other commands you
    need to run in new command line window.
- Follow [HTML, CSS styleguide](https://mate-academy.github.io/style-guides/htmlcss.html)
- Follow [the simplified JS styleguide](https://mate-academy.github.io/style-guides/javascript-standard-modified)
- run `npm run lint` to check code style
- When you finished add correct `homepage` to `package.json` and run `npm run deploy`
- Add links to your demo in readme.md.
  - `[DEMO LINK](https://Denchepornyuk.github.io/react-datatable/)` - this will be a
  link to your index.html
- Commit and push all recent changes.
- Create `Pull Request` from forked repo `(<branch_name>)` to original repo
(`master`).
- Add a link at `PR` to Google Spreadsheets.


## Project structure
- `src/` - directory for css, js, image, fonts files
- `build/` - directory for built pages

You should be writing code in `src/` directory.
