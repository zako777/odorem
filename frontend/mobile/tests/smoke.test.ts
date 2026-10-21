import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'

test('Expo mobile app has a valid entry configuration', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))

  assert.equal(packageJson.main, 'expo-router/entry')
  assert.equal(existsSync(new URL('../src/app/index.tsx', import.meta.url)), true)
})
