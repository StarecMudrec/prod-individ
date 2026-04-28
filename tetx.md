- Полностью переработаны кнопки: вместо стандартных Ant Design использованы кнопки Wireframe 'sketch' buttons (взято с codepen и доработано под нужды проекта). Добавлены варианты кнопок: primary, secondary, outline, dev, giant, а также специализированные для типов вопросов (auc, cat, disabled)

- Переключатель режима разработчика перенесен в отдельный компонент, переработан его внешний вид (на основе Wireframe 'sketch' buttons)

- Интегрированы новые шрифты: Rampart One, Seymour One, Dela Gothic One (с Google Fonts) и Chicoree Em, QR Comic Beta, TT Norms Pro, Faberge (локальные файлы). Шрифты подключены через index.html и CSS

- Обновлена цветовая палитра сайта, введены CSS‑переменные для всех новых цветов, в variables.css переопределены многие цветовые переменные, добавлены новые семейства шрифтов

- Добавлены анимации: название и подзаголовок на HomeView, имя текущего игрока на BoardView

- визуйальный стиль PlayerCard переделан наподобие Wireframe 'sketch' buttons

- Приведены к +- единому стилю некоторые экраны (BoardView, GameStartView, HomeView, SetupView)

- Расширена конфигурация Tailwind: добавлены новые цвета (button‑*, text‑muted‑alot, surface‑darkest), шрифты (rampart, seymour, dela, chicoree, qr‑comic, tt‑norms, faberge), кастомные межбуквенные интервалы (tight-negative, tight-less-negative).

- В main.css добавлены @font-face для всех локальных шрифтов, обновлены глобальные стили body и утилиты теней текста.
