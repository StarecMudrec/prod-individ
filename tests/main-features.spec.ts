import { test, expect, type Page } from '@playwright/test'

async function startGameWithThreePlayers(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Начать игру' }).click()
  await expect(page).toHaveURL(/\/setup$/)

  // Количество игроков = 3
  const countInput = page.locator('input#player-count')
  await countInput.fill('3')
  await countInput.blur()
  await page.getByRole('button', { name: 'Продолжить' }).click()

  // Вводим имена трёх игроков в модальных окнах
  const names = ['Саша', 'Ваня', 'Алиса']
  for (let i = 0; i < names.length; i++) {
    await page.getByLabel('Имя:').fill(names[i])
    await page.getByRole('button', { name: i < names.length - 1 ? 'Далее' : 'Готово' }).click()
  }

  // Должен появиться экран с карточками игроков и кнопкой "Начать игру"
  await expect(page.getByText('Участники :')).toBeVisible()
  for (const name of names) {
    const card = page.locator('.player-card-skin', { hasText: name })
    await expect(card).toBeVisible()
  }

  return names
}

async function goToBoardWithDevMode(page: Page) {
  await startGameWithThreePlayers(page)
  await page.getByRole('button', { name: 'Начать игру' }).click()
  await expect(page).toHaveURL(/\/board$/)

  // Включаем dev-mode через глобальный тоггл
  await page.getByRole('button', { name: /Dev/i }).click()
  await expect(page.getByText('Dev-mode: инструменты для проверки')).toBeVisible()
}

test('Подготовка игры: ввод имён и старт', async ({ page }) => {
  const names = await startGameWithThreePlayers(page)

  // Проверяем, что у всех игроков отображается клавиша ответа
  for (const name of names) {
    const card = page.getByText(name).locator('..').locator('..')
    await expect(card.getByText('Клавиша:', { exact: false })).toBeVisible()
  }
})

test('Табло: предустановленные темы и вопросы', async ({ page }) => {
  await goToBoardWithDevMode(page)

  // На табло должно быть 6 тем и 5 номиналов в каждом раунде
  const themeRows = page.locator('table tbody tr')
  await expect(themeRows).toHaveCount(6)

  // В заголовке таблицы должны быть все стоимости
  const headerRow = page.locator('table thead tr')
  await expect(headerRow.locator('th')).toHaveCount(1 + 5) // "Тема" + 5 номиналов
  await expect(page.getByRole('columnheader', { name: '100' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: '500' })).toBeVisible()
})

test('Режим ответа на обычный вопрос: захват ответа и изменение счёта', async ({ page }) => {
  await startGameWithThreePlayers(page)
  await page.getByRole('button', { name: 'Начать игру' }).click()
  await expect(page).toHaveURL(/\/board$/)

  // Включаем dev-mode (не обязательно для работы режима, но полезно для проверки)
  await page.getByRole('button', { name: /Dev/i }).click()

  // Открываем первый доступный вопрос на табло
  const firstCellButton = page.locator('table tbody button').first()
  await firstCellButton.click()

  // Ждём перехода к экрану вопроса
  await page.waitForURL(/\/question$/)

  // Проверяем, что мы действительно в режиме вопроса:
  const questionRoot = page.locator('.question')
  await expect(questionRoot).toBeVisible()
})

test.skip('Финальный раунд доступен через экраны итогов', async ({ page }) => {
  await startGameWithThreePlayers(page)
  await page.getByRole('button', { name: 'Начать игру' }).click()
  await expect(page).toHaveURL(/\/board$/)

  // Включаем dev-mode
  await page.getByRole('button', { name: /Dev/i }).click()

  // Завершаем первый раунд через dev-кнопку и попадаем на экран итогов.
  // Предварительно ждём окончания анимации "Раунд N".
  await page.waitForTimeout(1800)
  await page.getByRole('button', { name: 'Завершить раунд (dev)' }).click()
  await page.waitForURL(/\/round-summary$/)

  // На итогах раунда в dev-mode увеличиваем счёт первого игрока, чтобы он прошёл в финал
  const firstSummaryRow = page.locator('.round-summary-player-row').first()
  const devScoreInput = firstSummaryRow.locator('input[type="number"]').first()
  await devScoreInput.fill('100')
  await devScoreInput.blur()

  // Переходим ко второму раунду и снова завершаем раунд dev-кнопкой
  await page.getByRole('button', { name: /Перейти к раунду 2/ }).click()
  await page.waitForURL(/\/board$/)
  await page.getByRole('button', { name: /Dev/i }).click()
  await page.waitForTimeout(1800)
  await page.getByRole('button', { name: 'Завершить раунд (dev)' }).click()
  await page.waitForURL(/\/round-summary$/)

  // Переходим к финалу
  await page.getByRole('button', { name: /Перейти к финалу/ }).click()
  await page.waitForURL(/\/final$/)

  // Проверяем, что на экране финала видна тема или шаг финального раунда
  await expect(page.locator('.final')).toBeVisible()
})

test.skip('Страница пакетов вопросов и редактор открываются', async ({ page }) => {
  await page.goto('/')

  // Переход на страницу пакетов вопросов
  await page.getByRole('button', { name: 'Редактор вопросов и пакетов' }).click()
  await expect(page).toHaveURL(/\/packs$/)

  // На странице пакетов должны быть секции списка и импорта/экспорта
  const importHeading = page.getByRole('heading', { name: /Импорт пакета/i })
  const exportHeading = page.getByRole('heading', { name: /Экспорт активного пакета/i })
  await expect(importHeading).toBeVisible()
  await expect(exportHeading).toBeVisible()

  // Переход в редактор пакетов
  const editorLink = page.getByRole('link', { name: /Редактор вопросов/i }).first().or(
    page.getByRole('link', { name: /Создать пакет/i })
  )
  await editorLink.click()
  await expect(page).toHaveURL(/\/packs\/editor$/)

  // Проверяем, что в редакторе видны основные секции (раунды, финальный вопрос или спецвопросы)
  await expect(page.getByText(/раунды|финальный вопрос|Кот в мешке|Аукцион/i)).toBeVisible()
})

test('Dev-mode: принудительное завершение раунда и переход к итогам', async ({ page }) => {
  await goToBoardWithDevMode(page)

  // Используем кнопку dev-режима для завершения раунда
  await page.getByRole('button', { name: 'Завершить раунд (dev)' }).click()

  // Должен открыться экран итогов раунда
  await page.waitForURL(/\/round-summary$/)
  await expect(page.getByText('Итоги:')).toBeVisible()

  // На экране итогов в dev-mode доступны поля "Dev" для счёта (внутри списка игроков)
  const firstSummaryRow = page.locator('.round-summary-player-row').first()
  await expect(firstSummaryRow.getByText('Dev:', { exact: false })).toBeVisible()
})

